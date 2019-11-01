## Get user address

One of the first basic tasks for any dapp is to get the address of the account which the user would like to utilize with a dApp. In order to do this, we can use the method `getAccount`. This method will prompt the user, requesting them to log in their account and, if they have already done so, letting them know that your dApp is requesting that they provide the address of their NeoLogin wallet.

Assuming that you have already included the [neologin](/api/#installation) JS package into your application, you can call the method `getAccount`, as follows:

```typescript
neologin.getAccount()
.then((account: Account) => {
  const {
    address,
    label,
  } = account;

  console.log('Account address: ' + address);
  console.log('Account label: ' + label);
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
```javascript
neologin.getAccount()
.then((account) => {
  const {
    address,
    label,
  } = account;

  console.log('Account address: ' + address);
  console.log('Account label: ' + label);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "CONNECTION_DENIED":
      console.log('The user rejected the request to connect with your dApp');
      break;
  }
});
```

This method, like all methods on the dAPI return a JS Promise object. This promise will resolve or reject, based on whether the user has approve or denied your request.

In the case that the request to `getAccount`, resolves the Promise, you will be returned an object with the parameters `address` and `label`. The `address` is the NEO address for the account which the user would like to interact with your dApp.

From here, the dApp can use this address to query additional information from the dAPI that are relevant to that specific user, or simply have an address for which assets will be sent.
