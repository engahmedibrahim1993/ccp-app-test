# CCP Evaluation — Findings Log

No learner-experience findings yet. No question, chapter, calculation,
feedback, or dashboard content has been observed, because the live
application could not be reached from this environment (see
`ccp_eval_checkpoint.md` for full detail).

## Session 1 — Infrastructure Finding (not an app finding)

- **Type:** Environment/infrastructure blocker (explicitly NOT a
  "Playwright/Claude/browser infrastructure failure classified as an app
  bug" — this is the opposite: documented evidence that the app itself was
  never reached, so no app bug can yet be attributed).
- **Severity:** CRITICAL (blocks the entire evaluation)
- **Evidence:**
  - `curl -v https://rococo-daifuku-1076a2.netlify.app/` → proxy CONNECT
    tunnel returns `403 Forbidden`.
  - Raw socket CONNECT to the proxy (`127.0.0.1:38071`) returns body:
    `request blocked: no rule or allowlist entry allows host
    "rococo-daifuku-1076a2.netlify.app"`.
  - Playwright `page.goto()` on the same URL → `net::ERR_TUNNEL_CONNECTION_FAILED`.
  - Control requests to unrelated hosts (`www.google.com`, `netlify.app`,
    `app.netlify.com`) were blocked identically, while `github.com` returned
    a normal (non-403) HTTP response — proving the block is a session-wide
    default-deny egress allowlist that simply does not include this
    deployment's domain, not a bug in the target site or in the browser
    harness.
- **Root cause:** This remote execution environment's network policy
  (configured when the environment was created — see
  https://code.claude.com/docs/en/claude-code-on-the-web) does not permit
  outbound HTTPS to `netlify.app` subdomains.
- **Action taken:** None to bypass it (per hard rule: never disable TLS
  verification, never unset `HTTPS_PROXY`, never retry a 403/407 policy
  denial). Reported instead.
- **Required to proceed:** The environment must be recreated/reconfigured
  with a network policy that allows this host, after which this checkpoint
  system will resume automatically from "Next Exact Action" in
  `ccp_eval_checkpoint.md`.
