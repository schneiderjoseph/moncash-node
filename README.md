[![moncash](https://sandbox.moncashbutton.digicelgroup.com/Moncash-middleware/resources/assets/images/MC_button.png)](https://sandbox.moncashbutton.digicelgroup.com/)

# Digicel MonCash API SDK for Node.js

SDK Node.js pour l'API MonCash de Digicel (Haïti). Il gère l'authentification OAuth2, la création de paiements, la capture de transactions et les transferts de fonds en HTG.

> **Mise à jour de sécurité (v0.1.6+)** — Cette version corrige plusieurs vulnérabilités et failles de robustesse critiques. Mettez à jour dès que possible. Voir la section [Sécurité](#sécurité) et le fichier [SECURITY.md](./SECURITY.md).

## Fonctionnalités

- Création de paiements MonCash
- Capture de paiements (par `orderId` ou `transactionId`)
- Transfert de fonds (`transfert`)
- Authentification OAuth2 automatique avec protection contre les courses concurrentes
- Support **callback** et **Promise** sur toutes les méthodes
- Validation stricte des entrées avant envoi à l'API
- Timeout HTTP de 30 secondes
- Gestion d'erreurs typées

## Prérequis

- [Node.js](https://nodejs.org/) v12 ou supérieur

## Installation

```sh
npm install moncash
```

## Configuration

Obtenez vos identifiants sur le [tableau de bord MonCash](https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/Login).

Chaque compte marchand dispose d'une paire `clientId` / `clientSecret`.

```javascript
const Moncash = require('moncash');

const moncash = new Moncash({
  mode: 'sandbox', // 'sandbox' | 'live'
  clientId: '<clientId>',
  clientSecret: '<clientSecret>'
});
```

Configuration alternative (chaînable) :

```javascript
const moncash = new Moncash();

moncash.configure({
  mode: 'sandbox',
  clientId: '<clientId>',
  clientSecret: '<clientSecret>'
});
```

> **Important** — Ne commitez jamais vos identifiants. Utilisez des variables d'environnement ou un fichier `.env` (voir `.env.example`).

## Créer un paiement

Devise supportée : **HTG** uniquement.

### Avec callback (rétrocompatible)

```javascript
moncash.payment.create({
  amount: 50,
  orderId: 'order-12345'
}, (err, payment) => {
  if (err) {
    console.error(err.type, err.message);
    return;
  }

  const redirectUrl = moncash.payment.redirectUri(payment);
  console.log(payment, redirectUrl);
});
```

### Avec Promise

```javascript
try {
  const payment = await moncash.payment.create({
    amount: 50,
    orderId: 'order-12345'
  });

  const redirectUrl = moncash.payment.redirectUri(payment);
  console.log(redirectUrl);
} catch (err) {
  console.error(err.type, err.message);
}
```

### Validation des entrées

| Champ     | Règle                                      |
|-----------|--------------------------------------------|
| `amount`  | Nombre positif fini (> 0)                  |
| `orderId` | Chaîne non vide                            |

## Capturer un paiement

```javascript
// Par orderId
const capture = await moncash.capture.getByOrderId('order-12345');

// Par transactionId
const capture = await moncash.capture.getByTransactionId('12874820');
```

Les deux méthodes acceptent également un callback en second argument.

## Transfert de fonds

```javascript
const result = await moncash.transfert.create({
  receiver: '50912345678', // ou '12345678'
  amount: 50,
  desc: 'Paiement fournisseur'
});
```

### Validation des entrées

| Champ      | Règle                                                        |
|------------|--------------------------------------------------------------|
| `amount`   | Nombre positif fini (> 0)                                    |
| `receiver` | Format haïtien : `509XXXXXXXX` ou `XXXXXXXX` (8 chiffres)    |
| `desc`     | Chaîne non vide, maximum 255 caractères                      |

> `moncash.transfer` est un alias déprécié de `moncash.transfert`, conservé pour la rétrocompatibilité.

## Gestion des erreurs

```javascript
const { errors } = moncash;

try {
  await moncash.payment.create({ amount: 50, orderId: 'abc' });
} catch (err) {
  switch (err.type) {
    case errors.UnauthorizedError:
      console.error('Identifiants invalides');
      break;
    case errors.BadRequestError:
      console.error('Requête invalide');
      break;
    default:
      console.error(err.message);
  }
}
```

### Types d'erreurs disponibles

- `MoncashError`
- `APIError`
- `BadRequestError`
- `UnauthorizedError`
- `ForbiddenError`
- `NotFoundError`
- `ConflictError`
- `RequestTimeoutError`
- `TooManyRequestsError`
- `UnexpectedError`

## Sécurité

Cette version inclut un durcissement de sécurité important :

| Correction | Description |
|------------|-------------|
| OAuth mutex | Évite les authentifications parallèles en cas d'appels concurrents |
| Bearer token | Correction de la vérification du token (le token expiré était ignoré) |
| Timeout HTTP | Limite de 30 s pour éviter les blocages indéfinis |
| Validation entrées | Rejet des montants, numéros et descriptions invalides avant envoi |
| Secrets | Suppression des identifiants en dur dans les tests ; filtrage des secrets dans les erreurs |
| `redirectUri()` | Vérification du `payment_token` avant construction de l'URL |

Pour signaler une vulnérabilité, consultez [SECURITY.md](./SECURITY.md).

## Développement

```bash
npm install
npm test
```

Les tests utilisent des mocks réseau (`nock`). Pour exécuter les tests avec vos propres identifiants sandbox :

```bash
# Linux / macOS
export MONCASH_TEST_CLIENT_ID='votre_client_id'
export MONCASH_TEST_CLIENT_SECRET='votre_client_secret'
npm test
```

```powershell
# Windows PowerShell
$env:MONCASH_TEST_CLIENT_ID='votre_client_id'
$env:MONCASH_TEST_CLIENT_SECRET='votre_client_secret'
npm test
```

Exécuter une seule suite de tests :

```bash
npx jest test/payment.test.js
```

## Licence

[GNU GENERAL PUBLIC LICENSE v3](https://www.gnu.org/licenses/gpl-3.0.txt)

## Liens utiles

- [Dépôt GitHub](https://github.com/schneiderjoseph/moncash)
- [Package NPM](https://www.npmjs.com/package/moncash)
- [Tableau de bord MonCash (sandbox)](https://sandbox.moncashbutton.digicelgroup.com)
- [Documentation API REST (PDF)](https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/resources/doc/RestAPI_MonCash_doc.pdf)
