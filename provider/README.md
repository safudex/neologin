# Headjack
> Easy peasy NEO dAPI provider

## Try it

Check out [a live example of a Dapp using Headjack](https://headjack.to/example/)!

## Quickstart

### Install
```bash
npm i headjack
```

### Use
```js
import headjack from 'headjack';

headjack.getAccount()
.then((account) => {
  console.log('Provider address: ' + account.address);
});
```

The `headjack` object exposes a fully-compliant [NEP-12](https://github.com/nickfujita/proposals/blob/dapp-api/nep-12.mediawiki) API so it can be used with anything that supports the standard.

## What is headjack?
Headjack is a semi-custodial web-wallet for NEO. User's private keys are encrypted using user passwords and stored on the company's servers, making the keys available from any device with a simple login while also making sure that the service doesn't have access to the keys, making it so no user funds are lost if the service is hacked.

**How is headjack different from Portis?** Portis doesn't work on the NEO blockchain and has no plans to adopt it.  
**What about Switcheo Account?** Switcheo Account only works in the Switcheo exchange, therefore it can't support arbitrary dApps.

Furthermore, Switcheo Account nor Portis are fully open-source, but Headjack is.

---

For more information, including a complete security analysis of Headjack, check out the [readme on Github](https://github.com/safudex/headjack/blob/master/README.md).
