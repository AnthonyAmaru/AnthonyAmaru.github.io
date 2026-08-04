# Personal Website Reproduction Guide

This guide records the architecture used for `anthonyamaru.com` and `raunyramirez.com` so the same system can be reproduced for another person without copying private credentials.

The result is a mobile-first static website hosted by GitHub Pages, a custom domain managed in GoDaddy, and a Supabase backend for authentication, cloud data, file storage, and a protected AI gateway.

## 1. Reference implementation

The two existing sites use the same backend pattern but different page layouts.

### Anthony pattern: single-page portal

- Repository: `AnthonyAmaru/AnthonyAmaru.github.io`
- Domain: `anthonyamaru.com`
- One main `index.html` with route-like sections controlled by `script.js`
- Shared design in `styles.css`
- Supabase communication in `music-cloud.js`
- Separate static sub-apps in `aviation/` and `mandarin/`
- Book editor and the single-question AI bubble use `supabase/functions/big-pickle/`
- Main areas: Resume, Interests, Music, Media

### Rauny pattern: separate pages

- Repository: `AnthonyAmaru/raunyramirez.com`
- Domain: `raunyramirez.com`
- Home page links to `resume.html`, `interests.html`, `music.html`, and `goals.html`
- Interest detail pages include Art, Travel, Books, and Shopping
- The header, navigation, music player, theme, cloud status, and admin session are shared by `script.js`, `styles.css`, and `music-cloud.js`
- The shopping UI reads approved product-feed records from Supabase

For a new person, choose one pattern and keep the data layer described below. The separate-page pattern is easier when every major section should have its own URL. The single-page pattern is useful when the site should feel like one compact application.

## 2. Recommended repository layout

```text
person-site/
├── index.html
├── resume.html                 # omit for a single-page version
├── interests.html
├── music.html
├── goals.html
├── art.html                    # optional interest detail pages
├── books.html
├── shopping.html
├── styles.css
├── script.js
├── cloud.js                    # Supabase browser client/helper
├── logo.png
├── favicon.ico
├── favicon-16.png
├── favicon-32.png
├── apple-touch-icon.png
├── icon-192.png
├── icon-512.png
├── site.webmanifest
├── CNAME
├── .nojekyll
├── docs/
│   ├── PERSONAL_SITE_REPRODUCTION_GUIDE.md
│   └── PERSONAL_SITE_DATABASE_TEMPLATE.sql
└── supabase/
    ├── functions/
    │   └── big-pickle/
    │       └── index.ts
    └── migrations/
```

Use relative asset links so the site works locally and on GitHub Pages. Add a version query when shared assets change, for example `styles.css?v=20260803-ai2`, to prevent an old browser cache from hiding a deployment.

## 3. Frontend layout and behavior

The shared interface should stay compact and button-led:

- A fixed header with logo, stable primary navigation, cloud status, and light/dark toggle
- A mobile menu at narrow widths
- A small persistent music player showing the current track
- A compact AI button beside the music player that opens a single-question popover
- A home page made of large page buttons, without decorative marketing copy
- Pastel, airy colors with an equally usable dark theme
- Touch targets at least 44 pixels high and layouts that collapse to one column on phones
- A transparent favicon/logo outside the intended circular artwork

Use semantic HTML, visible keyboard focus, a skip link, `aria-current` for the current page, labels for controls, and an `aria-live` region for status messages.

The theme preference can remain in `localStorage`; it is device-specific and is not sensitive. The authenticated cloud session can remain in `sessionStorage` so admin access ends when that browser session ends.

## 4. GitHub and GitHub Pages

1. Create a repository in the website owner's GitHub account.
2. Put the static files at the repository root and use `main` as the publishing branch.
3. Add a root `CNAME` file containing one line: `example.com`.
4. In the repository, open **Settings → Pages**.
5. Choose **Deploy from a branch**, select `main`, select `/ (root)`, and save.
6. Enter `example.com` under **Custom domain**.
7. After DNS is correct and the certificate is ready, enable **Enforce HTTPS**.

GitHub recommends adding the custom domain to the repository before pointing DNS at it. It also recommends configuring both the apex and `www` form and warns against wildcard DNS records. DNS and certificate changes can take up to 24 hours.

Each deployment is a normal Git workflow:

```bash
git status --short
git diff --check
git add <changed-files>
git commit -m "Describe the website change"
git push origin main
```

Do not commit provider keys, Supabase secret/service-role keys, passwords, `.env` files, or exported user data.

## 5. GoDaddy DNS and HTTPS

Configure these records in GoDaddy's DNS manager for the new domain:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `GITHUB_USERNAME.github.io` |

The `www` CNAME points to the GitHub Pages default domain, not to the repository name and not to the apex domain. Remove conflicting default parking A records or another `www` CNAME. Preserve unrelated MX/TXT records used for email.

Verify DNS from a terminal:

```bash
dig example.com A +short
dig www.example.com CNAME +short
```

Then verify all four URLs:

- `https://example.com`
- `https://www.example.com`
- `http://example.com` redirects to HTTPS
- `http://www.example.com` redirects to HTTPS

A browser's “Not secure” label normally means the GitHub Pages certificate is not ready, HTTPS enforcement is not enabled, DNS still points elsewhere, or a page loads an `http://` asset. First correct DNS, wait for GitHub's certificate, enable HTTPS, and then check the page for mixed content.

## 6. Supabase project

Create one Supabase project for the person. One project can support multiple related sites by storing a short `site` discriminator on shared records.

Run [`PERSONAL_SITE_DATABASE_TEMPLATE.sql`](PERSONAL_SITE_DATABASE_TEMPLATE.sql) in the Supabase SQL editor. It creates:

| Table | Purpose | Read access | Write access |
| --- | --- | --- | --- |
| `site_admins` | Allowlist of administrator Auth users | Own membership | SQL/dashboard only |
| `music_playlists` | Named music playlists per site | Public | Approved admin |
| `music_tracks` | Track metadata and Storage paths | Public | Approved admin |
| `test_attempts` | Aviation/Mandarin scores and missed answers | Approved admin | Approved admin |
| `site_content` | Editable JSON such as goals, notes, and book content | Approved admin | Approved admin |
| `art_items` | Private artwork metadata and Storage paths | Approved admin | Approved admin |
| `shopping_products` | Normalized affiliate-feed catalog | Active rows public | Approved admin/importer |

The template also creates:

- `site-music`, a public Storage bucket for browser audio playback
- `site-art`, a private Storage bucket served through signed URLs
- Row Level Security policies on every browser-exposed table
- Storage policies that require paths shaped like `SITE/USER_UUID/FILE`
- SHA-256 music duplicate indexes by user and site

### Create the administrator

1. In **Authentication → Users**, create the website owner's email/password user.
2. Copy that Auth user's UUID.
3. In the SQL editor, insert the UUID into `public.site_admins` using the bootstrap statement at the bottom of the schema template.
4. Do not add a public insert policy to `site_admins`.

The visible “Cloud locked” / “Cloud synced” control is the same concept on both sites. It signs the approved administrator into Supabase. Public visitors can play public music or read an active catalog; edits, uploads, test-result writes, private art, and AI calls require the authenticated administrator.

An optional entrance password is only a client-side presentation/privacy gate on a static site. It must not be treated as real protection. Supabase Auth plus RLS is the security boundary for private data and write operations.

### Browser configuration

Copy the new project's URL and publishable key into the browser helper:

```js
const PROJECT_URL = "https://PROJECT_REF.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_REPLACE_ME";
```

A Supabase publishable key is intended for browser use when RLS is correctly enabled. A secret/service-role key bypasses RLS and must never appear in browser code or GitHub.

## 7. Cloud files and cross-device data

Music and artwork require two records:

1. The binary file goes to Supabase Storage.
2. Metadata goes to the matching Postgres table.

For music, store the original name, display title, MIME type, byte size, Storage path, creation time, SHA-256 content hash, source-file fingerprint, and source metadata. Before upload, compare the hash/fingerprint to existing records for the same user and site. The unique database index provides a second layer of duplicate protection.

This is why a song uploaded on one device appears on another device. A file stored only in `localStorage` or IndexedDB remains on one device, and a large music collection should not be committed to GitHub because Git is poor binary media storage and repository limits eventually become a problem.

Use `test_attempts` for every completed aviation or Mandarin quiz. Save the subject, mode, section, correct count, total, percentage, wrong-answer details, and completion time. Load recent attempts after admin sign-in so history is available across devices.

Use `site_content` for small editable JSON collections such as goals, dental notes, or manuscript chapters. For larger documents, add version rows or a revisions table instead of overwriting the only copy.

## 8. Protected AI chat

The AI provider key must be stored only as a Supabase Edge Function secret:

```text
OPENCODE_API_KEY=<provider key>
```

Deploy `supabase/functions/big-pickle/index.ts` as an Edge Function named `big-pickle`. The function should:

1. Allow only the production domains and explicit local development origins in CORS.
2. Accept only `POST` and `OPTIONS`.
3. Validate the caller's Supabase user JWT.
4. Confirm the user exists in `site_admins`.
5. Select a constrained system prompt from an allowlisted scope such as `anthony`, `rauny`, `aviation`, `mandarin`, `book`, or `book-chat`.
6. Trim message length and recent chat history.
7. Call OpenCode Zen's OpenAI-compatible chat-completions endpoint with model `big-pickle`.
8. Return only the assistant content and a generic provider error; log limited server-side diagnostics without logging keys.
9. Set a request timeout and `Cache-Control: no-store`.

The browser calls the Edge Function with the current Supabase access token. The AI bubble sends one independent question at a time and replaces its previous answer. It does not send conversation history, publish chats, or place the provider key in the browser. Enter submits the question; Shift+Enter inserts a new line.

When adding another domain to the same backend, add both its apex and `www` HTTPS origins to the Edge Function allowlist and redeploy.

## 9. APIs and platform features used

| Service/API | Use |
| --- | --- |
| Git and GitHub | Source control and repository delivery |
| GitHub Pages | Static hosting, custom-domain routing, TLS certificate |
| GoDaddy DNS | Apex A records and `www` CNAME |
| Supabase Auth | Administrator email/password session and JWT |
| Supabase Data API / PostgREST | Tables, JSON content, quiz history, catalog metadata |
| Supabase Storage API | Cross-device music files and private artwork |
| Supabase Edge Functions | Secret-holding AI gateway |
| OpenCode Zen | Big Pickle chat-completions model |
| Web Crypto API | SHA-256 music deduplication |
| File and Drag-and-Drop APIs | Music/art file selection and drop zones |
| HTML Audio API | Playlist playback and previous/next controls |
| Canvas and Pointer Events | Drawing with mouse, touch, or Apple Pencil |
| Pointer pressure/tilt data | Pencil-sensitive drawing where the browser/device exposes it |
| `localStorage` | Theme and non-sensitive device preferences |
| `sessionStorage` | Per-tab authenticated session cache |
| IndexedDB | Local migration/fallback for older art or media data |
| Google Fonts | Web typography |

There is no full Apple Pencil Pro web API. A website can react to standards-based pointer events, pressure, tilt, and some gestures that the browser exposes, but squeeze/double-tap behavior is controlled by iPadOS and is not guaranteed to reach a webpage. Always provide visible undo, eraser, tool, and save buttons as fallbacks.

## 10. Shopping product feeds

The shopping page is a catalog consumer, not a scraper. Products should be imported only after the brand or its affiliate network approves access to a feed/API.

Typical onboarding:

1. Create a publisher account with the relevant affiliate network.
2. Add and verify the website and complete tax/payment information.
3. Apply to each merchant program.
4. Explain the catalog experience and intended traffic source.
5. After merchant approval, request product-feed/API access.
6. Import normalized products into `shopping_products` on a schedule.
7. Set old missing products to `active = false` rather than silently leaving stale items live.

The network varies by merchant and may change. Confirm the current relationship before implementation. Candidate networks discussed for the existing design include Awin, Rakuten Advertising, CJ, Impact, and direct merchant feeds. Never scrape a retailer in a way that violates its terms.

## 11. Local development and checks

Serve the static site through HTTP instead of opening `file://` URLs:

```bash
python3 -m http.server 4173
```

Before deployment:

- Open the home page and every navigation destination.
- Test at phone, tablet, and desktop widths.
- Test light and dark themes.
- Verify the favicon in a fresh/private tab.
- Sign in, reload, and confirm the cloud status.
- Upload a small audio file, verify playback, and confirm it appears on a second device.
- Upload the same file again and confirm duplicate prevention.
- Select all music and verify bulk deletion asks for confirmation.
- Complete one quiz and confirm its score/history on a second device.
- Save one content edit and one artwork item, then confirm them on a second device.
- Ask the AI bubble a simple question in every relevant scope.
- Confirm an unsigned AI request returns `401`.
- Confirm the provider key is absent from the browser network response and repository.
- Run Supabase security and performance advisors.
- Run `git diff --check` and JavaScript syntax checks.
- Push, wait for GitHub Pages, and verify HTTPS on the apex and `www` domains.

## 12. New-person checklist

- [ ] Choose a single-page or separate-page layout.
- [ ] Create a GitHub repository in the new owner's account.
- [ ] Replace names, resume, page options, colors, logo, favicons, and social metadata.
- [ ] Create a Supabase project.
- [ ] Apply the database template.
- [ ] Create and allowlist the administrator Auth user.
- [ ] Put only the Supabase project URL and publishable key in browser code.
- [ ] Add the OpenCode key to Supabase Edge Function secrets.
- [ ] Change the AI prompts and allowed CORS origins.
- [ ] Deploy and test the Edge Function.
- [ ] Add the custom domain to GitHub Pages.
- [ ] Configure GoDaddy apex and `www` DNS records.
- [ ] Wait for the certificate and enable HTTPS enforcement.
- [ ] Test cloud writes and AI from a second device.
- [ ] Rotate any credential that was ever pasted into chat, committed, logged, or otherwise exposed.

## 13. Official references

- [GitHub: Managing a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GoDaddy: Manage DNS records](https://developer.godaddy.com/en/docs/api-users/manage-domains/dns)
- [Supabase: Auth](https://supabase.com/docs/guides/auth)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Storage](https://supabase.com/docs/guides/storage)
- [Supabase: Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase: Edge Function secrets](https://supabase.com/docs/guides/functions/secrets)
- [OpenCode Zen models and endpoints](https://opencode.ai/docs/zen)
