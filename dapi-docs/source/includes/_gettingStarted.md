# Getting Started

## What is the dAPI?

The dAPI is a package interface for communicating with the NEO blockchain. The methods are handled by an existing wallet provider, such as the NeoLogin or O3 wallets, and help to reduce the development overhead associated with creating dApps on NEO.

By offloading the responsibility of NEO blockchain interactions to a wallet provider, dApp developers do no have to worry about managing users private keys or how to format transactions to be signed and broadcast. The developer no long has to worry about user onboarding flows related to creating and managing a users secure credentials, and can just focus on the development of their core dApp.

On the user side, since all transactions that a dApp needs to broadcast to the blockchain will be handled by the users wallet proivder, they can feel safe knowing that they never need to copy and paste their private key into a dApp again. Any transaction that a user signs will be done so in the wallet, and their private key will never be provided to the dApp.

## Installation

dAPI client integrations are currently facilited via a versioned JS package, and can be imported to your application either via CDN or NPM.

### Install via CDN

```html
<script src="https://neologin.io/neologin.js"></script>
```
```typescript
window.neologin
```
```javascript
window.neologin
```
<!--
When installing via CDN, it's always recommended to reference a specific version of the neo-dapi package, to protect your app from possible method interface updates. In this example the version referenced in the url is 2.0.4.
-->

### Install via NPM

```bash
npm i --save neologin

or

yarn add neologin
```

```typescript
var neologin = require('neologin');

or

import neologin from 'neologin';
```
```javascript
var neologin = require('neologin');

or

import neologin from 'neologin';
```

[![npm version](https://badge.fury.io/js/neologin.svg)](https://www.npmjs.com/package/neologin)

When installing via NPM, it's always advised to lockdown your package version to either the specific version only, or to patch updates.

## Mobile Compatibility
 
We suggest doing the majority of your development using a desktop browser and Chrome's mobile device simulator. Once your app is fully functional on desktop, the neologin wallet will automatically adapt to work on mobile browsers without requiring any additional changes.
