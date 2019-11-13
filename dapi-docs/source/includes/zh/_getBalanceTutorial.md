## 获得资产余额

```typescript
neologin.getBalance({
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  },
  network: 'MainNet',
})
.then(results => {
  Object.keys(results).forEach(address => {
    const balances = results[address];
    balances.forEach(balance => {
      const { assetID, symbol, amount } = balance

      console.log('Address: ' + address);
      console.log('Asset ID: ' + assetID);
      console.log('Asset symbol: ' + symbol);
      console.log('Amount: ' + amount);
    });
  });
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
neologin.getBalance({
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  },
  network: 'MainNet',
})
.then(results => {
  Object.keys(results).forEach(address => {
    const balances = results[address];
    balances.forEach(balance => {
      const { assetID, symbol, amount } = balance

      console.log('Address: ' + address);
      console.log('Asset ID: ' + assetID);
      console.log('Asset symbol: ' + symbol);
      console.log('Amount: ' + amount);
    });
  });
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

无论你是想从用户在dAPP里使用’getaccount’提供的账户，还是你想从另外一个账号获取资产余额信息，你都可以使用‘getBalance’方法。默认之下，线上钱包供应商会向那些我们获取的地址询问他们NEO区块链的最新NEO，GAS或者任意NEP5代币的资产余额信息。此询问不会向用户请求任何权限，并且会在返还的期望(promise)被resolve后立刻获得余额信息。

在以下列子里，我们默认的向`AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru`地址询问了他在`MainNet`的余额信息。就像此列一样，你可以更换余额信息的来源网。比如，如果你还在开发中，你可以吧来源网改成‘TestNet’，此后账户的余额信息会从这个NEO测试网返还。

### 高级属性

```typescript
neologin.getBalance({
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
    assets: ['GAS'],
    fetchUTXO: true,
  },
  network: 'MainNet',
})
```
```javascript
neologin.getBalance({
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
    assets: ['GAS'],
    fetchUTXO: true,
  },
  network: 'MainNet',
})
```

额外来说，此‘getBalance’方法可以掺杂额外的参数来获取特定的资产余额信息，甚至可以返还这些余额的NEO和Gas UTXOs。
这是为了更高级的使用情况，基本上普遍的dAPP都不会被要求拥有这些高级属性。
