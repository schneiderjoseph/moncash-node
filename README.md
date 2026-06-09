![MonCash](./assets/moncash-logo.png)

# @zygrec/moncash

> Le SDK Node.js sécurisé pour Digicel MonCash — conçu pour Haïti 🇭🇹
>
> The secure Node.js SDK for Digicel MonCash — built for Haiti 🇭🇹

[![npm version](https://img.shields.io/npm/v/@zygrec/moncash.svg)](https://www.npmjs.com/package/@zygrec/moncash)
[![license](https://img.shields.io/npm/l/@zygrec/moncash.svg)](https://www.gnu.org/licenses/gpl-3.0.txt)
[![tests](https://img.shields.io/badge/tests-18%20passing-brightgreen.svg)](https://github.com/schneiderjoseph/moncash)

Official-quality Node.js wrapper for the [Digicel MonCash API](https://sandbox.moncashbutton.digicelgroup.com). Handles OAuth2 authentication, payment creation, transaction capture, and fund transfers in HTG.

**Demo app :** [github.com/schneiderjoseph/moncash-demo/node](https://github.com/schneiderjoseph/moncash-demo/tree/main/node)

## Installation

```sh
npm install @zygrec/moncash
```

## Quick Start

```js
const Moncash = require('@zygrec/moncash');

const moncash = new Moncash({
  clientId: process.env.MONCASH_CLIENT_ID,
  clientSecret: process.env.MONCASH_CLIENT_SECRET,
  mode: 'sandbox' // or 'live'
});

// Create a payment
const payment = await moncash.payment.create({
  amount: 500,
  orderId: 'ORDER-001'
});

// Redirect the user
const url = moncash.payment.redirectUri(payment);
res.redirect(url);

// Capture / verify
const capture = await moncash.capture.getByOrderId('ORDER-001');
console.log(capture.status); // 'SUCCESS'
```

> Never hardcode credentials. Copy `.env.example` to `.env` and load values from environment variables.

## API Reference

### `moncash.payment.create({ amount, orderId })` → `Promise<object>`

Creates a new MonCash payment. Currency is HTG only.

```js
const payment = await moncash.payment.create({
  amount: 500,
  orderId: 'ORDER-001'
});
```

### `moncash.payment.redirectUri(payment)` → `string`

Builds the MonCash redirect URL from a payment response.

```js
const url = moncash.payment.redirectUri(payment);
```

### `moncash.capture.getByTransactionId(id)` → `Promise<object>`

Retrieves a payment by MonCash transaction ID.

```js
const capture = await moncash.capture.getByTransactionId('12874820');
```

### `moncash.capture.getByOrderId(id)` → `Promise<object>`

Retrieves a payment by merchant order ID.

```js
const capture = await moncash.capture.getByOrderId('ORDER-001');
```

### `moncash.transfert.create({ receiver, amount, desc })` → `Promise<object>`

Sends funds to a MonCash wallet.

```js
const result = await moncash.transfert.create({
  receiver: '50912345678',
  amount: 50,
  desc: 'Supplier payment'
});
```

> `moncash.transfer` is a deprecated alias for `moncash.transfert`.

## Pay with MonCash Button

The SDK ships the official MonCash payment button image. After `npm install`, use it in your frontend:

```js
const Moncash = require('@zygrec/moncash');
const path = require('path');
const express = require('express');

// Serve the button (Express example)
app.get('/moncash-button.png', (req, res) => {
  res.sendFile(Moncash.getButtonPath());
});
```

```html
<form method="POST" action="/pay">
  <button type="submit" style="background:none;border:none;padding:0;cursor:pointer">
    <img src="/moncash-button.png" alt="Pay with MonCash" height="48">
  </button>
</form>
```

Or copy the file into your static folder:

```js
const fs = require('fs');
fs.copyFileSync(Moncash.getButtonPath(), './public/moncash-button.png');
```

## Configuration

| Option         | Type     | Required | Description                          |
|----------------|----------|----------|--------------------------------------|
| `clientId`     | `string` | Yes      | MonCash API client ID                |
| `clientSecret` | `string` | Yes      | MonCash API client secret            |
| `mode`         | `string` | No       | `sandbox` (default) or `live`        |
| `version`      | `string` | No       | API version (default: `v1`)          |

```js
const moncash = new Moncash({
  clientId: process.env.MONCASH_CLIENT_ID,
  clientSecret: process.env.MONCASH_CLIENT_SECRET,
  mode: 'sandbox'
});
```

Get credentials from the [MonCash merchant dashboard](https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/Login).

## Input Validation

All inputs are validated client-side before any API request is sent.

| Resource  | Field            | Rules                                                                 |
|-----------|------------------|-----------------------------------------------------------------------|
| Payment   | `amount`         | Positive finite number, rounded to 2 decimals, minimum **1 HTG**    |
| Payment   | `orderId`        | Non-empty string                                                      |
| Capture   | `transactionId`  | Non-empty string                                                      |
| Capture   | `orderId`        | Non-empty string                                                      |
| Transfert | `amount`         | Positive finite number, rounded to 2 decimals, minimum **1 HTG**    |
| Transfert | `receiver`       | Haitian phone format: `509XXXXXXXX` or `XXXXXXXX` (8 digits)          |
| Transfert | `desc`           | Non-empty string, max 255 characters                                  |

Invalid input throws a `MoncashError` with a descriptive message.

## Error Handling

```js
const { errors } = moncash;

try {
  await moncash.payment.create({ amount: 500, orderId: 'ORDER-001' });
} catch (err) {
  if (err.type === errors.UnauthorizedError) {
    console.error('Invalid credentials');
  } else if (err.type === errors.BadRequestError) {
    console.error('Invalid request');
  } else {
    console.error(err.message);
  }
}
```

### Error types

`MoncashError`, `APIError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `RequestTimeoutError`, `TooManyRequestsError`, `UnexpectedError`

## Security

This SDK includes hardened security for production payment flows:

- OAuth2 mutex prevents concurrent token refresh races
- 30-second HTTP timeout prevents indefinite hangs
- Credentials are redacted from all error messages
- Axios error internals (`config`, `auth`, headers) are stripped before propagation
- No hardcoded credentials in source or tests

Report vulnerabilities via [SECURITY.md](./SECURITY.md). Use [`.env.example`](./.env.example) as a template for local credentials.

## Legacy Callback Support

Callback style is supported for backward compatibility but **deprecated**. Prefer `async/await`.

```js
// @deprecated — use async/await instead
moncash.payment.create({ amount: 500, orderId: 'ORDER-001' }, (err, payment) => {
  if (err) return console.error(err.message);
  console.log(moncash.payment.redirectUri(payment));
});
```

## Development

```bash
npm install
npm test
```

Tests use network mocks (`nock`). To run with your own sandbox credentials:

```bash
export MONCASH_TEST_CLIENT_ID='your_client_id'
export MONCASH_TEST_CLIENT_SECRET='your_client_secret'
npm test
```

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.txt)

## Links

- [Demo Node.js](https://github.com/schneiderjoseph/moncash-demo/tree/main/node)
- [GitHub](https://github.com/schneiderjoseph/moncash)
- [Zygrec](https://zygrec.com)
- [MonCash Sandbox Dashboard](https://sandbox.moncashbutton.digicelgroup.com)
- [REST API Documentation (PDF)](https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/resources/doc/RestAPI_MonCash_doc.pdf)
