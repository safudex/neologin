# Write Methods

Write methods will alter the state on the blockchain, and require a user signature.

## send

```typescript
o3dapi.NEO.send({
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

> Example Response

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}
```

The send API can be used for accepting payments from the user in a cryptocurrency that is located on the NEO blockchain. It requires user authentication in order for the transaction to be relayed. The transaction will be relayed by the wallet.

### Input Arguments
| Parameter         | Type     | Description                                                                                                                                        |
|:----------------- |:-------- |:-------------------------------------------------------------------------------------------------------------------------------------------------- |
| fromAddress       | String   | The address from where the transaction is being sent. This will be the same value as the one received from the getAccount API                      |
| toAddress         | String   | The address to where the user should send their funds                                                                                              |
| asset             | String   | The asset which is being requested for payment...e.g NEP5 scripHash, GAS or CGAS                                                                   |
| amount            | String   | The amount which is being requested for payment                                                                                                    |
| remark            | String?  | A transaction attribute remark which may be placed in the transaction, this data will appear in the transaction record on the blockchain           |
| fee               | String?  | If a fee is specified then the wallet SHOULD NOT override it, if a fee is not specified the wallet SHOULD allow the user to attach an optional fee |
| network           | String   | Network alias to submit this request to.                                                                                                           |
| broadcastOverride | Boolean? | If this flag is set to True, the wallet provider will return the signed transaction rather than broadcasting to a node.                            |

### Success Response

In the case where the "broadcastOverride" input argument is not set, or set to false.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| nodeURL   | String | The node to which the transaction was submitted to                            |

<aside class="warning">
It is reccommended that the DAPP take appropriate levels of risk prevention when accepting transactions. The dapp can query the mempool of a known node to ensure that the transaction will indeed be broadcast on the network.
</aside>

In the case where the "broadcastOverride" input argument is set to True.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| signedTx  | String | The serialized signed transaction                                             |


### Error Response
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | The type of error which has occured          |
| description | String? | A description of the error which has occured |
| data        | String? | Any raw data associated with the error       |

## invoke
```typescript
o3dapi.NEO.invoke({
  scriptHash: '505663a29d83663a838eee091249abd167e928f5',
  operation: 'storeData',
  arguments: [
    {
      type: o3dapi.NEO.Constants.ArgumentDataType.STRING,
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

> Example Response

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}:
```

Invoke allows for the generic execution of smart contracts on behalf of the user. It is reccommended to have a general understanding of the NEO blockchain, and to be able successfully use all other commands listed previously in this document before attempting a generic contract execution.

### Input arguments
| Parameter                   | Type                 | Description                                                                                                                                        |
|:--------------------------- |:-------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------- |
| scriptHash                  | String               | The script hash of the contract that you wish to invoke                                                                                            |
| operation                   | String               | The operation on the smart contract that you wish to call. This can be fetched from the contract ABI                                               |
| args                        | Argument[]           | A list of arguments necessary to perform on the operation you wish to call                                                                         |
| fee                         | String?              | If a fee is specified then the wallet SHOULD NOT override it, if a fee is not specified the wallet SHOULD allow the user to attach an optional fee |
| network                     | String               | Network alias to submit this request to.                                                                                                           |
| attachedAssets              | AttachedAssets?      | Describes the assets to attach with the smart contract, e.g. attaching assets to mint tokens during a token sale                                   |
| assetIntentOverrides        | AssetIntentOverrides | Used to specify the exact UTXO's to use for attached assets. If this is provided fee and attachedAssets will be ignored                            |
| triggerContractVerification | Boolean?             | Adds the instruction to invoke the contract verifican trigger                                                                                      |
| broadcastOverride           | Boolean?             | If this flag is set to True, the wallet provider will return the signed transaction rather than broadcasting to a node.                            |
| txHashAttributes            | TxHashAttribute[]?   | Optional list of tx attribute hash values to be added                                                                                              |

#### Argument
| Parameter | Type   | Description                                               |
|:--------- |:------ |:--------------------------------------------------------- |
| type      | String | The type of the argument with you are using               |
| value     | String | String representation of the argument which you are using |

<aside class =notice>
Available types are "String"|"Boolean"|"Hash160"|"Hash256"|"Integer"|"ByteArray"|"Array"|"Address"
</aside>

#### TxHashAttribute
| Parameter   | Type   | Description                                               |
|:----------- |:------ |:--------------------------------------------------------- |
| type        | String | The type of the argument with you are using               |
| value       | String | String representation of the argument which you are using |
| txAttrUsage | String | Attribute usage value                                     |

<aside class =notice>
Available txAttrUsages are Hash1'|'Hash2'|'Hash3'|'Hash4'|'Hash5'|'Hash6'|'Hash7'|'Hash8'|'Hash9'|'Hash10'|'Hash11'|'Hash12'|'Hash13'|'Hash14'|'Hash15'
</aside>

#### AttachedAssets
| Parameter | Type    | Description                                            |
|:--------- |:------- |:------------------------------------------------------ |
| NEO       | String? | The amount of NEO to attach to the contract invocation |
| GAS       | String? | The amount of GAS to attach to the contract invocation |

#### AssetIntentOverrides
| Parameter | Type          | Description                                        |
|:--------- |:------------- |:-------------------------------------------------- |
| inputs    | AssetInput[]  | A list of UTXO inputs to use for this transaction  |
| outputs   | AssetOutput[] | A list of UTXO outputs to use for this transaction |

#### AssetInput
| Parameter | Type   | Description                                              |
|:--------- |:------ |:-------------------------------------------------------- |
| txid      | String | Transaction id to be used as input                       |
| index     | String | Index of the UTXO, can be found from transaction details |

#### AssetOutput
| Parameter | Type   | Description                                                           |
|:--------- |:------ |:--------------------------------------------------------------------- |
| asset     | String | Asset of the UTXO                                                     |
| address   | String | Address to receive the UTXO                                           |
| value     | String | String representation of double or integer value to be used as output |


### Success Response

In the case where the "broadcastOverride" input argument is not set, or set to false.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| nodeURL   | String | The node to which the transaction was submitted to                            |

<aside class="warning">
It is reccommended that the DAPP take appropriate levels of risk prevention when accepting transactions. The dapp can query the mempool of a known node to ensure that the transaction will indeed be broadcast on the network.
</aside>

In the case where the "broadcastOverride" input argument is set to True.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| signedTx  | String | The serialized signed transaction                                             |

### Error Response
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | The type of error which has occured          |
| description | String? | A description of the error which has occured |
| data        | String? | Any raw data associated with the error       |


## invokeMulti
```typescript
o3dapi.NEO.invokeMulti({
  invokeArgs: [
    {
      scriptHash: '505663a29d83663a838eee091249abd167e928f5',
      operation: 'storeData',
      arguments: [
        {
          type: o3dapi.NEO.Constants.ArgumentDataType.STRING,
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
      arguments: [
        {
          type: o3dapi.NEO.Constants.ArgumentDataType.INTEGER,
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
      type: o3dapi.NEO.Constants.ArgumentDataType.BOOLEAN,
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

> Example Response

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}:
```

Invoke Multi functions the same as Invoke, but accepts inputs to execute multiple invokes in the same transaction.

### Input arguments
| Parameter            | Type                 | Description                                                                                                                                        |
|:-------------------- |:-------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------- |
| fee                  | String?              | If a fee is specified then the wallet SHOULD NOT override it, if a fee is not specified the wallet SHOULD allow the user to attach an optional fee |
| network              | String               | Network alias to submit this request to.                                                                                                           |
| assetIntentOverrides | AssetIntentOverrides | Used to specify the exact UTXO's to use for attached assets. If this is provided fee and attachedAssets will be ignored                            |
| invokeArgs           | InvokeArguments[]    | Array of contract invoke inputs                                                                                                                    |
| broadcastOverride    | Boolean?             | If this flag is set to True, the wallet provider will return the signed transaction rather than broadcasting to a node.                            |
| txHashAttributes     | TxHashAttribute[]?   | Optional list of tx attribute hash values to be added                                                                                              |

#### InvokeArguments
| Parameter                   | Type            | Description                                                                                                      |
|:--------------------------- |:--------------- |:---------------------------------------------------------------------------------------------------------------- |
| scriptHash                  | String          | The script hash of the contract that you wish to invoke                                                          |
| operation                   | String          | The operation on the smart contract that you wish to call. This can be fetched from the contract ABI             |
| args                        | Argument[]      | A list of arguments necessary to perform on the operation you wish to call                                       |
| attachedAssets              | AttachedAssets? | Describes the assets to attach with the smart contract, e.g. attaching assets to mint tokens during a token sale |
| triggerContractVerification | Boolean?        | Adds the instruction to invoke the contract verifican trigger                                                    |

#### Argument
| Parameter | Type   | Description                                               |
|:--------- |:------ |:--------------------------------------------------------- |
| type      | String | The type of the argument with you are using               |
| value     | String | String representation of the argument which you are using |

<aside class =notice>
Available types are "String"|"Boolean"|"Hash160"|"Hash256"|"Integer"|"ByteArray"|"Array"|"Address"
</aside>

#### TxHashAttribute
| Parameter   | Type   | Description                                               |
|:----------- |:------ |:--------------------------------------------------------- |
| type        | String | The type of the argument with you are using               |
| value       | String | String representation of the argument which you are using |
| txAttrUsage | String | Attribute usage value                                     |

<aside class =notice>
Available txAttrUsages are Hash1'|'Hash2'|'Hash3'|'Hash4'|'Hash5'|'Hash6'|'Hash7'|'Hash8'|'Hash9'|'Hash10'|'Hash11'|'Hash12'|'Hash13'|'Hash14'|'Hash15'
</aside>

#### AttachedAssets
| Parameter | Type    | Description                                            |
|:--------- |:------- |:------------------------------------------------------ |
| NEO       | String? | The amount of NEO to attach to the contract invocation |
| GAS       | String? | The amount of GAS to attach to the contract invocation |

#### AssetIntentOverrides
| Parameter | Type          | Description                                        |
|:--------- |:------------- |:-------------------------------------------------- |
| inputs    | AssetInput[]  | A list of UTXO inputs to use for this transaction  |
| outputs   | AssetOutput[] | A list of UTXO outputs to use for this transaction |

#### AssetInput
| Parameter | Type   | Description                                              |
|:--------- |:------ |:-------------------------------------------------------- |
| txid      | String | Transaction id to be used as input                       |
| index     | String | Index of the UTXO, can be found from transaction details |

#### AssetOutput
| Parameter | Type   | Description                                                           |
|:--------- |:------ |:--------------------------------------------------------------------- |
| asset     | String | A list of UTXO inputs to use for this transaction                     |
| address   | String | A list of UTXO outputs to use for this transaction                    |
| value     | String | String representation of double or integer value to be used as output |


### Success Response

In the case where the "broadcastOverride" input argument is not set, or set to false.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| nodeURL   | String | The node to which the transaction was submitted to                            |

<aside class="warning">
It is reccommended that the DAPP take appropriate levels of risk prevention when accepting transactions. The dapp can query the mempool of a known node to ensure that the transaction will indeed be broadcast on the network.

dApp will be responsible for setting a network fee appropriate for the size of the transaction.
</aside>

In the case where the "broadcastOverride" input argument is set to True.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| signedTx  | String | The serialized signed transaction                                             |

### Error Response
| Parameter   | Type    | Description                                  |
|:----------- |:------- |:-------------------------------------------- |
| type        | String  | The type of error which has occured          |
| description | String? | A description of the error which has occured |
| data        | String? | Any raw data associated with the error       |


## signMessage

```typescript
o3dapi.NEO.signMessage({
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

> Example Response

```typescript
{
  publicKey: '0241392007396d6ef96159f047967c5a61f1af0871ecf9dc82afbedb68afbb949a',
  data: '0147fb89d0999e9d8a90edacfa26152fe695ec8b3770dcad522048297ab903822e12472364e254ff2e088fc3ebb641cc24722c563ff679bb1d1623d08bd5863d0d',
  salt: '058b9e03e7154e4db1e489c99256b7fa',
  message: 'Hello World!',
}
```

Signs a provided messaged with an account selected by user. A salt prefix is added to the input string, and provided as a part of the data while signing. In the example, the signed value would be `058b9e03e7154e4db1e489c99256b7faHello World!`.

### Input Arguments

| Parameter | Type   | Description         |
|:--------- |:------ |:------------------- |
| message   | String | The message to sign |

### Success Response

| Parameter | Type   | Description                                                  |
|:--------- |:------ |:------------------------------------------------------------ |
| publicKey | String | The public key used to sign message                          |
| data      | String | The signed data                                              |
| salt      | String | The salt prefix added to the original message before signing |
| message   | String | The original message                                         |


### Error Response

| Parameter   | Type    | Description                                   |
|:----------- |:------- |:--------------------------------------------- |
| type        | String  | The type of error which has occurred          |
| description | String  | A description of the error which has occurred |
| data        | String? | Any raw data associated with the error        |


## deploy

```typescript
o3dapi.NEO.deploy({
  network: 'PrivateNet',
  name: 'Hello world!',
  version: 'v0.0.1',
  author: 'John Smith',
  email: 'info@o3.network',
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

> Example Response

```typescript
{
  txid: 'ed54fb38dff371be6e3f96e4880405758c07fe6dd1295eb136fe15f311e9ff77',
  nodeUrl: 'http://seed7.ngd.network:10332',
}:
```

Will deploy a compiled smart contract to the blockchain with the provided input parameters. The GAS cost for deploying the contract will be calculated by the provider, and displayed to the user upon tx acceptance or rejection.

### Input Arguments

| Parameter         | Type     | Description                                                                                                             |
|:----------------- |:-------- |:----------------------------------------------------------------------------------------------------------------------- |
| message           | String   | The message to sign                                                                                                     |
| network           | String   | Network alias to submit this request to.                                                                                |
| name              | String   | The name of the contract to be deployed                                                                                 |
| version           | String   | The version of the contract to be deployed                                                                              |
| author            | String   | The author of the contract to be deployed                                                                               |
| email             | String   | The email of the contract to be deployed                                                                                |
| description       | String   | The description of the contract to be deployed                                                                          |
| needsStorage      | Boolean  | Whether or not the contract will use storage                                                                            |
| dynamicInvoke     | Boolean  | Whether or not the contract will be performing dynamic invocations of other smart contracts                             |
| isPayable         | Boolean  | Whether or not the contract will be able to accept native assets                                                        |
| parameterList     | String   | The list of input argument types for the Main function on the contract. https://docs.neo.org/en-us/sc/Parameter.html    |
| returnType        | String   | The list of output returnType argument types. https://docs.neo.org/en-us/sc/Parameter.html                              |
| code              | String   | The hex of the compiled smart contract avm                                                                              |
| netowrkFee        | String   | The network fee to execute the transaction, in addition to the deploy fee which will be added automatically             |
| broadcastOverride | Boolean? | If this flag is set to True, the wallet provider will return the signed transaction rather than broadcasting to a node. |

### Success Response

In the case where the "broadcastOverride" input argument is not set, or set to false.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| nodeURL   | String | The node to which the transaction was submitted to                            |

<aside class="warning">
It is reccommended that the DAPP take appropriate levels of risk prevention when accepting transactions. The dapp can query the mempool of a known node to ensure that the transaction will indeed be broadcast on the network.
</aside>

In the case where the "broadcastOverride" input argument is set to True.

| Parameter | Type   | Description                                                                   |
|:--------- |:------ |:----------------------------------------------------------------------------- |
| txid      | String | The transaction id of the send request which can be queried on the blockchain |
| signedTx  | String | The serialized signed transaction                                             |

### Error Response
| Parameter   | Type    | Description                                   |
|:----------- |:------- |:--------------------------------------------- |
| type        | String  | The type of error which has occurred          |
| description | String  | A description of the error which has occurred |
| data        | String? | Any raw data associated with the error        |
