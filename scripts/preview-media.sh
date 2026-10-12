#!/usr/bin/env bash
#
# Copy reference footage into the local preview slot.
#
# The target directory is gitignored, so anything placed there is visible when
# you run the site locally and cannot be committed or deployed. Use it to judge
# a layout with real media in it before deciding what to record yourself.
#
#   ./scripts/preview-media.sh ~/Downloads/some-clips
#
set -euo pipefail

SRC="${1:-}"
DEST="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/apps/web/public/preview"

if [ -z "$SRC" ] || [ ! -d "$SRC" ]; then
  echo "usage: $0 <directory containing .webm/.mp4 files>" >&2
  exit 2
fi

mkdir -p "$DEST"
count=0
for f in "$SRC"/*.webm "$SRC"/*.mp4; do
  [ -e "$f" ] || continue
  cp "$f" "$DEST/"
  count=$((count + 1))
done

echo "copied $count file(s) -> apps/web/public/preview/"
echo
echo "now:  pnpm dev     then open http://localhost:3100"
echo
echo "These files are gitignored. Nothing here can be committed or deployed."
