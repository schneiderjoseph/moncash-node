# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| 0.1.x   | :x:                |

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

## Payout Operations

`moncash.transfert.create()` sends real HTG from your merchant prefunded account to a customer wallet. These operations are **irreversible**.

- Always verify the `receiver` phone number before sending.
- Use a unique `reference` per transfer to avoid duplicate payouts.
- Never expose transfer endpoints from a public frontend.
- Test exclusively in sandbox mode during development.

## PII and Account Enumeration

`moncash.customer.getStatus()` reveals whether a phone number is registered on MonCash. Calling this from a public frontend allows attackers to enumerate valid MonCash accounts.

- Restrict this API to authenticated backend routes only.
- Do not log phone numbers in application error messages.

## Prefunded Balance

`moncash.prefunded.getBalance()` returns your merchant account balance — sensitive financial data.

- Never expose this endpoint to end users or unauthenticated clients.
- Requires a prefunded account activated by Digicel.
