# NeoLogin
> Easy peasy NEO dAPI provider

## Try it

Check out [a live example of a Dapp using NeoLogin](https://neologin.io/example/)!

## Quickstart

### Install
```bash
npm i neologin
```

### Use
```js
import neologin from 'neologin';

neologin.getAccount()
.then((account) => {
  console.log('Provider address: ' + account.address);
});
```

The `neologin` object exposes a fully-compliant [NEP-12](https://github.com/nickfujita/proposals/blob/dapp-api/nep-12.mediawiki) API so it can be used with anything that supports the standard.

## What is NeoLogin?
NeoLogin is a semi-custodial web-wallet for NEO. User's private keys are encrypted using user passwords and stored on the company's servers, making the keys available from any device with a simple login while also making sure that the service doesn't have access to the keys, making it so no user funds are lost if the service is hacked.

---

For more information, including a complete security analysis of NeoLogin, check out the [readme on Github](https://github.com/safudex/neologin/blob/master/README.md).
