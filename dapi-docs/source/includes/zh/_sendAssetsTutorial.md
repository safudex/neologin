## 向用户请求资产

```typescript
neologin.send({
  fromAddress: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  toAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  asset: 'GAS',
  amount: '0.01',
  network: 'MainNet',
})
.then(({txid, nodeUrl}: SendOutput) => {
  console.log('Send transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case SEND_ERROR:
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
    case MALFORMED_INPUT:
      console.log('The receiver address provided is not valid.');
      break;
    case CANCELED:
      console.log('The user has canceled this transaction.');
      break;
    case INSUFFICIENT_FUNDS:
      console.log('The user has insufficient funds to execute this transaction.');
      break;
  }
});
```
```javascript
neologin.send({
  fromAddress: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  toAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  asset: 'GAS',
  amount: '0.01',
  network: 'MainNet',
})
.then(({txid, nodeUrl}) => {
  console.log('Send transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "SEND_ERROR":
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
    case "MALFORMED_INPUT":
      console.log('The receiver address provided is not valid.');
      break;
    case "CANCELED":
      console.log('The user has canceled this transaction.');
      break;
    case "INSUFFICIENT_FUNDS":
      console.log('The user has insufficient funds to execute this transaction.');
      break;
  }
});
```

在一些dAPP想要请求用户付款或者从用户线上钱包转移资产到另外一个地址的情况,dAPI会提供‘send’方法。‘Send’方法接受从哪个地址转出资产，哪个地址会转入资产，要转出哪些资产和转出数量的基础参数。

在这个简单的案例里，我们正在进行基本的转出，吧0.01 GAS 从我们用‘getAccount’获取的地址转到dAPP地址。

### 高级属性

```typescript
neologin.send({
  fromAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  toAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  asset: 'GAS',
  amount: '0.01',
  network: 'MainNet',
  remark: 'Hash puppy clothing purchase. Invoice#abc123',
  fee: '0.0011',
})
```
```
neologin.send({
  fromAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  toAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  asset: 'GAS',
  amount: '0.01',
  network: 'MainNet',
  remark: 'Hash puppy clothing purchase. Invoice#abc123',
  fee: '0.0011',
})
```

‘Send’方法也同样可以接受一个叫做‘remark’的参数选项。这将会允许你在发送交易里附加一个简短的信息描述。这将被当作交易的一部分被记录在区块链中。

同样的，dAPP可以使用‘fee’参数来为交易附加一个‘network 手续费’。用户将会使用GAS来付这个‘network手续费’，并有助于在当内存堆满一些免费或者低手续费的交易时，更快的处理高额手续费的交易。
