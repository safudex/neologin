## 获取用户地址

任何dAPP的基础功能之一是获取用户想在dAPP使用的账户地址。我们可以使用‘getAcoount’方法来实现此目的。这个办法会请示用户，请求他们登陆他们的账号，如果他们已经登陆了，会让他们知道你的dAPP正在请求他们提供他们的NeoLogin钱包地址。

假设你已经在你的应用里包含了‘[neologin](/api/#installation) JS package’,你可以call ‘getAccount’如以下:

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

此方法就像所有在dAPI里使用的方法一样,会返回一个JS 期望目标。此期望会是resolve或者reject,基于用户是允许了还是拒绝了你的请求。

如果你的‘getAccount’ 请求解决了期望, 你会得到一个有着‘address’和’lavel’的目标参数。’Address’是用户希望用来和你dAPP交涉的NEO地址。

此后你的dAPP可以使用此地址从dAPI询问此用户重要的额外信息，或是单单的持有将来用于转出转入资产的地址而已。
