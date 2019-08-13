# Headjack
> Easy peasy NEO dAPI provider

## Quickstart

### Install
```bash
npm i headjack
```

### Initialize
```js
import Headjack from 'headjack';

const headjack = new Headjack('mainnet');
```

### Use
```js
headjack.getAccount()
.then((account: Account) => {
  const {
    address,
    label
  } = account;

  console.log('Provider address: ' + address);
  console.log('Provider account label (Optional): ' + label);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available');
      break;
    case CONNECTION_DENIED:
      console.log('The user rejected the request');
      break;
  }
});
```

The `headjack` object exposes a fully-compliant [NEP-12](https://github.com/nickfujita/proposals/blob/dapp-api/nep-12.mediawiki) API so it can be used with anything that supports the standard.

## What is headjack?
Headjack is a semi-custodial web-wallet for NEO. User's private keys are encrypted using user passwords and stored on the company's servers, making the keys available from any device with a simple login while also making sure that the service doesn't have access to the keys, making it so no user funds are lost if the service is hacked.

**How is headjack different from Portis?** Portis doesn't work on the NEO blockchain and has no plans to adopt it.  
**What about Switcheo Account?** Switcheo Account only works in the Switcheo exchange, therefore it can't support arbitrary dApps.

Furthermore, Switcheo Account nor Portis are fully open-source, but Headjack is.

## How does it work?
It works the same way Portis and Switcheo Account do, check out the explanations for their systems:
- [Portis whitepaper](https://assets.portis.io/white-paper/latest.pdf)
- [Medium article explaining how Switcheo Account works](https://medium.com/switcheo/switcheo-discovery-how-switcheo-account-actually-works-1c702bb77b16)

## Why was this created?
Because I wanted to use a semi-custodial wallet for SafuDEX but couln't find any. I tried to contact Switcheo about their solution but didn't get any reply, couldn't use their system because it's not fully open source and it doesn't make business sense for them to distribute it, as it's one of their competitive advantages.

Still, if Portis, Switcheo or any other company wants to develop a general semi-custodial wallet for NEO I'd love to collaborate on it, just send me an email.

## Security analysis

