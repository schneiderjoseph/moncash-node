# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this SDK, please report it responsibly.

**Do not** open a public GitHub issue for security-sensitive reports.

Instead, email the maintainers with:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact (especially if it affects payment or credential handling)
- Any suggested remediation, if available

We will acknowledge receipt within 72 hours and provide a timeline for investigation and remediation.

Please do not disclose the vulnerability publicly until a fix has been released and users have had a reasonable opportunity to upgrade.

## Security Practices

- Never commit API credentials (`.env`, secrets in source code, or test fixtures).
- Use sandbox credentials only in non-production environments.
- Rotate `clientSecret` immediately if it may have been exposed.
- Keep this SDK and its dependencies up to date.
