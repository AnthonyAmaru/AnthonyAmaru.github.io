# Anthony Amaru

A password-gated, mobile-first personal website for Anthony's resume, interests, music, and media. It includes:

- public-domain FAA aviation practice with score and missed-question history
- the original interactive Mandarin notebook plus multiple-choice quizzes
- a private manuscript studio with import, export, and cloud content sync
- Supabase-backed music, quiz history, and private editable content across devices
- a single-question Big Pickle bubble beside the music player for general, aviation, Mandarin, and writing questions
- an AI Packages page with downloadable Markdown blueprints for reproducing the current architecture
- a Supabase Edge Function gateway for authenticated OpenCode Big Pickle requests
- a single-owner WhatsApp Cloud API assistant with signed webhooks, private history, progress snapshots, and template-based scheduled check-ins

The entrance password is a client-side privacy gate, not server-side authentication. Protected writes and AI calls use Supabase Auth and Row Level Security.

See [the reproduction guide](docs/PERSONAL_SITE_REPRODUCTION_GUIDE.md) for the living GitHub, GoDaddy, Supabase, browser-assisted setup, corrected code structure, and mandatory bug-fix ledger.

See [the Mandarin lesson pipeline](docs/MANDARIN_LESSON_PIPELINE.md) for turning written notes, Granola notes, and lesson images into append-only lessons and cumulative reshuffled quizzes.

Live at [anthonyamaru.com](https://anthonyamaru.com).
