# Reference media slot

This folder is the media slot for the home page and the integration pages.
Everything in it except this README is **ignored by git**, so nothing dropped
here can be committed or deployed by accident.

The files it is designed around were captured from postiz.com on 2026-10-12 so
the page could be judged with real footage in place instead of empty frames:
the product clips (`*.webm`), the stills that ship with them (`*.webp`,
`*.jpg`) and the assistant logos in `agents/`. **Those are Postiz's marketing
assets. They are not licensed for this site and none of them may be live at
launch.** They exist for one reason: to decide, slot by slot, what to record for
real.

## How the slot works

- `src/components/ui/video-frame.tsx` looks for `<name>.webm` here at build
  time. Present: a looping, muted video with `<name>.webp|jpg` as its poster.
  Absent: a quiet empty frame with the slot's name in it. Nothing breaks when a
  file is missing.
- `src/lib/guards.ts` **refuses to build** while any clip is here unless
  `ALLOW_PLACEHOLDERS=1` is set — the same switch that allows the placeholder
  product name and the invented testimonials. Dropping that variable before
  launch therefore blocks any build that still contains this folder.

## Putting the reference files on a deployed preview

Because the folder is ignored, a deploy only carries what you add on purpose:

```sh
git add -f apps/web/public/preview
git commit -m "Add reference footage for layout review"
git push
```

That is a deliberate step, taken by you, and it is reversible: `git rm -r
--cached apps/web/public/preview` and a commit takes them back out. Do it
before launch, and keep `ALLOW_PLACEHOLDERS` unset in the launch environment so
the guard above can catch anything left behind.

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
| `scheduling.webm` + `.webp` | showcase panel (classic), capabilities: planning | the week calendar | 1396×722 |
| `chatgpt.webm` | assistants grid | ChatGPT asked for two posts | 1280×920 |
| `claude-mcp.webm` | assistants grid | Claude desktop over MCP | 1320×920 |
| `claude.webm` | assistants grid | a terminal session | 1280×920 |
| `grok-bot.webm` | assistants grid | a bot repurposing a top post | 1282×892 |
| `hermes.webm` | assistants grid | a messaging agent | 1280×892 |
| `muse.webm` | assistants grid | a chat agent | 1280×920 |
| `ai-agents.webm` + `.webp` | capabilities: agents | a grid of assistant logos | 900×722 |
| `design-ai.webm` + `.webp` | capabilities: editor | the image editor | 1396×1000 |
| `3.webm` | capabilities: team | roles and permissions | 900×738 |
| `4.webm` | capabilities: preview | a post previewed in place | 1396×796 |
| `5.webm` | capabilities: analytics | analytics tiles | 1396×1200 |
| `api.webm` | automation: REST API | an API client calling the public API | 1650×700 |
| `agents/*.svg` | assistants grid | assistant logos | — |
