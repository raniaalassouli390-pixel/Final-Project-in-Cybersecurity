# Ghurir: Interactive Web Security Sandbox

A beginner-friendly website with three interactive security labs.
In each lab you press a payload, watch the vulnerability happen, then switch to the fixed version and see the same payload blocked.

## 🔗 Live Demo

**https://USERNAME.github.io/REPO-NAME/**

## 🧪 The Labs

| # | Lab | OWASP Category | CWE | Level |
|---|-----|----------------|-----|-------|
| 1 | Reverse Tabnabbing | A01: Broken Access Control | CWE-1022 | Easy |
| 2 | CSV Injection | A03: Injection | CWE-1236 | Medium |
| 3 | Insecure postMessage | A01: Broken Access Control | CWE-346 | Hard (team challenge) |

Each lab page contains: **What it is** · **The line** · **Try it** · **Why it matters** · **The fix** · **Sources**, plus a Vulnerable / Fixed switch.

---

### 1. Reverse Tabnabbing

**The bug:** a link that opens with `target="_blank"` but without `rel="noopener"` gives the new page access to `window.opener`.
**The vulnerable line:** `<a href="..." target="_blank">` with no `rel` attribute.
**Try it:** buttons simulate the opened page redirecting the original tab to a fake login page.
**The fix:** `rel="noopener noreferrer"`. The same payload is blocked because `window.opener` is `null`.

### 2. CSV Injection

**The bug:** user input that starts with `=`, `+`, `-` or `@` is exported to a CSV file unchanged, and a spreadsheet may treat it as a formula.
**The vulnerable line:** the export function writes the raw cell value.
**Try it:** buttons add a customer name that starts with a formula character. A built-in simulated spreadsheet viewer shows what would be evaluated.
**The fix:** prefix risky values with a single quote so they are treated as plain text. The same payload is shown as text.

### 3. Insecure postMessage (team challenge)

**The bug:** a `message` listener that never checks `event.origin` accepts commands from any window.
**The vulnerable line:** `window.addEventListener("message", handler)` where the handler trusts `event.data`.
**Try it:** the button simulates a message from an untrusted site that asks the page for its session token.
**The fix:** check `event.origin` against an allowlist and validate the message shape. The same message is rejected.

---

## 🛡️ Safety

- All demos are **client-side simulations**.
- No backend, no login, no database.
- No real passwords, personal data, or company logos.
- No real malicious code is run, and no real site is ever contacted.

## 🛠️ Tech Stack

HTML, CSS and JavaScript only. No frameworks.

## 📁 Project Structure

```
.
├── index.html
├── tabnabbing.html
├── csv-injection.html
├── postmessage.html
├── attacker.html
├── css/
│   └── style.css
├── js/
│   ├── lab.js
│   ├── tabnabbing.js
│   ├── csv-injection.js
│   └── postmessage.js
└── README.md
```

> Keep the folders next to the HTML files, or the pages lose their style and scripts.

## 🚀 Run Locally

```bash
git clone https://github.com/USERNAME/REPO-NAME.git
cd REPO-NAME
# open index.html in your browser
```

## 👥 Team

| Member | Role |
|--------|------|
| Name 1 | Lab 1 + Research |
| Name 2 | Lab 2 + QA |
| Name 3 | Lab 3 + Implementation |
| Name 4 | Design |
| Name 5 | Presentation |

## 📚 Sources

- OWASP: https://owasp.org
- CWE: https://cwe.mitre.org
- Add the articles and incident reports you used for each lab.

---

*42 Irbid, Final Project, November 2026*
