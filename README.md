# Gnosis Safe - CSV Transactions; A Safe App for Easy Bulk Transactions

Send arbitrary transactions defined by address and raw calldata to multiple recipients at once in a single Safe transaction!

## Motivation & Usage Guide

Have you encountered the painful task of sending out multiple transactions to multiple recipients with various calldata?
Not only do you have to have to initiate multiple transactions, but then each transaction requires a signature threshold followed by the time it takes to have each transaction mined...
Well these days are over!

## Developers Guide

Install dependencies and start a local dev server.

```
yarn install
cp .env.sample .env
yarn start
```

Then:

- If HTTPS is used (by default enabled)
  - Open your Safe app locally (by default via https://localhost:3000/) and accept the SSL error.
- Go to Safe Multisig web interface
  - [Mainnet](https://app.gnosis-safe.io)
  - [Rinkeby](https://rinkeby.gnosis-safe.io/app)
- Create your test safe
- Go to Apps -> Manage Apps -> Add Custom App
- Paste your localhost URL, default is https://localhost:3000/
- You should see Safe Airdrop as a new app
- Develop your features from there
