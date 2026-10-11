# Runbook

Operational procedures for the deployed application. Written to be followed at
two in the morning by someone who did not write it.

Fill in the identifiers below for your deployment; the originals from the
handover are given where they were known.

```
Railway project     4664df0d-7766-431d-8ddf-e3a7a662bab1
Environment         production / 934b93f8-9e42-4207-b3e3-a3c83d918db3
Region              us-west2

Service IDs
  App        685fb992-0646-4d52-8cea-80a31c1db9fd
  Redis      8846d4c1-72d7-41ce-ae4a-b94527a0051c
  Postgres   79d5e7e4-140a-4054-98b0-3413ddea89ab
```

---

## Before anything else: the two standing risks

**1. Redis is on a deprecated repository and a floating tag.**

The deployment inherited `bitnamilegacy/redis:latest`. Bitnami parked images
there after cutting their free Docker Hub catalogue, and `latest` moves. That
container carries the BullMQ queue, which is what makes scheduled posting
work — so an upstream change there stops posts going out, silently, with no
error on the app side.

This is the highest-priority fix on the list and it is twenty minutes of work.
See [Pin Redis](#pin-redis) below.

**2. There are no backups.**

Railway volumes are not backups and have no snapshot API. Until the backup job
below runs on a schedule and a restore has actually been tested, a bad
migration or a deleted volume is unrecoverable. See [Backups](#backups).

---

## Backups

Do this before any upgrade, and on a schedule.

### Database

```bash
# DATABASE_URL from the Railway dashboard: Postgres service → Variables
pg_dump "$DATABASE_URL" -Fc -f app-$(date +%F).dump
```

Always verify the dump before trusting it. A zero-byte or truncated dump that
nobody checked is the classic way to discover you had no backups:

```bash
pg_restore --list app-$(date +%F).dump | head
ls -lh app-$(date +%F).dump        # sanity-check the size against yesterday's
```

### Uploads

The `/uploads` volume holds all customer media and is **not** in the database
dump. Railway has no volume snapshot API, so copy it out:

```bash
railway link                       # select the project
railway ssh --service App
tar czf - /uploads | base64        # pipe to a local file
```

For anything past a single tenant, move `STORAGE_PROVIDER` to S3-compatible
storage. A 5 GB volume with no snapshot story is a hard ceiling on how much
customer media you can accept, and the ceiling arrives without warning.

### Restore

```bash
createdb app_restore
pg_restore -d "$TARGET_URL" --clean --if-exists app-DATE.dump
```

Test this against a scratch database **before** you need it. An untested
restore is not a backup.

---

## Pin Redis

Causes a brief queue interruption. Scheduled posts are delayed, not lost —
BullMQ persists to the volume and the workers pick up where they left off.

1. Find a digest for a maintained image:

   ```bash
   docker pull redis:7.4-alpine
   docker inspect --format='{{index .RepoDigests 0}}' redis:7.4-alpine
   ```

2. In the Railway dashboard: Redis service → Settings → Source → set the image
   to `redis:7.4-alpine@sha256:<digest>`.

3. Redeploy and watch the logs. Then confirm the queue is alive by scheduling a
   post one minute out and watching it fire.

Pin by **digest**, not tag. A tag is a pointer somebody else controls.

---

## Upgrades

### Within the 2.11 line

```bash
./infra/overlay/upgrade.sh --list        # what exists
./infra/overlay/upgrade.sh v2.11.4       # diff + dry-run the rebrand
```

Then:

1. **Back up** (above). Not optional if the release contains migrations — the
   upgrade script tells you when it does.
2. Build the branded image: `./infra/overlay/upgrade.sh v2.11.4 --build`
3. Deploy to staging, then:
   `node infra/overlay/smoke-test.mjs --url https://staging.your-app`
4. Watch deploy logs for migration errors.
5. Smoke test by hand: log in, connect a channel, schedule a post one minute
   out, confirm it publishes.
6. Only then promote to production.

### To 2.12.0 or later — a project, not a task

2.12.0 replaced BullMQ with Temporal and moved off Alpine. It needs a new
Temporal service with its own setup, and the compose topology changes.

Sequence: stand Temporal up in a non-production environment, point a **copy**
of the data at it, verify scheduled posts actually fire, then cut over. Read
the upstream migration notes first.

Do not attempt this as a tag bump.

---

## Rollback

1. Set the app image back to the previous tag.
2. **If the failed version ran migrations, the schema is ahead of the old
   code.** Restore the pre-upgrade dump. This is why step 1 of every upgrade is
   a backup.

---

## Incident: scheduled posts are not going out

This is the failure that loses customers, because it is silent — the calendar
still shows the post as scheduled.

Check in this order:

1. **Is Redis up?** Most likely cause while the image is unpinned.
   ```bash
   railway logs --service Redis
   ```
2. **Worker errors.**
   ```bash
   railway logs --service App | grep -i -E "error|failed|queue"
   ```
3. **Platform side.** Did an OAuth token expire, or did the app hit a rate
   limit? On a shared instance one customer's volume can exhaust the quota for
   everyone — that is the shared-credential failure mode, and it looks exactly
   like this.
4. **Disk.** A full `/uploads` volume fails media posts specifically, while
   text-only posts keep working. A partial failure pattern points here.

---

## Incident: a customer cannot log in

1. Is their identity enabled in the provisioning store? A lapsed payment
   suspends by disabling the identity — check whether this is billing, not a
   bug.
2. Is `DISABLE_REGISTRATION` doing what you think? Public registration is
   closed by design; customers arrive through SSO. A customer who tries to
   "sign up" will be refused, correctly, and will need the SSO link.
3. Check the OIDC endpoints are reachable from the app container.

---

## Health baseline

```
Railway:   all services SUCCESS, memory on Postgres, disk on all volumes
HTTP:      5xx rate on the app domain
Queue:     schedule a post one minute out; confirm it fires
Brand:     node infra/overlay/smoke-test.mjs --url https://your-app
```

Run the brand smoke test after every deploy. It catches the failure where the
build succeeded but the page a customer sees carries somebody else's name.

---

## Routine checks

| When | What |
|---|---|
| Every deploy | Smoke test, including the brand assertions |
| Daily | Backup job completed and the dump is a sane size |
| Weekly | Scheduled-post spot check; disk headroom on all volumes |
| Monthly | Restore a dump into a scratch database and confirm it opens |
| Monthly | `./infra/overlay/upgrade.sh --list` — how far behind are we? |
| Quarterly | Rotate `JWT_SECRET` (invalidates all sessions — announce it first) |
