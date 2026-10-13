# Reference media slot

This folder is the media slot for the home page and the integration pages.
The folder is **ignored by git**, so a new file dropped here is never committed
by accident; the files below were added on purpose with `git add -f`.

While the site is an in-development prototype, the slots are filled with
reference media taken from postiz.com's home page, so layouts can be judged with
real footage in place instead of empty frames: the product clips (`*.webm`),
the stills that ship with them (`*.webp`, `*.jpg`), the assistant logos in
`agents/`, the channel icons in `socials/` and a few hand-drawn decorations. **They are Postiz's marketing assets, used here as temporary
stand-ins. The team will replace every one of them with our own recordings
before launch.**

Several of them show the other product's name on screen: `hero-classic*` shows
its wordmark in the app header, and the prompts in `hero-agentic*` and
`chatgpt` ask to schedule posts "in Postiz". Those are the first to replace.

## How the slot works

- `src/components/ui/video-frame.tsx` looks for `<name>.webm` here at build
  time. Present: a looping, muted video with `<name>.webp|jpg` as its poster.
  Absent: a quiet empty frame with the slot's name in it. Nothing breaks when a
  file is missing.
- `src/lib/guards.ts` prints a warning at build and dev time while any clip
  is here, alongside the warnings for the placeholder product name and the
  invented testimonials. `ALLOW_PLACEHOLDERS=1` silences all three. It does not
  stop the build, so check the build log for it before launch.

## What is committed

The reference files listed below are committed (with `git add -f`, because the
folder is ignored) so the deployed prototype shows them. To take them back out:

```sh
git rm -r --cached apps/web/public/preview
git add -f apps/web/public/preview/README.md
git commit -m "Remove reference footage"
```

Do that, or replace every file, before launch.

## Replacing a file

1. Record the same screen in your own instance at the size listed below, export
   as WebM (VP9, no audio), save it under the same filename. The slot picks it
   up with no code change.
2. Or delete the file. The section keeps its copy and shows the empty frame.
3. When every file here is yours, move the folder's contents to
   `public/media/`, point the slots there, and delete this README together with
   the `previewMediaPresent` clause in `src/lib/guards.ts`.

## What the slots expect

| file | used by | shows | size |
| --- | --- | --- | --- |
| `hero-agentic.webm` + `.jpg` | showcase panel (agentic) | an assistant asked for four posts | 1920×1018 |
| `hero-agentic-mobile.webm` + `.jpg` | showcase panel (agentic), 640px and below | portrait cut of the same | 1062×1080 |
| `hero-classic.webm` + `.jpg` | showcase panel (classic) | the calendar, generating posts with AI | 1920×1018 |
| `hero-classic-mobile.webm` + `.jpg` | showcase panel (classic), 640px and below | portrait cut of the same | 1004×1022 |
| `scheduling.webm` + `.webp` | capabilities: planning | the week calendar | 1396×722 |
| `chatgpt.webm` + `.webp` | assistants grid | ChatGPT asked for two posts | 1280×920 |
| `claude-mcp.webm` + `.webp` | assistants grid | Claude desktop over MCP | 1320×920 |
| `claude.webm` + `.webp` | assistants grid | a terminal session | 1280×920 |
| `grok-bot.webm` + `.webp` | assistants grid | a bot repurposing a top post | 1282×892 |
| `hermes.webm` + `.webp` | assistants grid | a messaging agent | 1280×892 |
| `muse.webm` + `.webp` | assistants grid | a chat agent | 1280×920 |
| `ai-agents.webm` + `.webp` | capabilities: agents | a grid of assistant logos | 900×722 |
| `design-ai.webm` + `.webp` | capabilities: editor | the image editor | 1396×1000 |
| `3.webm` | capabilities: team | roles and permissions | 900×738 |
| `4.webm` | capabilities: preview | a post previewed in place | 1396×796 |
| `5.webm` | capabilities: analytics | analytics tiles | 1396×1200 |
| `api.webm` + `.webp` | assistants: "Automate" card | an API client calling the public API | 1650×700 |
| `in-action.webm` (+ optional `.webp`) | home: "See it in action" frame | a full product demo; until it exists the frame shows empty with a play badge | 1280×720 (16:9) |
| `agents/*.svg` | header AI Agents menu, hero headline, integration pages | assistant tile logos: the 19 files from postiz.com plus `gemini`, `deepseek`, `kimi` taken from its header markup | 24px tiles |
| `agents/glyphs/hermes-icon.svg` | assistants grid (Hermes title mark) | white Hermes mark; the other title marks are inline SVGs in `assistants-glyphs.tsx` | 37×37 |
| `socials/<slug>.svg` | hero icon rows, header Channels menu, channel wall | full-colour app icons, one per sellable channel, rendered by `SocialIcon` | 70×70 |
| `capabilities/{3,4,5}.webp` | capabilities panels | desktop stills for clips that ship without one (first frame of the clip) | as the clip |
| `capabilities/mobile/*.webm` + `.webp` | capabilities panels at 640px and below | the phone cut of each capabilities clip, with its first frame as the still | phone crop |
| `capabilities/inoneplace-underline.svg`, `channel-grid/providers-underline.svg`, `faq/questions-underline.svg` | section headings | hand-drawn underlines | — |
| `cta-band/doodle-cta.svg`, `doodle-cta-mobile.svg` | mid-page CTA band | arrow doodles | — |
| `testimonials/heart.svg` | testimonials heading | heart doodle | — |
| `integrations/<agent>-hero.webp`, `-hero.webm`, `-hero-mobile.webm` (claude, chatgpt, claude-code, codex, cursor, gemini) | integration page heroes and closing bands | plush mascot of each assistant's logo, with a phone cut | 694×834 |
| `channels/hero-doodle.svg`, `channels/icon-{bulb,doc,chat,star}.svg` | channel pages | hero underline and feature-card icons | 156×15, 100×100 |
| `pricing/{clover,star,clover-mob,star-mob,popular-decoration}.svg`, `pricing/tomado.png` | pricing page | hero doodles and the popular plan's flourish | — |
| `company/*.svg` | about, contact, agencies, compare pages | page-opener doodles, underline, tornado doodles, tick, CTA doodle | — |
