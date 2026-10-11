#!/usr/bin/env bash
#
# upgrade.sh — move to a newer upstream release, safely.
#
# This is the whole answer to "how do I get updates?". There is no merge and no
# rebase, because nothing is forked and no diff is stored. An upgrade is:
#
#   1. look at what upstream changed in the files our codemod depends on
#   2. dry-run the codemod against the new tag
#   3. if the anchors still match, build and smoke-test
#   4. if they do not, fix the one transform that moved, then repeat
#
# Step 2 is the safety net. It takes seconds and it tells you, before you build
# anything, whether this release will rebrand cleanly.
#
# Usage:
#   ./infra/overlay/upgrade.sh v2.11.4
#   ./infra/overlay/upgrade.sh v2.11.4 --build      # also build the image
#   ./infra/overlay/upgrade.sh --list               # what releases exist

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BRAND_JSON="${REPO_ROOT}/packages/brand/brand.json"
WORK="${REPO_ROOT}/.upstream-work"
UPSTREAM_REPO="$(node -p "require('${BRAND_JSON}').upstream.repo")"
CURRENT_TAG="$(node -p "require('${BRAND_JSON}').upstream.pinnedTag")"

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
dim()  { printf '\033[2m%s\033[0m\n' "$*"; }
red()  { printf '\033[31m%s\033[0m\n' "$*"; }
grn()  { printf '\033[32m%s\033[0m\n' "$*"; }
ylw()  { printf '\033[33m%s\033[0m\n' "$*"; }

# Files the codemod depends on. If upstream touched one of these, the upgrade
# needs a human look; if it did not, the rebrand is almost certainly fine.
WATCHED=(
  "apps/frontend/src/app/colors.scss"
  "apps/frontend/src/components/new-layout/logo.tsx"
  "apps/frontend/src/components/ui/logo-text.component.tsx"
  "apps/frontend/public/logo.svg"
  "apps/frontend/tailwind.config.js"
  "libraries/react-shared-libraries/src/translation/locales/en/translation.json"
)

ensure_clone() {
  if [ ! -d "${WORK}/.git" ]; then
    bold "Cloning upstream (first run only)…"
    rm -rf "${WORK}"
    git clone --filter=blob:none --no-checkout "${UPSTREAM_REPO}" "${WORK}"
  fi
  git -C "${WORK}" fetch --tags --force --quiet
}

if [ "${1:-}" = "--list" ]; then
  ensure_clone
  bold "Releases after ${CURRENT_TAG}:"
  git -C "${WORK}" tag --sort=-creatordate \
    | head -30 \
    | while read -r t; do
        d=$(git -C "${WORK}" log -1 --format=%as "$t" 2>/dev/null || echo '?')
        marker=" "
        [ "$t" = "${CURRENT_TAG}" ] && marker="*"
        printf '  %s %-14s %s\n' "$marker" "$t" "$d"
      done
  dim "  (* = currently pinned)"
  exit 0
fi

TARGET_TAG="${1:-}"
DO_BUILD="${2:-}"

if [ -z "${TARGET_TAG}" ]; then
  red "Usage: $0 <tag> [--build]   |   $0 --list"
  exit 2
fi

ensure_clone

if ! git -C "${WORK}" rev-parse "${TARGET_TAG}" >/dev/null 2>&1; then
  red "Tag ${TARGET_TAG} does not exist upstream."
  dim "Run '$0 --list' to see what does."
  exit 2
fi

echo
bold "Upgrade  ${CURRENT_TAG}  ->  ${TARGET_TAG}"
echo

# ---------------------------------------------------------------------------
# 1. What changed, and does any of it touch us?
# ---------------------------------------------------------------------------
bold "1. Upstream changes"
CHANGED_TOTAL=$(git -C "${WORK}" diff --name-only "${CURRENT_TAG}".."${TARGET_TAG}" | wc -l | tr -d ' ')
dim "   ${CHANGED_TOTAL} file(s) changed in total"

TOUCHED=()
for f in "${WATCHED[@]}"; do
  if git -C "${WORK}" diff --quiet "${CURRENT_TAG}".."${TARGET_TAG}" -- "$f" 2>/dev/null; then
    :
  else
    TOUCHED+=("$f")
  fi
done

if [ ${#TOUCHED[@]} -eq 0 ]; then
  grn "   None of the files the rebrand depends on were touched."
else
  ylw "   ${#TOUCHED[@]} file(s) the rebrand depends on were changed:"
  for f in "${TOUCHED[@]}"; do
    stat=$(git -C "${WORK}" diff --shortstat "${CURRENT_TAG}".."${TARGET_TAG}" -- "$f" | tr -d '\n')
    printf '     - %s\n       %s\n' "$f" "${stat:-modified}"
  done
  dim "   Review with: git -C ${WORK} diff ${CURRENT_TAG}..${TARGET_TAG} -- <file>"
fi

# Migrations are the other thing that genuinely matters on an upgrade.
MIGRATIONS=$(git -C "${WORK}" diff --name-only "${CURRENT_TAG}".."${TARGET_TAG}" \
  | grep -Ei 'migration|schema\.prisma' || true)
if [ -n "${MIGRATIONS}" ]; then
  echo
  ylw "   Database changes in this release:"
  echo "${MIGRATIONS}" | sed 's/^/     - /'
  red  "   >>> BACK UP THE DATABASE BEFORE DEPLOYING. See ops/RUNBOOK.md."
fi

# The one-way door.
MAJOR_MINOR=$(echo "${TARGET_TAG}" | sed 's/^v//' | cut -d. -f1,2)
if [ "$(printf '%s\n2.11\n' "${MAJOR_MINOR}" | sort -V | head -1)" != "${MAJOR_MINOR}" ]; then
  echo
  red  "   ${TARGET_TAG} is past the 2.11 line."
  ylw  "   Upstream replaced the queue engine from 2.12.0 and the deployment"
  ylw  "   topology changed. This is a project, not a tag bump — read"
  ylw  "   docs/02-where-to-edit-the-app.md before continuing."
fi

# ---------------------------------------------------------------------------
# 2. Will the rebrand still apply?
# ---------------------------------------------------------------------------
echo
bold "2. Rebrand dry-run against ${TARGET_TAG}"

STAGE="${WORK}-stage"
rm -rf "${STAGE}"
git -C "${WORK}" worktree prune >/dev/null 2>&1 || true
git clone --depth 1 --branch "${TARGET_TAG}" --quiet "${UPSTREAM_REPO}" "${STAGE}"
rm -rf "${STAGE}/.git"

if node "${REPO_ROOT}/infra/overlay/apply-brand.mjs" --target "${STAGE}" --dry-run; then
  grn "   Rebrand applies cleanly to ${TARGET_TAG}."
else
  echo
  red "   The rebrand does NOT apply to ${TARGET_TAG}."
  dim "   Fix the failing transform in infra/overlay/apply-brand.mjs, then re-run."
  dim "   The staged checkout is at ${STAGE} if you want to look at the source."
  exit 1
fi

# ---------------------------------------------------------------------------
# 3. Commit the pin
# ---------------------------------------------------------------------------
echo
bold "3. Updating the pin"
node -e "
  const fs = require('fs');
  const p = '${BRAND_JSON}';
  const b = JSON.parse(fs.readFileSync(p, 'utf8'));
  b.upstream.pinnedTag = '${TARGET_TAG}';
  fs.writeFileSync(p, JSON.stringify(b, null, 2) + '\n');
"
grn "   brand.json now pins ${TARGET_TAG}"
dim "   Commit this change so the deployed version is recorded in git."

# ---------------------------------------------------------------------------
# 4. Build
# ---------------------------------------------------------------------------
if [ "${DO_BUILD}" = "--build" ]; then
  echo
  bold "4. Building the branded image"
  docker build \
    -f "${REPO_ROOT}/infra/overlay/Dockerfile" \
    --build-arg "UPSTREAM_TAG=${TARGET_TAG}" \
    -t "app:${TARGET_TAG}-brand" \
    "${REPO_ROOT}"
  grn "   Built app:${TARGET_TAG}-brand"
  echo
  dim "   Next: deploy to a non-production environment, run"
  dim "   'node infra/overlay/smoke-test.mjs --url <that-url>', and only then"
  dim "   cut production over."
else
  echo
  dim "Not building (pass --build to build the image)."
fi

rm -rf "${STAGE}"
echo
grn "Done."
