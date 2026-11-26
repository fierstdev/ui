# Security Policy

## Supported Versions

| Version | Supported                            |
| :------ | :----------------------------------- |
| `1.x`   | Yes                                  |
| `< 1.0` | No (internal pre-release prototypes) |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues.**

Instead, report vulnerabilities privately via **GitHub Security Advisories** (_Security → Advisories → Report a vulnerability_) or email `security@fierst.dev` with:

- A clear description of the vulnerability and potential impact (e.g., SSR XSS escape bypass, prototype pollution in Context/props, or supply-chain concern).
- A minimal reproducible snippet or test case.
- The Aster version and runtime environment (browser, Cloudflare `workerd`, Node.js, Astro).

We aim to acknowledge reports within **48 hours** and provide a fix timeline within **5 business days**.

---

## Built-In Security Guarantees

- **Zero Runtime Dependencies:** `@fierst/ui` ships `"dependencies": {}`, eliminating transitive supply-chain risk in application bundles.
- **Auto-Escaping Everywhere:** All SSR text interpolations, attribute values, and `data-aster-props` JSON payloads are HTML-escaped automatically; client text slots update `Text` nodes directly (`document.createTextNode` / `.data`) and never pass user data to `innerHTML`.
- **Per-Request SSR Context Isolation:** `createContext()` / `provide()` / `useContext()` use isolated prototype chains per render tree (`_runWithContext`), preventing cross-request data leaks in multi-tenant edge isolates (`workerd`).
- **OIDC Trusted Publishing & Provenance:** Official npm releases are built and published exclusively via GitHub Actions OIDC Trusted Publishing with SLSA provenance attestations and zero static npm write tokens.
