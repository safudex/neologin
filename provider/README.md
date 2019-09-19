# NeoLogin
> A simple and easy to integrate wallet provider for NEO dApps

## Try it
Check out [a live example of NeoLogin's capabilities](https://neologin.io/)!

## Quickstart
```js
import neologin from 'neologin';

neologin.getAccount()
.then((account) => {
  console.log('Provider address: ' + account.address);
});
```

The API exposed by `neologin`, which is fully documented in [our API reference](https://neologin.io/api/), is exactly the same that O3 uses, so dApps that already integrate with O3 can directly add NeoLogin as a wallet provider.

## What is NeoLogin?
NeoLogin is a non-custodial web-based wallet for NEO. NeoLogin encrypts the user's private key with their password (making sure that it has enough entropy to prevent password cracking attacks) on sign up and proceeds to store the encrypted private key on it's servers.
Every time a user logs in, the private key is downloaded and decrypted in the browser client, therefore the server never gets to know the decryption password nor the private key itself.

This allows NeoLogin to provide the security of a non-custodial wallet coupled with the User Experience of a centralized login solution, as, from the point of view of the user, it works the same way as Google's universal login. 
