# Headjack
> Easy peasy NEO dAPI provider

# Quickstart

Install
```bash
npm i headjack
```

Initialize
```js
import Headjack from 'headjack';

const headjack = new Headjack('mainnet');
```

Use
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
      console.log('No provider available.');
      break;
    case CONNECTION_DENIED:
      console.log('The user rejected the request to connect with your dApp');
      break;
  }
});
```

The `headjack` object exposes a fully-compliant [NEP-12](https://github.com/nickfujita/proposals/blob/dapp-api/nep-12.mediawiki) API so it can be used with anything that supports the standard.

# What is headjack?
Headjack is a semi-custodial web-wallet for NEO.

It can also be viewed as a copy of Portis for the NEO blockchain or a generalized version of Switcheo Account. Also, compared to these other services, which only open source a small part of their system, Headjack is fully open-source.
