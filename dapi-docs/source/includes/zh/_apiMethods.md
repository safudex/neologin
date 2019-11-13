# API方法

## 读取方法

读取方法不会改变区块链的状态。他能帮助你请求用户的信息，随即提供给你重要的信息:

### getProvider

```typescript
neologin.getProvider()
.then((provider: Provider) => {
  const {
    name,
    website,
    version,
    compatibility,
    extra,
  } = provider;

  const {
    theme,
    currency,
  } = extra;

  console.log('Provider name: ' + name);
  console.log('Provider website: ' + website);
  console.log('Provider dAPI version: ' + version);
  console.log('Provider dAPI compatibility: ' + JSON.stringify(compatibility));
  console.log('Provider UI theme: ' + theme);
  console.log('Provider Base currency: ' + currency);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case CONNECTION_DENIED:
      console.log('The user rejected the request to connect with your dApp.');
      break;
  }
});
```
```javascript
neologin.getProvider()
.then((provider) => {
  const {
    name,
    website,
    version,
    compatibility,
    extra,
  } = provider;

  const {
    theme,
    currency,
  } = extra;

  console.log('Provider name: ' + name);
  console.log('Provider website: ' + website);
  console.log('Provider dAPI version: ' + version);
  console.log('Provider dAPI compatibility: ' + JSON.stringify(compatibility));
  console.log('Provider UI theme: ' + theme);
  console.log('Provider Base currency: ' + currency);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "CONNECTION_DENIED":
      console.log('The user rejected the request to connect with your dApp.');
      break;
  }
});
```

> 返回例子

```typescript
{
  name: 'Awesome Wallet',
  website: 'https://www.awesome.com',
  version: 'v0.0.1',
  compatibility: [
    'NEP-14',
    'NEP-23',
    'NEP-29'
  ],
  extra: {
    theme: 'Dark Mode',
    currency: 'USD',
  }
}
```
```javascript
{
  name: 'Awesome Wallet',
  website: 'https://www.awesome.com',
  version: 'v0.0.1',
  compatibility: [
    'NEP-14',
    'NEP-23',
    'NEP-29'
  ],
  extra: {
    theme: 'Dark Mode',
    currency: 'USD',
  }
}
```

返回关于dAPI供应者的信息，包含此供应者是谁，他的dAPI版本以及跟接口兼容的NEP。

##### 输入参数

None

##### 成功返回
| Parameter     | Type     | Description                                                      |
|:------------- |:-------- |:---------------------------------------------------------------- |
| name     | String   | 线上钱包供应者的名字|                                 |
| website  | String   | 线上钱包供应者的网站|                 |
| version      | String   | 线上钱包支持的dAPI版本   |
| compatibility | String[] | 线上钱包供应者支持的能用的NEPs|
| extra         | Object   | 供应者的特定属性 |

###### extra
| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| theme     | string | 供应者的UI主题|
| currency  | string | 用户设置的基础货币|

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### getNetworks

```typescript
neologin.getNetworks()
.then(response => {
  const {
    networks,
    defaultNetwork,
  } = response;

  console.log('Networks: ' + networks);
  // eg. ["MainNet", "TestNet", "PrivateNet"]

  console.log('Default network: ' + defaultNetwork);
  // eg. "MainNet"
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
neologin.getNetworks()
.then(response => {
  const {
    networks,
    defaultNetwork,
  } = response;

  console.log('Networks: ' + networks);
  // eg. ["MainNet", "TestNet", "PrivateNet"]

  console.log('Default network: ' + defaultNetwork);
  // eg. "MainNet"
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

> 返回例子

```typescript
{
  networks: ["MainNet", "TestNet", "PrivateNet"],
  defaultNetwork: "TestNet",
}
```
```javascript
{
  networks: ["MainNet", "TestNet", "PrivateNet"],
  defaultNetwork: "TestNet",
}
```

返回线上钱包供应者允许连接的NETWORKS，以及当前钱包的默认NETWORK。

##### 输入参数

None

##### 成功返回

| Parameter      | Type     | Description                                                        |
|:-------------- |:-------- |:------------------------------------------------------------------ |
| networks       | String[] | 此线上钱包供应者允许访问的所有Networks列表|
| defaultNetwork | String   | 目前线上钱包默认的Network |

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### getAccount

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
  console.log(
  switch(type) {'Account label: ' + label);
})
.catch(({type, description, data}) => {

    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "CONNECTION_DENIED":
      console.log('The user rejected the request to connect with your dApp');
      break;
  }
});
```

> 返回例子

```typescript
{
  address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  label: 'My Spending Wallet'
}
```
```javascript
{
  address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  label: 'My Spending Wallet'
}
```

Return the Account that is currently connected to the dApp.

##### 成功返回
| Parameter | Type   | Description                                                        |
|:--------- |:------ |:------------------------------------------------------------------ |
| address   | String | 目前连接到dAPP的账户地址|
| label     | String | 用户为识别其线上钱包而设置的标签 |

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### getPublicKey

```typescript
neologin.getPublicKey()
.then((publicKeyData: PublicKeyData) => {
  const {
    address,
    publicKey,
  } = publicKeyData;

  console.log('Account address: ' + address);
  console.log('Account public key: ' + publicKey);
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
neologin.getPublicKey()
.then((publicKeyData) => {
  const {
    address,
    publicKey,
  } = publicKeyData;

  console.log('Account address: ' + address);
  console.log('Account public key: ' + publicKey);
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

> 返回例子

```typescript
{
  address: 'ATUaTd3LA4kZiyB6it9fdb5oJpZYMBF4DX',
  publicKey: '03fa41b6ff75ebeff8464556629cfceae7402f5d815626a7a6542f786974b942e0'
}
```
```javascript
{
  address: 'ATUaTd3LA4kZiyB6it9fdb5oJpZYMBF4DX',
  publicKey: '03fa41b6ff75ebeff8464556629cfceae7402f5d815626a7a6542f786974b942e0'
}
```

返回目前连接到dAPP上的账户的公开密钥。

##### 成功返回
| Parameter | Type   | Description                                                           |
|:--------- |:------ |:--------------------------------------------------------------------- |
| address   | String | 目前连接到dAPP上的账户地址    |
| publicKey | String | 目前连接到dAPP上的账户公钥|

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### getBalance

```typescript
neologin.getBalance({
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
    assets: ['NKN']
  },
  network: 'MainNet',
})
.then((results: BalanceResults) => {
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
    assets: ['NKN']
  },
  network: 'MainNet',
})
.then((results) => {
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

> Single Address with specific balances requested

```typescript
// input
{
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
    assets: ['NKN']
  },
  network: 'MainNet',
}

// output
{
  AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru: [
    {
      assetID: 'c36aee199dbba6c3f439983657558cfb67629599',
      symbol: 'NKN',
      amount: '0.00000233',
    }
  ],
}
```
```javascript
// input
{
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
    assets: ['NKN']
  },
  network: 'MainNet',
}

// output
{
  AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru: [
    {
      assetID: 'c36aee199dbba6c3f439983657558cfb67629599',
      symbol: 'NKN',
      amount: '0.00000233',
    }
  ],
}
```

> Single Address with all balances requested

```typescript
// input
{
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  },
  network: 'MainNet',
}

// output
{
  AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru: [
    {
      assetID: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      symbol: 'NEO',
      amount: '10',
    },
    {
      assetID: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
      symbol: 'GAS',
      amount: '777.0001',
    },
    {
      assetID: 'c36aee199dbba6c3f439983657558cfb67629599',
      symbol: 'NKN',
      amount: '0.00000233',
    },
    {
      assetID: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
      symbol: 'NNC',
      amount: '2000',
    }
  ]
}
```
```javascript
// input
{
  params: {
    address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
  },
  network: 'MainNet',
}

// output
{
  AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru: [
    {
      assetID: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      symbol: 'NEO',
      amount: '10',
    },
    {
      assetID: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
      symbol: 'GAS',
      amount: '777.0001',
    },
    {
      assetID: 'c36aee199dbba6c3f439983657558cfb67629599',
      symbol: 'NKN',
      amount: '0.00000233',
    },
    {
      assetID: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
      symbol: 'NNC',
      amount: '2000',
    }
  ]
}
```

> Multiple address balance queries

```typescript
// input
{
  params: [
    {
      address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
    },
    {
      address: 'AbKNY45nRDy6B65YPVz1B6YXiTnzRqU2uQ',
      assets: ['PHX'],
    },
  ],
  network: 'MainNet',
}

// output
{
  AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru: [
    {
      assetID: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      symbol: 'NEO',
      amount: '10',
    },
    {
      assetID: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
      symbol: 'GAS',
      amount: '777.0001',
    },
    {
      assetID: 'c36aee199dbba6c3f439983657558cfb67629599',
      symbol: 'NKN',
      amount: '0.00000233',
    },
    {
      assetID: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
      symbol: 'NNC',
      amount: '2000',
    }
  ],
  AbKNY45nRDy6B65YPVz1B6YXiTnzRqU2uQ: [
    {
      assetID: '1578103c13e39df15d0d29826d957e85d770d8c9',
      symbol: 'PHX',
      amount: '11000',
    }
  ]
}
```
```javascript
// input
{
  params: [
    {
      address: 'AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru',
    },
    {
      address: 'AbKNY45nRDy6B65YPVz1B6YXiTnzRqU2uQ',
      assets: ['PHX'],
    },
  ],
  network: 'MainNet',
}

// output
{
  AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru: [
    {
      assetID: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      symbol: 'NEO',
      amount: '10',
    },
    {
      assetID: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
      symbol: 'GAS',
      amount: '777.0001',
    },
    {
      assetID: 'c36aee199dbba6c3f439983657558cfb67629599',
      symbol: 'NKN',
      amount: '0.00000233',
    },
    {
      assetID: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
      symbol: 'NNC',
      amount: '2000',
    }
  ],
  AbKNY45nRDy6B65YPVz1B6YXiTnzRqU2uQ: [
    {
      assetID: '1578103c13e39df15d0d29826d957e85d770d8c9',
      symbol: 'PHX',
      amount: '11000',
    }
  ]
}
```

允许dAPP查询用户的资产余额，包含(NEO/GAS)和NEP-5 Tokens。

##### 输入参数
|Parameter| Type | Description   |
|:--------- |:---------------------------------- |:---------------------------------------------------------------------------------------- |
| params    | BalanceRequest or BalanceRequest[] | 请求咨询的余额目标列表，指定要查询的地址和哪些资产。 |
| network   | String                             | 此行动仅适用于在GetNetworks命令里的Networks。  |

###### BalanceRequest
| Parameter  | Type     | Description                                                                   |
|:---------- |:-------- |:----------------------------------------------------------------------------- |
| address    | String   | 你想要余额查询的地址   |
| assets     | String[] | 用于查询余额的HASH合同列表(或单单在主Network的Symbold)|
| fetchUTXO? | boolean  | 如果此属性为True,答案将会获得NEO和GAS UTXO’S  |

##### 成功返回
| Parameter | Type              | Description                                                                          |
|:--------- |:----------------- |:------------------------------------------------------------------------------------ |
| address_1 | BalanceResponse[] | 这是目前查询的地址密钥 (例如 "AeysVbKWiLSuSDhg7DTzUdDyYYKfgjojru")|
| address_2 | BalanceResponse[] | 这是目前查询的地址密钥 (例如 "AbKNY45nRDy6B65YPVz1B6YXiTnzRqU2uQ")|
| address_n | BalanceResponse[] | 这是目前查询的地址密钥 (例如 "AUdawyrLMskxXMUE8osX9mSLKz8R7777kE")|

<aside class="notice">
地址的数量为N，N是你在查询命令中的指定地址数量。
</aside>

###### BalanceResponse
| Parameter | Type    | Description                                                                                          |
|:--------- |:------- |:---------------------------------------------------------------------------------------------------- |
| assetID   | String  | 给与的资产ID                                                                               |
| symbol    | String  | 给与的资产Symbol                                                                          |
| amount    | String  | 代表着资产的String 。                                                  |
| unspent   | UTXO[]? | 如果获得的UTXO-S打开后，UTXO数组将会返回给NEO和GAS|

###### UTXO
| Parameter      | Type   | Description                                                           |
|:-------------- |:------ |:--------------------------------------------------------------------- |
| asset          | String | NEO/GAS的HASH脚本 |
| createdAtBlock | String | 在此区块号创建了UTXO|
| index          | Int    | 在TXID创造了UTXO的输出索引|
| txid           | String | 此UTXO的交易ID                                      |
| value          | String | 代表着此UTXO的String|

### getStorage

```typescript
neologin.getStorage({
  scriptHash: 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a',
  key: '74657374',
  network: 'TestNet'
})
.then(res => {
  const value = res.result;
  console.log('Storage value: ' + value);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case CONNECTION_REFUSED:
      console.log('Connection dApp not connected. Please call the "connect" function.');
      break;
    case RPC_ERROR:
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```
```javascript
neologin.getStorage({
  scriptHash: 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a',
  key: '74657374',
  network: 'TestNet'
})
.then(res => {
  const value = res.result;
  console.log('Storage value: ' + value);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "CONNECTION_REFUSED":
      console.log('Connection dApp not connected. Please call the "connect" function.');
      break;
    case "RPC_ERROR":
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```

> 返回例子

```typescript
{
  result: 'hello world'
}
```
```javascript
{
  result: 'hello world'
}
```

返回在合同储存中的原始数值。

##### 输入参数
| Parameter  | Type   | Description                                                  |
|:---------- |:------ |:------------------------------------------------------------ |
| scriptHash | String | 你正在咨询的合同存储的HASH脚本。|
| key        | String | 为了能从合同中找回储值的密钥。 |
| network    | String | 想提交此请求的Network名字。

##### 成功返回
| Parameter | Type   | Description                               |
|:--------- |:------ |:----------------------------------------- |
| result    | String | 在合同储存中的原始数值。|

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### invokeRead 

```typescript
neologin.invokeRead({
  scriptHash: '505663a29d83663a838eee091249abd167e928f5',
  operation: 'calculatorAdd',
  args: [
    {
      type: neologin.Constants.ArgumentDataType.INTEGER,
      value: 2
    },
    {
      type: neologin.Constants.ArgumentDataType.INTEGER,
      value: 10
    }
  ],
  network: 'TestNet'
})
.then((result: Object) => {
  console.log('Read invocation result: ' + JSON.stringify(result));
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case CONNECTION_REFUSED:
      console.log('Connection dApp not connected. Please call the "connect" function.');
      break;
    case RPC_ERROR:
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```
```javascript
neologin.invokeRead({
  scriptHash: '505663a29d83663a838eee091249abd167e928f5',
  operation: 'calculatorAdd',
  args: [
    {
      type: neologin.Constants.ArgumentDataType.INTEGER,
      value: 2
    },
    {
      type: neologin.Constants.ArgumentDataType.INTEGER,
      value: 10
    }
  ],
  network: 'TestNet'
})
.then((result) => {
  console.log('Read invocation result: ' + JSON.stringify(result));
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "CONNECTION_REFUSED":
      console.log('Connection dApp not connected. Please call the "connect" function.');
      break;
    case "RPC_ERROR":
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```

> 返回例子

```typescript
{
  script: '8h89fh398f42f.....89hf2894hf9834',
  state: 'HALT, BREAK',
  gas_consumed: '0.13',
  stack: [
    {
      type: 'Integer',
      value: '1337'
    }
  ]
}
```
```javascript
{
  script: '8h89fh398f42f.....89hf2894hf9834',
  state: 'HALT, BREAK',
  gas_consumed: '0.13',
  stack: [
    {
      type: 'Integer',
      value: '1337'
    }
  ]
}
```

在只读模式下执行调用合同。

##### 输入参数
| Parameter  | Type       | Description                                                                                              |
|:---------- |:---------- |:-------------------------------------------------------------------------------------------------------- |
| scriptHash | String     | 你想要调用来读的合同HASH脚本。                                             |
| operation  | String     | 你想要调用来读取的智能合约里的执行方法。 |
| args       | Argument[] | 执行此操作所需的参数输入|
| network    | String     | 你想要提交此请求的Network名，如果省略，将为线上钱包设置的默认Network。|

###### Argument
| Parameter | Type   | Description                                               |
|:--------- |:------ |:--------------------------------------------------------- |
| type      | String | 你正在使用的参数类型  |
| value     | String | 你正在使用的参数的String代表。|

<aside class =notice>
可用的类型是 "String"|"Boolean"|"Hash160"|"Hash256"|"Integer"|"ByteArray"|"Array"|"Address"
</aside>

##### 成功返回
线上钱包将直接返回从RPC接口收到的答案。

| Parameter    | Type       | Description                                                                                   |
|:------------ |:---------- |:--------------------------------------------------------------------------------------------- |
| script       | String     | 运行的脚本                                                                     |
| state        | String     | 运行状态|
| gas_consumed | String     | 预估用以执行调用的GAS费用。(每个交易最多免费10次) |
| stack        | Argument[] | 具体返回参数的数据组|

##### 错误返回
| Parameter   | Type    | Description                                   |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### verifyMessage

```typescript
neologin.verifyMessage({
  message: '058b9e03e7154e4db1e489c99256b7faHello World!',
  data: '0147fb89d0999e9d8a90edacfa26152fe695ec8b3770dcad522048297ab903822e12472364e254ff2e088fc3ebb641cc24722c563ff679bb1d1623d08bd5863d0d',
  publicKey: '0241392007396d6ef96159f047967c5a61f1af0871ecf9dc82afbedb68afbb949a',
})
.then(({result: bool}) => {
  console.log('Signature data matches provided message and public key: ' + result);
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
neologin.verifyMessage({
  message: '058b9e03e7154e4db1e489c99256b7faHello World!',
  data: '0147fb89d0999e9d8a90edacfa26152fe695ec8b3770dcad522048297ab903822e12472364e254ff2e088fc3ebb641cc24722c563ff679bb1d1623d08bd5863d0d',
  publicKey: '0241392007396d6ef96159f047967c5a61f1af0871ecf9dc82afbedb68afbb949a',
})
.then(({result}) => {
  console.log('Signature data matches provided message and public key: ' + result);
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

> 返回例子

```typescript
{
  result: true,
}
```
```javascript
{
  result: true,
}
```

返回提供的签名数据是否与提供的消息匹配并且是否由提供的公钥帐户签名。

##### 输入参数

| Parameter | Type   | Description                                            |
|:--------- |:------ |:------------------------------------------------------ |
| message   | String | 签了名的消息原件 |
| data      | String | 签名数据  |
| publicKey | String | 用以签名消息的账户公钥。|

##### 成功返回

| Parameter | Type    | Description                                                                |
|:--------- |:------- |:-------------------------------------------------------------------------- |
| result    | Boolean | 提供的签名是否与提供的消息以及公钥匹配。 |

##### 错误返回
| Parameter   | Type    | Description                                   |
|:----------- |:------- |:--------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String  | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### getBlock

```typescript
neologin.getBlock({
  blockHeight: 2619690,
  network: 'TestNet'
})
.then((result: Object) => {
  console.log('Block information: ' + JSON.stringify(result));
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
   case NO_PROVIDER:
     console.log('No provider available.');
     break;
   case RPC_ERROR:
     console.log('There was an error when broadcasting this transaction to the network.');
     break;
  }
});
```
```javascript
neologin.getBlock({
  blockHeight: 2619690,
  network: 'TestNet'
})
.then((result) => {
  console.log('Block information: ' + JSON.stringify(result));
})
.catch(({type, description, data}) => {
  switch(type) {
   case "NO_PROVIDER":
     console.log('No provider available.');
     break;
   case "RPC_ERROR":
     console.log('There was an error when broadcasting this transaction to the network.');
     break;
  }
});
```

获取特定的区块信息。

> 返回例子。

```typescript
{
  "hash": "0xc1668a114ee680597196ed402a0e0507fd8348e6090a54250d7accfadbd74b6e",
  "size": 686,
  "version": 0,
  "previousblockhash": "0xbae289c94e17ae90022673186fd6e1e48b7dd7afb89319bff0e2832db06d16b3",
  "merkleroot": "0x07d70f7337d3869a7daa538425d78a47212fb8c6130d66d84ac48526853a4e51",
  "time": 1557376153,
  "index": 2619690,
  "nonce": "8efd62ebb85ee68b",
  "nextconsensus": "AWZo4qAxhT8fwKL93QATSjCYCgHmCY1XLB",
  "script": {
    "invocation": "402a1dab9e5593d1d7d2a22a36772d4541b8053d33f8b8474b7d5a20066c1bd821e051fc252ed16146930d55ecb17fbb74972fba4c4b27af81a707999ca1313dd2401520eba2dd3b54a74a798cbb716c484ba6f6f21218f099e3d622a0fbd15989f38f9b0b344daf9b89175055d3a92f49df65118e8598735d651bedd4f1811baeb140e6491c03f3057f404d2fe7db50e40e82ade405a9dc7fccd81f4ba0b499a4a29f8570d631b8d40c5995b17d9391fe9ff8c73f28a4e1eb922b7a1ce9d1a5dc0448402cfcdede54828875d45402120aa2d8f78c7bd40df5e5d3b1873fd7e4d03672ebd0904f90c90fa519c623968f55550ae55374de66dc0db9c9d865c593bb95be5640214db0cd3cea6f4ad866df4129d482b89583805d1bdb08ce8399881e70351778a3e4a4093cf69aa7b99b83347fbfd38d85ff45d6a78ca2ab8cacffbfbc8c2d16",
    "verification": "5521030ef96257401b803da5dd201233e2be828795672b775dd674d69df83f7aec1e36210327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee821025bdf3f181f53e9696227843950deb72dcd374ded17c057159513c3d0abe20b64210266b588e350ab63b850e55dbfed0feeda44410a30966341b371014b803a15af0721026ce35b29147ad09e4afe4ec4a7319095f08198fa8babbe3c56e970b143528d222103c089d7122b840a4935234e82e26ae5efd0c2acb627239dc9f207311337b6f2c12103fd95a9cb3098e6447d0de9f76cc97fd5e36830f9c7044457c15a0e81316bf28f57ae"
  },
  "tx": [
    {
      "txid": "0x07d70f7337d3869a7daa538425d78a47212fb8c6130d66d84ac48526853a4e51",
      "size": 10,
      "type": "MinerTransaction",
      "version": 0,
      "attributes": [],
      "vin": [],
      "vout": [],
      "sys_fee": "0",
      "net_fee": "0",
      "scripts": [],
      "nonce": 3093227147
    }
  ],
  "confirmations": 70,
  "nextblockhash": "0x2c9d6a107b21e83e09dd1b89df344a726895147d410120c46996290692ba29aa"
}
```
```javascript
{
  "hash": "0xc1668a114ee680597196ed402a0e0507fd8348e6090a54250d7accfadbd74b6e",
  "size": 686,
  "version": 0,
  "previousblockhash": "0xbae289c94e17ae90022673186fd6e1e48b7dd7afb89319bff0e2832db06d16b3",
  "merkleroot": "0x07d70f7337d3869a7daa538425d78a47212fb8c6130d66d84ac48526853a4e51",
  "time": 1557376153,
  "index": 2619690,
  "nonce": "8efd62ebb85ee68b",
  "nextconsensus": "AWZo4qAxhT8fwKL93QATSjCYCgHmCY1XLB",
  "script": {
    "invocation": "402a1dab9e5593d1d7d2a22a36772d4541b8053d33f8b8474b7d5a20066c1bd821e051fc252ed16146930d55ecb17fbb74972fba4c4b27af81a707999ca1313dd2401520eba2dd3b54a74a798cbb716c484ba6f6f21218f099e3d622a0fbd15989f38f9b0b344daf9b89175055d3a92f49df65118e8598735d651bedd4f1811baeb140e6491c03f3057f404d2fe7db50e40e82ade405a9dc7fccd81f4ba0b499a4a29f8570d631b8d40c5995b17d9391fe9ff8c73f28a4e1eb922b7a1ce9d1a5dc0448402cfcdede54828875d45402120aa2d8f78c7bd40df5e5d3b1873fd7e4d03672ebd0904f90c90fa519c623968f55550ae55374de66dc0db9c9d865c593bb95be5640214db0cd3cea6f4ad866df4129d482b89583805d1bdb08ce8399881e70351778a3e4a4093cf69aa7b99b83347fbfd38d85ff45d6a78ca2ab8cacffbfbc8c2d16",
    "verification": "5521030ef96257401b803da5dd201233e2be828795672b775dd674d69df83f7aec1e36210327da12b5c40200e9f65569476bbff2218da4f32548ff43b6387ec1416a231ee821025bdf3f181f53e9696227843950deb72dcd374ded17c057159513c3d0abe20b64210266b588e350ab63b850e55dbfed0feeda44410a30966341b371014b803a15af0721026ce35b29147ad09e4afe4ec4a7319095f08198fa8babbe3c56e970b143528d222103c089d7122b840a4935234e82e26ae5efd0c2acb627239dc9f207311337b6f2c12103fd95a9cb3098e6447d0de9f76cc97fd5e36830f9c7044457c15a0e81316bf28f57ae"
  },
  "tx": [
    {
      "txid": "0x07d70f7337d3869a7daa538425d78a47212fb8c6130d66d84ac48526853a4e51",
      "size": 10,
      "type": "MinerTransaction",
      "version": 0,
      "attributes": [],
      "vin": [],
      "vout": [],
      "sys_fee": "0",
      "net_fee": "0",
      "scripts": [],
      "nonce": 3093227147
    }
  ],
  "confirmations": 70,
  "nextblockhash": "0x2c9d6a107b21e83e09dd1b89df344a726895147d410120c46996290692ba29aa"
}
```

在只读模式下执行合同调用。

##### 输入参数
| Parameter   | Type    | Description                                                                                              |
|:----------- |:------- |:-------------------------------------------------------------------------------------------------------- |
| blockHeight | integer | 你想要获取信息的区块的高度。|
| network     | String  | 你想要提交此请求的Network名，如果省略，将为线上钱包设置的默认Network。|

##### 成功返回
线上钱包将直接返回从RPC接口收到的答案。

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### getBlockHeight

```typescript
neologin.getBlockHeight({
  network: 'TestNet'
})
.then((res: {result: number}) => {
  console.log('Block height: ' + res.result);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
   case NO_PROVIDER:
     console.log('No provider available.');
     break;
   case RPC_ERROR:
     console.log('There was an error when broadcasting this transaction to the network.');
     break;
  }
});
```
```javascript
neologin.getBlockHeight({
  network: 'TestNet'
})
.then((res) => {
  console.log('Block height: ' + res.result);
})
.catch(({type, description, data}) => {
  switch(type) {
   case "NO_PROVIDER":
     console.log('No provider available.');
     break;
   case "RPC_ERROR":
     console.log('There was an error when broadcasting this transaction to the network.');
     break;
  }
});
```

获取当前区块的高度。

> 返回例子

```typescript
{
  "result": 2619690
}
```

在只读模式下执行合同调用。

##### 输入参数
| Parameter | Type   | Description                                                                                              |
|:--------- |:------ |:-------------------------------------------------------------------------------------------------------- |
| network   | String | 你想要提交此请求的Network名，如果省略，将为线上钱包设置的默认Network。|| |

##### 成功返回
| Parameter | Type   | Description                 |
|:--------- |:------ |:--------------------------- |
| result    | Number | 目前区块的高度 |

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据|

### getTransaction

```typescript
neologin.getTransaction({
  txid: '7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2',
  network: 'TestNet'
})
.then((result: Object) => {
  console.log('Transaction details: ' + JSON.stringify(result));
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case RPC_ERROR:
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```
```javascript
neologin.getTransaction({
  txid: '7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2',
  network: 'TestNet'
})
.then((result) => {
  console.log('Transaction details: ' + JSON.stringify(result));
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "RPC_ERROR":
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```

获取特定的交易信息。

> 返回例子

```typescript
{
  "txid": "0x7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2",
  "size": 556,
  "type": "InvocationTransaction",
  "version": 1,
  "attributes": [
    {
      "usage": "Script",
      "data": "296ac124021a71c449a9bad320c16429b08ad6ee"
    },
    {
      "usage": "Remark",
      "data": "cbb549adec34d741"
    }
  ],
  "vin": [],
  "vout": [],
  "sys_fee": "0",
  "net_fee": "0",
  "scripts": [
    {
      "invocation": "4072b83e8aca62c27dc36b032b895e757db00620384e26f43cd0ecc9904bff1e652dd94a03226d6dcb0b6f91104cb40be6455aa0fc3b474a8a8e5fa43ff4b10b8d40af726dc0976f15cd8a134634074c5613ab1e59979fec37b611392975c92afa11038fd9d96ddfb306df12ae200dc3c15fa17cb9530389e28f090fd8c9721c3307",
      "verification": "53c56b6c766b00527ac46c766b51527ac4616c766b00c36121022949376faacb0c6783da8ab63548926cb3a2e8d786063a449833f927fa8853f0ac642f006c766b51c361210292a25f5f0772d73d3fb50d42bb3cb443505b15e106789d19efa4d09c5ddca756ac635f006c766b00c361210292a25f5f0772d73d3fb50d42bb3cb443505b15e106789d19efa4d09c5ddca756ac642f006c766b51c36121022949376faacb0c6783da8ab63548926cb3a2e8d786063a449833f927fa8853f0ac62040000620400516c766b52527ac46203006c766b52c3616c7566"
    }
  ],
  "script": "0400e1f505147869ef9732cdf6f6d54adaa5cae3b55a9396bceb14296ac124021a71c449a9bad320c16429b08ad6ee53c1087472616e7366657267f1dfcf0051ec48ec95c8d0569e0b95075d099d84f10400e1f50514b1fdddf658ce5ff9f83e66ede2f333ecfcc0463e14296ac124021a71c449a9bad320c16429b08ad6ee53c1087472616e7366657267f1dfcf0051ec48ec95c8d0569e0b95075d099d84f1",
  "gas": "0",
  "blockhash": "0x4ea57fe267a392933d2b03fa733fbf1fa12c13f7e8ae2051e45465800e1a7cdb",
  "confirmations": 9,
  "blocktime": 1557377749
}
```
```javascript
{
  "txid": "0x7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2",
  "size": 556,
  "type": "InvocationTransaction",
  "version": 1,
  "attributes": [
    {
      "usage": "Script",
      "data": "296ac124021a71c449a9bad320c16429b08ad6ee"
    },
    {
      "usage": "Remark",
      "data": "cbb549adec34d741"
    }
  ],
  "vin": [],
  "vout": [],
  "sys_fee": "0",
  "net_fee": "0",
  "scripts": [
    {
      "invocation": "4072b83e8aca62c27dc36b032b895e757db00620384e26f43cd0ecc9904bff1e652dd94a03226d6dcb0b6f91104cb40be6455aa0fc3b474a8a8e5fa43ff4b10b8d40af726dc0976f15cd8a134634074c5613ab1e59979fec37b611392975c92afa11038fd9d96ddfb306df12ae200dc3c15fa17cb9530389e28f090fd8c9721c3307",
      "verification": "53c56b6c766b00527ac46c766b51527ac4616c766b00c36121022949376faacb0c6783da8ab63548926cb3a2e8d786063a449833f927fa8853f0ac642f006c766b51c361210292a25f5f0772d73d3fb50d42bb3cb443505b15e106789d19efa4d09c5ddca756ac635f006c766b00c361210292a25f5f0772d73d3fb50d42bb3cb443505b15e106789d19efa4d09c5ddca756ac642f006c766b51c36121022949376faacb0c6783da8ab63548926cb3a2e8d786063a449833f927fa8853f0ac62040000620400516c766b52527ac46203006c766b52c3616c7566"
    }
  ],
  "script": "0400e1f505147869ef9732cdf6f6d54adaa5cae3b55a9396bceb14296ac124021a71c449a9bad320c16429b08ad6ee53c1087472616e7366657267f1dfcf0051ec48ec95c8d0569e0b95075d099d84f10400e1f50514b1fdddf658ce5ff9f83e66ede2f333ecfcc0463e14296ac124021a71c449a9bad320c16429b08ad6ee53c1087472616e7366657267f1dfcf0051ec48ec95c8d0569e0b95075d099d84f1",
  "gas": "0",
  "blockhash": "0x4ea57fe267a392933d2b03fa733fbf1fa12c13f7e8ae2051e45465800e1a7cdb",
  "confirmations": 9,
  "blocktime": 1557377749
}
```

在只读模式下执行合同调用。

##### 输入参数
| Parameter | Type   | Description                                                                                               |
|:--------- |:------ |:--------------------------------------------------------------------------------------------------------- |
| txid      | String | 你想要获取信息的交易ID。|
| network   | String | 你想要提交此请求的Network名，如果省略，将为线上钱包设置的默认Network。 |

##### 成功返回
线上钱包将直接返回从RPC接口收到的答案。

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### getApplicationLog

```typescript
neologin.getApplicationLog({
  txid: '7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2',
  network: 'TestNet'
})
.then((result: Object) => {
  console.log('Application log of transaction execution: ' + JSON.stringify(result));
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case RPC_ERROR:
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```
```javascript
neologin.getApplicationLog({
  txid: '7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2',
  network: 'TestNet'
})
.then((result) => {
  console.log('Application log of transaction execution: ' + JSON.stringify(result));
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "RPC_ERROR":
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
  }
});
```

获得给与的交易的应用程序日志。

> 返回例子

```typescript
{
  "txid": "0x7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2",
  "executions": [
    {
      "trigger": "Application",
      "contract": "0x72985e7f2cea98b89af54d8607bc6400814c4b45",
      "vmstate": "HALT",
      "gas_consumed": "5.292",
      "stack": [],
      "notifications": [
        {
          "contract": "0x849d095d07950b9e56d0c895ec48ec5100cfdff1",
          "state": {
            "type": "Array",
            "value": [
              {
                "type": "ByteArray",
                "value": "7472616e73666572"
              },
              {
                "type": "ByteArray",
                "value": "296ac124021a71c449a9bad320c16429b08ad6ee"
              },
              {
                "type": "ByteArray",
                "value": "7869ef9732cdf6f6d54adaa5cae3b55a9396bceb"
              },
              {
                "type": "ByteArray",
                "value": "00e1f505"
              }
            ]
          }
        },
        {
          "contract": "0x849d095d07950b9e56d0c895ec48ec5100cfdff1",
          "state": {
            "type": "Array",
            "value": [
              {
                "type": "ByteArray",
                "value": "7472616e73666572"
              },
              {
                "type": "ByteArray",
                "value": "296ac124021a71c449a9bad320c16429b08ad6ee"
              },
              {
                "type": "ByteArray",
                "value": "b1fdddf658ce5ff9f83e66ede2f333ecfcc0463e"
              },
              {
                "type": "ByteArray",
                "value": "00e1f505"
              }
            ]
          }
        }
      ]
    }
  ]
}
```
```javascript
{
  "txid": "0x7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2",
  "executions": [
    {
      "trigger": "Application",
      "contract": "0x72985e7f2cea98b89af54d8607bc6400814c4b45",
      "vmstate": "HALT",
      "gas_consumed": "5.292",
      "stack": [],
      "notifications": [
        {
          "contract": "0x849d095d07950b9e56d0c895ec48ec5100cfdff1",
          "state": {
            "type": "Array",
            "value": [
              {
                "type": "ByteArray",
                "value": "7472616e73666572"
              },
              {
                "type": "ByteArray",
                "value": "296ac124021a71c449a9bad320c16429b08ad6ee"
              },
              {
                "type": "ByteArray",
                "value": "7869ef9732cdf6f6d54adaa5cae3b55a9396bceb"
              },
              {
                "type": "ByteArray",
                "value": "00e1f505"
              }
            ]
          }
        },
        {
          "contract": "0x849d095d07950b9e56d0c895ec48ec5100cfdff1",
          "state": {
            "type": "Array",
            "value": [
              {
                "type": "ByteArray",
                "value": "7472616e73666572"
              },
              {
                "type": "ByteArray",
                "value": "296ac124021a71c449a9bad320c16429b08ad6ee"
              },
              {
                "type": "ByteArray",
                "value": "b1fdddf658ce5ff9f83e66ede2f333ecfcc0463e"
              },
              {
                "type": "ByteArray",
                "value": "00e1f505"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

在只读模式下执行合同调用。

##### 输入参数
| Parameter | Type   | Description                                                                                              |
|:--------- |:------ |:-------------------------------------------------------------------------------------------------------- |
| txid      | String | 你想要获取应用程序日志的交易ID。|
| network   | String | 你想要提交此请求的Network名，如果省略，将为线上钱包设置的默认Network。|

##### 成功返回
线上钱包将直接返回从RPC接口收到的答案。

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据|

### encrypt

```typescript
neologin.encrypt({
  recipientPublicKey: "03ca7443e1ec9e9c502ebe5a8f6d76f02f9b74bf9063bf3921ad9b76d389218529",
  data: "Guess what"
})
.then(({iv, data, mac}: EncryptOutput) => {
  console.log('Data encrypted success!');
  console.log('Iv: 'iv);
  console.log('Mac: ' + mac);
  console.log('Encrypted data: ' + data);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case MALFORMED_INPUT:
      console.log('Input not valid.');
      break;
  }
});
```
```javascript
neologin.send({
  recipientPublicKey: "03ca7443e1ec9e9c502ebe5a8f6d76f02f9b74bf9063bf3921ad9b76d389218529",
  data: "Guess what"
})
.then(({txid, nodeUrl}) => {
  console.log('Data encrypted success!');
  console.log('Iv: 'iv);
  console.log('Mac: ' + mac);
  console.log('Encrypted data: ' + data);
})
.catch(({type, description, data}) => {
  switch(type) {
    case MALFORMED_INPUT:
      console.log('Input not valid.');
      break;
  }
});
```

> 返回例子

```typescript
{
  iv: "459d0efdfcd2091f6c6d2dbe2a763a1e",
  mac: "16f413e85e85594180e889db139306e4aab75df4a6d6c5e211473e8b4d3527f3",
  data: "73bb2f041bf8cad3cbb514b092dadcd3"
}
```
```javascript
{
  iv: "459d0efdfcd2091f6c6d2dbe2a763a1e",
  mac: "16f413e85e85594180e889db139306e4aab75df4a6d6c5e211473e8b4d3527f3",
  data: "73bb2f041bf8cad3cbb514b092dadcd3"
}
```

使用公钥来加密数据，Aes 256 cbc 加密。

##### 输入参数
| Parameter          | Type             | Description                                              |
|:------------------ |:---------------- |:-------------------------------------------------------- |
| recipientPublicKey | String           | 接收人的公钥 |
| data               | String or Buffer | 你想要加密的数据  |

##### 成功返回
| Parameter | Type   | Description                                         |
|:--------- |:------ |:--------------------------------------------------- |
| iv        | String | 需要加密的初始化向量（一次）。|
| mac       | String | 需要加密的信息验证码。 |
| data      | String | 需要加密的数据              |

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### decrypt

```typescript
neologin.decrypt({
  senderPublicKey: "029c6fac1f105c2eef68a220018eada4740d013e0cf0091e9aa1fb95f2e328d1c8",
  iv: "3ad568936c20b8e15c1e2c6ca72db446",
  mac: "a27507c744d99405e772ff1f96ec276eadb1ba50373bbeb74a5a5d2935269a8d",
  data: "4580a73371ef75f4c14b3b46835ea055"
})
.then(({bufferData, data}: DecryptOutput) => {
  console.log('Data decrypted success!');
  console.log('Decrypted data: ' + data);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case MALFORMED_INPUT:
      console.log('Input not valid.');
      break;
    case BAD_MAC:
      console.log('Bad mac')
  }
});
```
```javascript
neologin.send({
  senderPublicKey: "029c6fac1f105c2eef68a220018eada4740d013e0cf0091e9aa1fb95f2e328d1c8",
  iv: "3ad568936c20b8e15c1e2c6ca72db446",
  mac: "a27507c744d99405e772ff1f96ec276eadb1ba50373bbeb74a5a5d2935269a8d",
  data: "4580a73371ef75f4c14b3b46835ea055"
})
.then(({bufferData, data}) => {
  console.log('Data decrypted success!');
  console.log('Decrypted data: ' + data);
})
.catch(({type, description, data}) => {
  switch(type) {
    case MALFORMED_INPUT:
      console.log('Input not valid.');
      break;
    case BAD_MAC:
      console.log('Bad mac')
  }
});
```

> 返回例子

```typescript
{
  bufferData: Uint8Array(10), //[71, 117, 101, 115, 115, 32, 119, 104, 97, 116]
  data: "Guess what"
}
```
```javascript
{
  bufferData: Uint8Array(10), //[71, 117, 101, 115, 115, 32, 119, 104, 97, 116]
  data: "Guess what"
}
```

使用用户密钥来解密数据。在此之前数据必须以其的公钥加密。Aes 256 cbc解密。

##### 输入参数
| Parameter       | Type   | Description                 |
|:--------------- |:------ |:-------------------------   |
| senderPublicKey | String | 发送人的公钥|
| iv              | String | 初始化向量|
| mac             | String | 信息验证码 |
| data            | String | 加密的数据|

##### 成功返回
| Parameter  | Type       | Description    |
|:---------- |:---------- |:-------------- |
| bufferData | Uint8Array | 解密的数据|
| data       | String     | 解密的数据|

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型|
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据|

## 写入方法

加入方法会改变区块链状态，并需要用户签名。

### send

```typescript
neologin.send({
  fromAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  toAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  asset: 'GAS',
  amount: '0.0001',
  remark: 'Hash puppy clothing purchase. Invoice#abc123',
  fee: '0.0001',
  network: 'MainNet',
  broadcastOverride: false,
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
  fromAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  toAddress: 'ATaWxfUAiBcQixNPq6TvKHEHPQum9bx79d',
  asset: 'GAS',
  amount: '0.0001',
  remark: 'Hash puppy clothing purchase. Invoice#abc123',
  fee: '0.0001',
  network: 'MainNet',
  broadcastOverride: false,
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

> 返回例子

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```
```javascript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```

发送的API可以用于让用户接受使用在NEO区块链的虚拟币来付款。需要用户验证为了能够中继交易。交易将由线上钱包中继。

##### 输入参数。
| Parameter         | Type     | Description                                                                                                                                        |
|:----------------- |:-------- |:-------------------------------------------------------------------------------------------------------------------------------------------------- |
| fromAddress       | String   | 发送交易的地址。此数值将和从getAccount API接收到的一致。  |
| toAddress         | String   | 用户应将资金汇至的地址。|
| asset             | String   | 被请求付款的资产。比如NEP5 ScripHash, GAS or CGAS。 |
| amount            | String   | 被请求付款的金额。|
| remark            | String?  | 可以被放置在交易中的属性备注，此数据将会出现在区块链的交易记录里。|
| fee               | String?  | 如果已经指定具体费用那么线上钱包不应该覆盖他，如果未指定费用则线上钱包应该允许用户附加可选费用。|
| network           | String   | 将此请求提交到的Network。|
| broadcastOverride | Boolean? | 如果此标志设置为True,那么线上钱包供应者将返回已经签了名的交易而不是广播到节点。|

##### 成功返回

在没有设置或者设置为False‘BroadcastOverride’输入参数的情况下。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。|
| nodeURL   | String | 提交了交易的节点。|

<aside class="warning">
建议DAPP在接受交易时采取适当级别的风险预防措施。让DAPP可以查询已知的节点内存池以确保交易确实会在Network上广播。
</aside>

当‘BroadcastOverride’输入参数为True时。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。 |
| signedTx  | String | 序列化已签名的交易。|

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

### invoke
```typescript
neologin.invoke({
  scriptHash: '505663a29d83663a838eee091249abd167e928f5',
  operation: 'storeData',
  args: [
    {
      type: neologin.Constants.ArgumentDataType.STRING,
      value: 'hello'
    }
  ],
  attachedAssets: {
    NEO: '100',
    GAS: '0.0001',
  },
  fee: '0.001',
  network: 'TestNet',
  broadcastOverride: false,
  txHashAttributes: [
    {
      type: 'Boolean',
      value: true,
      txAttrUsage: 'Hash1'
    }
  ]
})
.then(({txid, nodeUrl}: InvokeOutput) => {
  console.log('Invoke transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case RPC_ERROR:
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
    case CANCELED:
      console.log('The user has canceled this transaction.');
      break;
  }
});
```
```javascript
neologin.invoke({
  scriptHash: '505663a29d83663a838eee091249abd167e928f5',
  operation: 'storeData',
  args: [
    {
      type: neologin.Constants.ArgumentDataType.STRING,
      value: 'hello'
    }
  ],
  attachedAssets: {
    NEO: '100',
    GAS: '0.0001',
  },
  fee: '0.001',
  network: 'TestNet',
  broadcastOverride: false,
  txHashAttributes: [
    {
      type: 'Boolean',
      value: true,
      txAttrUsage: 'Hash1'
    }
  ]
})
.then(({txid, nodeUrl}) => {
  console.log('Invoke transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "RPC_ERROR":
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
    case "CANCELED":
      console.log('The user has canceled this transaction.');
      break;
  }
});
```

> 返回例子

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```
```javascript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```

调用允许代表用户执行通用智能合约。建议你对NEO区块链有一个基本的了解，并能够在尝试执行通用合同之前成功的使用所有其他在文档中列出的命令。

##### 输入参数
| Parameter                   | Type                 | Description                                                                                                                                        |
|:--------------------------- |:-------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------- |
| scriptHash                  | String               | 你想要调用的合同HASH脚本。                                                                                          |
| operation                   | String               | 你想要调用的智能合约里上的操作。这个可以从ABI合同中获取。|
| args                        | Argument[]           | 要执行的操作所需的参数列表。|
| fee                         | String?              | 如果已经指定具体费用那么线上钱包不应该覆盖他，如果未指定费用则线上钱包应该允许用户附加可选费用。|
| network                     | String               | 想提交此请求的Network名字。                                                                                                           |
| attachedAssets              | AttachedAssets?      | 描述智能合约附带的资产，比如在代币销售时将资产附加到Mint代币。|
| assetIntentOverrides        | AssetIntentOverrides | 用于指定要为附加资产使用的确切UTXO’s。如果提供此参数，Fee和attachedassets则会被无视。|
| triggerContractVerification | Boolean?             | 添加指令用以调用合同验证触发器。                                                                                      |
| broadcastOverride           | Boolean?             | 如果此标志设置为True,那么线上钱包供应者将返回已经签了名的交易而不是广播到节点。                            |
| txHashAttributes            | TxHashAttribute[]?   | 要添加的tx属性hash值可选列表。                                                                                            |

###### Argument
| Parameter | Type   | Description                                               |
|:--------- |:------ |:--------------------------------------------------------- |
| type      | String | 你正在使用的参数类型。 |
| value     | String | 你正在使用的参数的String代表。|

<aside class =notice>
可用的类型是 "String"|"Boolean"|"Hash160"|"Hash256"|"Integer"|"ByteArray"|"Array"|"Address"
</aside>

###### TxHashAttribute
| Parameter   | Type   | Description                                               |
|:----------- |:------ |:--------------------------------------------------------- |
| type        | String | 你正在使用的参数类型。 |
| value       | String | 你正在使用的参数的String代表。|
| txAttrUsage | String | 属性的使用值。|

<aside class =notice>
可用TxAttrUsage是 'Hash1'|'Hash2'|'Hash3'|'Hash4'|'Hash5'|'Hash6'|'Hash7'|'Hash8'|'Hash9'|'Hash10'|'Hash11'|'Hash12'|'Hash13'|'Hash14'|'Hash15'
</aside>

###### AttachedAssets
| Parameter | Type    | Description                                            |
|:--------- |:------- |:------------------------------------------------------ |
| NEO       | String? | 调用合同附带的NEO数量。|
| GAS       | String? | 调用合同附带的GAS数量。|

###### AssetIntentOverrides
| Parameter | Type          | Description                                        |
|:--------- |:------------- |:-------------------------------------------------- |
| inputs    | AssetInput[]  | 为此交易使用的UTXO输入列表。 |
| outputs   | AssetOutput[] | 为此交易使用的UTXO输出列表。|

###### AssetInput
| Parameter | Type   | Description                                              |
|:--------- |:------ |:-------------------------------------------------------- |
| txid      | String | 用作输入的交易ID。 |
| index     | String | UTXO的索引，可在交易明细中找到。|

###### AssetOutput
| Parameter | Type   | Description                                                           |
|:--------- |:------ |:--------------------------------------------------------------------- |
| asset     | String | UTXO的资产。 |
| address   | String | 接收UTXO的地址。 |
| value     | String | 用作与输出的Double或Ineteger值|

##### 成功返回

在没有设置或者设置为False‘BroadcastOverride’输入参数的情况下。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。|
| nodeURL   | String | 提交了交易的节点。|

<aside class="warning">
建议DAPP在接受交易时采取适当级别的风险预防措施。让DAPP可以查询已知的节点内存池以确保交易确实会在Network上广播。
</aside>

当‘BroadcastOverride’输入参数为True时。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。|
| signedTx  | String | 序列化已签名的交易。                                            |

###### 根据以下条件设置交易属性脚本0x20：

- 如果合同验证触发器设为True,将调用合同的脚本hask设置为0x20。
- 如果没有Fee，AttachedAssets或者‘AssetInterntOverrrides’，将用户地址设为0x20。
- 如果这里有‘AssetIntentOverrides’，可这些输入没有一个属于用户地址的，那么将用户地址设为0x20。

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型|
| description | String? | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据|

### invokeMulti
```typescript
neologin.invokeMulti({
  invokeArgs: [
    {
      scriptHash: '505663a29d83663a838eee091249abd167e928f5',
      operation: 'storeData',
      args: [
        {
          type: neologin.Constants.ArgumentDataType.STRING,
          value: 'hello'
        }
      ],
      attachedAssets: {
        NEO: '100',
        GAS: '0.0001',
      },
      triggerContractVerification: true,
    },
    {
      scriptHash: '505663a29d83663a838eee091249abd167e928f5',
      operation: 'purchaseTicket',
      args: [
        {
          type: neologin.Constants.ArgumentDataType.INTEGER,
          value: '10'
        }
      ],
    }
  ],
  fee: '0.001',
  network: 'TestNet',
  broadcastOverride: false,
  txHashAttributes: [
    {
      type: neologin.Constants.ArgumentDataType.BOOLEAN,
      value: true,
      txAttrUsage: 'Hash1'
    }
  ]
})
.then(({txid, nodeUrl}: InvokeOutput) => {
  console.log('Invoke transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case NO_PROVIDER:
      console.log('No provider available.');
      break;
    case RPC_ERROR:
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
    case CANCELED:
      console.log('The user has canceled this transaction.');
      break;
  }
});
```
```javascript
neologin.invokeMulti({
  invokeArgs: [
    {
      scriptHash: '505663a29d83663a838eee091249abd167e928f5',
      operation: 'storeData',
      args: [
        {
          type: neologin.Constants.ArgumentDataType.STRING,
          value: 'hello'
        }
      ],
      attachedAssets: {
        NEO: '100',
        GAS: '0.0001',
      },
      triggerContractVerification: true,
    },
    {
      scriptHash: '505663a29d83663a838eee091249abd167e928f5',
      operation: 'purchaseTicket',
      args: [
        {
          type: neologin.Constants.ArgumentDataType.INTEGER,
          value: '10'
        }
      ],
    }
  ],
  fee: '0.001',
  network: 'TestNet',
  broadcastOverride: false,
  txHashAttributes: [
    {
      type: neologin.Constants.ArgumentDataType.BOOLEAN,
      value: true,
      txAttrUsage: 'Hash1'
    }
  ]
})
.then(({txid, nodeUrl}) => {
  console.log('Invoke transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "NO_PROVIDER":
      console.log('No provider available.');
      break;
    case "RPC_ERROR":
      console.log('There was an error when broadcasting this transaction to the network.');
      break;
    case "CANCELED":
      console.log('The user has canceled this transaction.');
      break;
  }
});
```

> 返回例子

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```
```javascript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```

调用多功能跟调用一样，当其接受用以在同一交易中执行多个调用的输入。

##### 输入参数
| Parameter            | Type                 | Description                                                                                                                                        |
|:-------------------- |:-------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------- |
| fee                  | String?              | 如果已经指定具体费用那么线上钱包不应该覆盖他，如果未指定费用则线上钱包应该允许用户附加可选费用。|
| network              | String               | 想提交此请求的Network名字。                                                                                                          |
| assetIntentOverrides | AssetIntentOverrides | 用于指定要为附加资产使用的确切UTXO’s。如果提供此参数，Fee和attachedassets则会被无视。                           |
| invokeArgs           | InvokeArguments[]    | 合约调用输入数组。|
| broadcastOverride    | Boolean?             | 如果此标志设置为True,那么线上钱包供应者将返回已经签了名的交易而不是广播到节点。                            |
| txHashAttributes     | TxHashAttribute[]?   | 要添加的tx属性hash值可选列表。|

###### InvokeArguments
| Parameter                   | Type            | Description                                                                                                      |
|:--------------------------- |:--------------- |:---------------------------------------------------------------------------------------------------------------- |
| scriptHash                  | String          | 你想要调用的合同HASH脚本。                       |
| operation                   | String          | 你想要调用的智能合约里上的操作。这个可以从ABI合同中获取。|
| args                        | Argument[]      | 要执行的操作所需的参数列表。 |
| attachedAssets              | AttachedAssets? | 描述智能合约附带的资产，比如在代币销售时将资产附加到Mint代币。|
| triggerContractVerification | Boolean?        | 添加指令用以调用合同验证触发器。|

<aside class="warning">
使用多重‘合同验证触发器’的特定编码交易不能保证跟03使用的编码一致。
</aside>

###### Argument
| Parameter | Type   | Description                                               |
|:--------- |:------ |:--------------------------------------------------------- |
| type      | String | 你正在使用的参数类型。  |
| value     | String | 你正在使用的参数的String代表。|

<aside class =notice>
可用的类型是 "String"|"Boolean"|"Hash160"|"Hash256"|"Integer"|"ByteArray"|"Array"|"Address"
</aside>

###### TxHashAttribute

| Parameter   | Type   | Description                                               |
|:----------- |:------ |:--------------------------------------------------------- |
| type        | String | 你正在使用的参数类型。  |
| value       | String | 你正在使用的参数的String代表。|
| txAttrUsage | String | 属性的使用值。 |

<aside class =notice>
可用TxAttrUsage是 'Hash1'|'Hash2'|'Hash3'|'Hash4'|'Hash5'|'Hash6'|'Hash7'|'Hash8'|'Hash9'|'Hash10'|'Hash11'|'Hash12'|'Hash13'|'Hash14'|'Hash15'
</aside>

###### AttachedAssets
| Parameter | Type    | Description                                            |
|:--------- |:------- |:------------------------------------------------------ |
| NEO       | String? | 调用合同附带的NEO数量。|
| GAS       | String? | 调用合同附带的GAS数量。|

###### AssetIntentOverrides
| Parameter | Type          | Description                                        |
|:--------- |:------------- |:-------------------------------------------------- |
| inputs    | AssetInput[]  | 为此交易使用的UTXO输入列表。|
| outputs   | AssetOutput[] | 为此交易使用的UTXO输出列表。|

###### AssetInput 
| Parameter | Type   | Description                                              |
|:--------- |:------ |:-------------------------------------------------------- |
| txid      | String | 用作输入的交易ID。  |
| index     | String | UTXO的索引，可在交易明细中找到。|

###### AssetOutput
| Parameter | Type   | Description                                                           |
|:--------- |:------ |:--------------------------------------------------------------------- |
| asset     | String | 为此交易使用的UTXO输入列表。 |
| address   | String | 为此交易使用的UTXO输出列表。 |
| value     | String | 用作与输出的Double或Ineteger值|

##### 成功返回

在没有设置或者设置为False‘BroadcastOverride’输入参数的情况下。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。|
| nodeURL   | String | 提交了交易的节点。|

<aside class="warning">
建议DAPP在接受交易时采取适当级别的风险预防措施。让DAPP可以查询已知的节点内存池以确保交易确实会在Network上广播。

DApp将负责设置适合交易规模的Network Fee(‘网费’)
</aside>

当‘BroadcastOverride’输入参数为True时。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。|
| signedTx  | String | 序列化已签名的交易。                                            |

###### 根据以下条件设置交易属性脚本0x20：

- 如果合同验证触发器设为True,将调用合同的脚本hask设置为0x20。
- 如果没有Fee，AttachedAssets或者‘AssetInterntOverrrides’，将用户地址设为0x20。
- 如果这里有‘AssetIntentOverrides’，可这些输入没有一个属于用户地址的，那么将用户地址设为0x20。

##### 错误返回
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | 发生的错误的类型|
| description | String? | 发生的错误的描述 |
| data        | String? | 与错误相关的原始数据|

### signMessage

```typescript
neologin.signMessage({
  message: 'Hello World!',
})
.then((signedMessage: SignedMessage) => {
  const {
    publicKey,
    message,
    salt,
    data,
  } = signedMessage;

  console.log('Public key used to sign:', publicKey);
  console.log('Original message:', message);
  console.log('Salt added to message:', salt);
  console.log('Signed data:', data);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case UNKNOWN_ERROR:
      console.log(description);
      break;
  }
});
```
```javascript
neologin.signMessage({
  message: 'Hello World!',
})
.then((signedMessage) => {
  const {
    publicKey,
    message,
    salt,
    data,
  } = signedMessage;

  console.log('Public key used to sign:', publicKey);
  console.log('Original message:', message);
  console.log('Salt added to message:', salt);
  console.log('Signed data:', data);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "UNKNOWN_ERROR":
      console.log(description);
      break;
  }
});
```

> 返回例子

```typescript
{
  publicKey: '0241392007396d6ef96159f047967c5a61f1af0871ecf9dc82afbedb68afbb949a',
  data: '0147fb89d0999e9d8a90edacfa26152fe695ec8b3770dcad522048297ab903822e12472364e254ff2e088fc3ebb641cc24722c563ff679bb1d1623d08bd5863d0d',
  salt: '058b9e03e7154e4db1e489c99256b7fa',
  message: 'Hello World!',
}
```
```javascript
{
  publicKey: '0241392007396d6ef96159f047967c5a61f1af0871ecf9dc82afbedb68afbb949a',
  data: '0147fb89d0999e9d8a90edacfa26152fe695ec8b3770dcad522048297ab903822e12472364e254ff2e088fc3ebb641cc24722c563ff679bb1d1623d08bd5863d0d',
  salt: '058b9e03e7154e4db1e489c99256b7fa',
  message: 'Hello World!',
}
```

用用户选择的账号对提供的消息进行签名。将Salt(随机数字)前缀添加到输入String，并在签名时作为数据的一部分提供。举个例子，签名的数值将为`058b9e03e7154e4db1e489c99256b7faHello World!`.

##### 输入参数

| Parameter | Type   | Description         |
|:--------- |:------ |:------------------- |
| message   | String | 要签名的消息。 |

##### 成功返回

| Parameter | Type   | Description                                                  |
|:--------- |:------ |:------------------------------------------------------------ |
| publicKey | String | 用于信息签名的公钥。|
| data      | String | 签了名的数据 |
| salt      | String | Salt前缀将在签名之前添加到原始消息中。| 
| message   | String | 原始信息 |

##### 错误返回

| Parameter   | Type    | Description                                   |
|:----------- |:------- |:--------------------------------------------- |
| type        | String  | 发生的错误的类型 |
| description | String  | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据|

### deploy

```typescript
neologin.deploy({
  network: 'TestNet',
  name: 'Hello world!',
  version: 'v0.0.1',
  author: 'John Smith',
  email: 'neo@neologin.io',
  description: 'My first contract.',
  needsStorage: true,
  dynamicInvoke: false,
  isPayable: false,
  parameterList: '0710',
  returnType: '05',
  code: '53c56b0d57616b652075702c204e454f21680f4e656f2e52756e74696d652e4c6f6761006c7566',
  networkFee: '0.001',
})
.then(({txid, nodeUrl}: InvokeOutput) => {
  console.log('Deploy transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type: string, description: string, data: any}) => {
  switch(type) {
    case UNKNOWN_ERROR:
      console.log(description);
      break;
  }
});
```
```javascript
neologin.deploy({
  network: 'TestNet',
  name: 'Hello world!',
  version: 'v0.0.1',
  author: 'John Smith',
  email: 'neo@neologin.io',
  description: 'My first contract.',
  needsStorage: true,
  dynamicInvoke: false,
  isPayable: false,
  parameterList: '0710',
  returnType: '05',
  code: '53c56b0d57616b652075702c204e454f21680f4e656f2e52756e74696d652e4c6f6761006c7566',
  networkFee: '0.001',
})
.then(({txid, nodeUrl}) => {
  console.log('Deploy transaction success!');
  console.log('Transaction ID: ' + txid);
  console.log('RPC node URL: ' + nodeUrl);
})
.catch(({type, description, data}) => {
  switch(type) {
    case "UNKNOWN_ERROR":
      console.log(description);
      break;
  }
});
```

> 返回例子

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```
```javascript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```

将使用提供的输入参数来将已编译的智能合约部署到区块链里。部署合同的GAS费用将由供应者计算，并在TX接受或拒绝后显示给用户。

##### 输入参数

| Parameter         | Type     | Description                                                                                                             |
|:----------------- |:-------- |:----------------------------------------------------------------------------------------------------------------------- |
| network           | String   | 想提交此请求的Network名字。|
| name              | String   | 将被部署的合同的名字|
| version           | String   | 将被部署的合同的版本|
| author            | String   | 将被部署的合同的作者|
| email             | String   | 将被部署的合同的邮件|
| description       | String   | 将被部署的合同的描述|
| needsStorage      | Boolean  | 合同是否将使用储存。|
| dynamicInvoke     | Boolean  | 合同是否将会履行其他智能合同动态调用。|
| isPayable         | Boolean  | 合同是否将能够接受NEO/GAS。|
| parameterList     | String   | 合同中Main函数的输入参数类型列表。(https://docs.neo.org/en-us/sc/Parameter.html) |
| returnType        | String   | 合同中的输出Return Type参数类型列表。(https://docs.neo.org/en-us/sc/Parameter.html) |
| code              | String   | 已编译的智能合约avm的hex。|
| networkFee        | String   | 用于执行交易的Network费用，还有自动添加的部署费用。| 
| broadcastOverride | Boolean? | 如果此标志设置为True,那么线上钱包供应者将返回已经签了名的交易而不是广播到节点。|

##### 成功返回

在没有设置或者设置为False‘BroadcastOverride’输入参数的情况下。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。|
| nodeURL   | String | 提交了交易的节点。|

<aside class="warning">
建议DAPP在接受交易时采取适当级别的风险预防措施。让DAPP可以查询已知的节点内存池以确保交易确实会在Network上广播。
</aside>

当‘BroadcastOverride’输入参数为True时。

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | 可以的区块链上查询的发送请求的交易ID。|
| signedTx  | String | 序列化已签名的交易。                                           |

##### 错误返回
| Parameter   | Type    | Description                                   |
|:----------- |:------- |:--------------------------------------------- |
| type        | String  | 发生的错误的类型|
| description | String  | 发生的错误的描述|
| data        | String? | 与错误相关的原始数据 |

## 事件方法

### addEventListener

```typescript
neologin.addEventListener(neologin.Constants.EventName.ACCOUNT_CHANGED, data => {
  console.log(`Connected Account: ${data.address}`);
});
```
```javascript
neologin.addEventListener(neologin.Constants.EventName.ACCOUNT_CHANGED, data => {
  console.log(`Connected Account: ${data.address}`);
});
```

方法用于要在指定事件上添加回调的触发。

### removeEventListener

```typescript
neologin.removeEventListener(neologin.Constants.EventName.ACCOUNT_CHANGED);
```
```javascript
neologin.removeEventListener(neologin.Constants.EventName.ACCOUNT_CHANGED);
```

删除现有回调事件的监听方法。

## 事件
事件用于线上钱包同DAPP的异步沟通，关于可能与DAPP相关的区块链状态的某些变化。

### READY
在‘就绪’事件，回调将使用包含着线上钱包供应者信息的单个参数。在任意时间将添加‘就绪’事件的监听器，当线上钱包供应者已经处于就绪状态时，将立刻调用监听器。

| Parameter     | Type     | Description                                                      |
|:------------- |:-------- |:---------------------------------------------------------------- |
| name          | String   | 线上钱包供应者的名字 |
| website       | String   | 线上钱包供应者的网站|
| version       | String   | 线上钱包支持的dAPI版本。|
| compatibility | String[] | 线上钱包供应者支持的能用的NEPs |
| extra         | Object   | 供应者的特定属性。 |

###### extra
| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| theme     | string | 供应者的UI主题|

### ACCOUNT_CHANGED

在‘账户已更改’事件，回调将使用新账户的单个参数。这种情况发生在当一个账户已经连接到dAPP，然后用户从DAPI供应者那方改变了连接的账户。

| Parameter | Type   | Description                                        |
|:--------- |:------ |:-------------------------------------------------- |
| address   | String | 新账户的地址|
| label     | String | 用户为识别其线上钱包而设置的标签。 |

### CONNECTED

在‘连接的’事件，用户允许了dAPP连接到其的一个账号。这将在DApp首次调用以下任意一种方法时触发：`getAccount`, `invoke`, `send`.

| Parameter | Type   | Description                                        |
|:--------- |:------ |:-------------------------------------------------- |
| address   | String | 新账户的地址|
| label     | String | 户为识别其线上钱包而设置的标签。|

### DISCONNECTED

在‘断开的‘事件，从DApi供应者连接到DApp的账户断开了连接（登出了）。

### NETWORK_CHANGED

在‘Network已更改‘事件，用户更改了他们线上钱包供应者连接的Network。此事件将返还更新的Network细节。

| Parameter      | Type     | Description                                                        |
|:-------------- |:-------- |:------------------------------------------------------------------ |
| networks       | String[] | 此线上钱包供应者允许访问的所有Networks列表|
| defaultNetwork | String   | 目前线上钱包默认的Network |

### BLOCK_HEIGHT_CHANGED

在‘区块高度已更改‘事件，该区块已前进到下一个。

| Parameter   | Type     | Description                                       |
|:----------- |:-------- |:------------------------------------------------- |
| network     | String   | 改变的区块的Network |
| blockHeight | Number   | 新区块的高度 |
| blockTime   | Number   | 新区块的时间戳记|
| blockHash   | String   | 新区块的Hash |
| tx          | String[] | 在新区块里执行了的交易id列表|

### TRANSACTION_CONFIRMED

在‘确认交易‘事件里，之前通过DAPI广播的交易已被区块链确认。

| Parameter   | Type   | Description                                 |
|:----------- |:------ |:------------------------------------------- |
| txid        | String | 在区块链确认的交易ID|
| blockHeight | Number | 新区块的高度|
| blockTime   | Number | 新区块的时间戳|

## 错误
NEO dAPI会提供这些基础错误。将取决于线上钱包供应商是否提供额外信息。

| Error Type         | Meaning                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| NO_PROVIDER        | 在网页中找不到DAPI的实例。                      |
| CONNECTION_DENIED  | DAPI供应者拒绝处理这个请求。|
| RPC_ERROR          | 在提交请求时发生了RPC错误。|
| MALFORMED_INPUT    | 输入参数比如地址为无效的NEO地址。|
| CANCELED           | 用户取消了或者拒绝了DAPPS的请求。 |
| INSUFFICIENT_FUNDS | 用户没有足够的余额来执行操作的请求。|

## 实用程序

这些是常用以及实用的解析智能合约响应的工具合集。

### hex2str

```typescript
const hex2strInput = '68656c6c6f';
const hex2strExpected = 'hello';

const hex2strResult = neologin.utils.hex2str(hex2strInput);

console.log('hex2str', hex2strExpected === hex2strResult);
```
```javascript
const hex2strInput = '68656c6c6f';
const hex2strExpected = 'hello';

const hex2strResult = neologin.utils.hex2str(hex2strInput);

console.log('hex2str', hex2strExpected === hex2strResult);
```

将十六进制字符串转换为字符串。

### str2hex

```typescript
const str2hexInput = 'hello';
const str2hexExpected = '68656c6c6f';

const str2hexResult = neologin.utils.str2hex(str2hexInput);

console.log('str2hex', str2hexExpected === str2hexResult);
```
```javascript
const str2hexInput = 'hello';
const str2hexExpected = '68656c6c6f';

const str2hexResult = neologin.utils.str2hex(str2hexInput);

console.log('str2hex', str2hexExpected === str2hexResult);
```

将字符串转换为十六进制字符串。

### hex2int

```typescript
const hex2intInput = '00e1f505';
const hex2intExpected = 100000000;

const hex2intResult = neologin.utils.hex2int(hex2intInput);

console.log('hex2int', hex2intExpected === hex2intResult);
```
```javascript
const hex2intInput = '00e1f505';
const hex2intExpected = 100000000;

const hex2intResult = neologin.utils.hex2int(hex2intInput);

console.log('hex2int', hex2intExpected === hex2intResult);
```

将十六进制字符串转换为整数。

### int2hex

```typescript
const int2hexInput = 100000000;
const int2hexExpected = '00e1f505';

const int2hexResult = neologin.utils.int2hex(int2hexInput);

console.log('int2hex', int2hexExpected === int2hexResult);
```
```javascript
const int2hexInput = 100000000;
const int2hexExpected = '00e1f505';

const int2hexResult = neologin.utils.int2hex(int2hexInput);

console.log('int2hex', int2hexExpected === int2hexResult);
```

将整数转换为十六进制字符串。

### reverseHex

```typescript
const reverseHexInput = 'bc99b2a477e28581b2fd04249ba27599ebd736d3';
const reverseHexExpected = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';
const reverseHexResult = neologin.utils.reverseHex(reverseHexInput);

console.log('reverseHex', reverseHexExpected === reverseHexResult);
```
```javascript
const reverseHexInput = 'bc99b2a477e28581b2fd04249ba27599ebd736d3';
const reverseHexExpected = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';
const reverseHexResult = neologin.utils.reverseHex(reverseHexInput);

console.log('reverseHex', reverseHexExpected === reverseHexResult);
```

将十六进制字符串的字节序转换为大到小或小到大。

### address2scriptHash

```typescript
const address2scriptHashInput = 'Ab2fvZdmnM4HwDgVbdBrbTLz1wK5TcEyhU';
const address2scriptHashExpected = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';

const address2scriptHashResult = neologin.utils.address2scriptHash(address2scriptHashInput);

console.log('address2scriptHash', address2scriptHashExpected === address2scriptHashResult);
```
```javascript
const address2scriptHashInput = 'Ab2fvZdmnM4HwDgVbdBrbTLz1wK5TcEyhU';
const address2scriptHashExpected = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';

const address2scriptHashResult = neologin.utils.address2scriptHash(address2scriptHashInput);

console.log('address2scriptHash', address2scriptHashExpected === address2scriptHashResult);
```

将地址转换为HASH脚本。

### scriptHash2address

```typescript
const scriptHash2addressInput = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';
const scriptHash2addressExpected = 'Ab2fvZdmnM4HwDgVbdBrbTLz1wK5TcEyhU';

const scriptHash2addressResult = neologin.utils.scriptHash2address(scriptHash2addressInput);

console.log('scriptHash2address', scriptHash2addressExpected === scriptHash2addressResult);
```
```javascript
const scriptHash2addressInput = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';
const scriptHash2addressExpected = 'Ab2fvZdmnM4HwDgVbdBrbTLz1wK5TcEyhU';

const scriptHash2addressResult = neologin.utils.scriptHash2address(scriptHash2addressInput);

console.log('scriptHash2address', scriptHash2addressExpected === scriptHash2addressResult);
```

将HASH脚本转换为地址。
