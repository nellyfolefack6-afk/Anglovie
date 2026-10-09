# AngloVie — SILFA · UCBH

Version 3.3.1, October 2026. Created by Nelly Folefack.

AngloVie is the English learning pathway in SILFA. FrancoVie is a separate French learning application and is not included in this project. Learners can use the app and peer support entirely remotely. Workplace immersion and Tremplin support are optional, arranged with UCBH.

## This version

- AI access now separates server availability, learner code activation and permission to send exercises. Missing functions, offline use, invalid codes and blocked session cookies have explicit messages and retry controls. The downloaded HTML does not show a misleading activation or consent button.
- A successful access-code response is followed by a server session check. Failed AI requests preserve the learner’s unsent text; expired sessions return to code entry. Long conversations keep a valid user-first message window.
- **Write an email:** 10 editable models for information requests, appointments, rescheduling, reporting a problem or absence, colleague support, meeting requests, follow-up, job applications and interview thank-you messages.
- Interactive six-part email structure with a complete annotated example, tone guidance and three embedded vector illustrations. The visuals work offline and do not load from an external image service.
- A six-part email editor, escaped live preview, bracketed-placeholder reminders, a personal review checklist, copy, text download and device speech playback. No email is sent from the app. Grammar is not checked automatically in this editor.
- One local draft per model plus one blank draft, included in the existing progress backup. Editing a draft resets its review checklist. Existing independent writing challenges remain under Practice tasks; their optional AI correction still requires activated online access.
- English navigation, instructions, vocabulary definitions, practice prompts, messages and exported summaries.
- Full-width desktop layout. The **Full screen** button enters browser full-screen mode where supported. Use **Exit full screen** or Escape to leave it. Mobile layouts remain responsive.
- 951 vocabulary cards grouping 1,020 learning contexts, including the 555 additions from the enriched source file. Each context has a learning step and suggested A1–B2 difficulty. These are editorial guides, not validated CEFR ratings.
- Six learning steps, 28 lessons, 10 practice scenarios and 17 learning modules.
- Guided sessions of 5, 8, 10 or 12 cards, based on the chosen 5, 10, 15 or 20-minute intention. Sessions are not timed.
- Vocabulary search and filters by step, difficulty, topic, type and review status. English meanings replace the previous French definitions.
- Slow, steady and normal speech playback, using the English voices available on the device.
- Local review schedule: difficult cards can be reviewed the same day; remembered cards return after 1, 3, 7, 14 and then 30 days. Repeated successes on the same day do not extend the interval again.
- Saved sessions, sentence drafts, practice journal and optional preparation notes for a peer. No message is sent automatically.

## Open, install and use offline

The separate HTML file opens directly in a browser. For installation on a phone or computer, publish the complete project over HTTPS, then open its web address. Use the app’s Install button for device-specific guidance. The app is an installable web application, not an APK or an App Store package.

After a successful first online visit and service-worker installation, lessons and exercises work offline. AI coaching, external links and remote meetings require Internet access. Audio availability depends on the installed device voices.

The full-width layout works immediately. Browser full-screen mode requires a deliberate button click and may be unavailable inside embedded previews. In that case, open the app in its own browser tab and use the browser’s full-screen command.

## Publish with Netlify

This project keeps the Netlify setup from the original ZIP. No deployment was performed for this delivery.

The project root contains `index.html`, the manifest, icons, service worker and `netlify.toml`. To use AI, deploy the Netlify Functions as well, for example through a Git repository connected to Netlify. Uploading only the HTML does not deploy the AI service.

## Activate the optional AI coach

Set these environment variables for the Netlify Functions:

- `ANTHROPIC_API_KEY`: your Anthropic account key.
- `SILFA_SESSION_SECRET`: a random secret of at least 32 characters, kept server-side.
- `SILFA_AI_CODES_JSON`: a JSON array of individual access entries.
- `ANTHROPIC_MODEL`: optional model override; the supplied default remains `claude-sonnet-4-6`. Verify availability in the account used.

Each access entry has `id`, `code` and `expires`. Use a unique internal identifier without a real name, a securely generated code of at least 24 characters, and an expiry date in `YYYY-MM-DD` format. Expiry is interpreted at 23:59:59 UTC. Do not reuse the retired sequential NF-EN codes.

Learners enter their code and consent to sending their exercises to Anthropic. Sessions use signed HttpOnly, Secure, SameSite=Strict cookies. API keys remain server-side. Requests validate message types, sizes and roles. Responses are capped at 900 output tokens. Netlify rate limits are declared at 10 authentication requests and 20 AI requests per minute per IP/domain; verify these settings in the deployment logs and configure provider spending limits.

The coach identifies itself as AI and uses English explanations by default. It is separate from the human peer. No live paid AI calls were made during local verification.

### If activation appears not to work

1. A `file://` address is the downloaded HTML. Use the published HTTPS app for AI. Local course activities remain available without AI.
2. If the app reports a missing AI connection, publish the whole project with its server functions. A static HTML upload alone cannot provide them.
3. If the service is not set up, configure the three required environment variables above and deploy again. This delivery does not include or invent an API key, administrator account or valid learner code.
4. If a code is refused, check its configured value and expiry on the server. Codes need at least 24 characters; the session secret needs at least 32. The learner’s consent is a separate step and cannot replace a valid code.
5. If the code is accepted but the session is not kept, open the app in its own browser tab and allow cookies for that website. The app verifies the session before showing access as active.
6. Once access is verified, give permission to send exercises, then send a practice message. A verified access session does not by itself prove the provider key, model or billing is working. Provider errors are shown and the unsent message remains available for another attempt.

## Commercial services still to connect

Payments, subscription accounts, centralized learner management and full-course access rights are not implemented. Static course content is embedded in the HTML. The server access codes protect the AI coach only.

UCBH still arranges peer matching, meeting schedules, package terms and optional placements. Saving a date in My support does not make an external booking. The existing UCBH booking link is retained.

## Progress and backups

The local storage key remains `silfa-anglovie-v3`, and backup JSON keeps format version 3 for compatibility. Existing profiles, saved words, completed lessons and notes remain usable. The application does not translate or rewrite a learner’s own notes.

My progress provides JSON export/import and a readable text summary. My support exports peer preparation notes. Data does not synchronize automatically between devices and is not automatically sent to UCBH. Export before moving to a different browser, address or device.

The session history keeps the most recent 60 sessions and the journal keeps the most recent 200 entries. Older compatible AngloVie 2 profiles can be migrated once on the same origin. Progress indicators describe practice and self-assessment, not certified language proficiency.

## Verification

The 3.3.1 access flow was checked with controlled server responses: missing/HTML endpoint, absent configuration, network failure, invalid code, code accepted with no retained session, verified login, separate consent, successful chat, long conversation history, failed-response draft preservation, session expiry and reactivation, sign-out, offline state, standalone HTML state and responsive layouts. Backend signed-session tests also passed. Provider responses were mocked; no live Anthropic connection or deployment was verified.

The email studio was checked in Chromium: all 10 models, category filtering, interactive structure, live preview with escaped user text, separate drafts, clipboard and text export, placeholder reminders, checklist resets, backup restoration, older backup compatibility, the six existing practice challenges, and offline reload. Layouts were checked at 320, 390, 768, 1,280 and 1,920 pixels, with desktop and mobile screenshot review. The guided vocabulary regression checks also passed.

Checked locally in Chromium: full width at 1,920 pixels; entering and leaving browser full screen; onboarding; vocabulary search and filters; saved words; flashcards; all learning modules and detail views; lessons and scenario completion; peer notes; journal escaping; backup export/import; guided sessions and drafts; older backup compatibility; and offline reload. Responsive layouts were checked from 320 pixels to desktop widths. English interface copy and prompts were reviewed across the main screens, lessons and scenarios.

System voices and physical iPhone/Safari installation were not tested on a device. AI activation and payment require the setup described above.

## Reference material

Targeted language corrections used Cambridge Dictionary and English Grammar Today, including say/tell, biweekly, momentarily and between/among. Installable/offline behaviour follows the existing MDN PWA and Netlify Functions implementation in this project.

- https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell
- https://dictionary.cambridge.org/dictionary/english/biweekly
- https://dictionary.cambridge.org/dictionary/english/momentarily
- https://dictionary.cambridge.org/grammar/british-grammar/between-or-among
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation
- https://docs.netlify.com/build/functions/api/
