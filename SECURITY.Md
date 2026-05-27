# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.1.x (latest) | ✅ |
| < 0.1 | ❌ |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in Forge, please report it responsibly:

1. **Email:** Send details to `security@yourdomain.com`
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

We will acknowledge your report within **48 hours** and aim to release a patch within **7 days** for critical issues.

---

## Security Best Practices for Users

- Never commit your `.env` file or `~/.forge/auth.json` to version control
- Rotate your API keys regularly
- Keep Forge updated to the latest version
- Review agent actions before running in production environments

---

## Scope

The following are in scope for security reports:

- Authentication bypass or token leakage
- Arbitrary code execution outside of intended agent scope
- API key exposure through logs or error messages
- Privilege escalation via CLI commands

---

Thank you for helping keep Forge secure.
