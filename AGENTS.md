# Mandatory living-specification rule

Whenever a bug is found and fixed in this repository, update `docs/PERSONAL_SITE_REPRODUCTION_GUIDE.md` in the same change.

The documentation update must record:

- the visible symptom;
- the root cause;
- the corrected reusable code or architecture rule;
- the regression test that proves the bug stays fixed.

Also update any affected setup instructions or code snippets in the guide. A bug fix is not complete and must not be presented as complete unless the guide is updated with it.

Never add passwords, API secrets, private keys, access tokens, recovery codes, or private user content to the guide.
