# Events
Events are a way for the wallet to asynchronously with the DAPP when certain changes occur to the state of the wallet that might be relevant for the


## READY
On a READY event, the callback will fire with a single argument with information about the wallet provider. At any time a READY event listener is added, it will immidiately be called if the provider is already in a ready state. This provides a single flow for dapp developers since this listener should start any and all interactions with the dapi protocol.

| Parameter     | Type     | Description                                                      |
|:------------- |:-------- |:---------------------------------------------------------------- |
| name          | String   | The name of the wallet provider                                  |
| website       | String   | The website of the wallet provider                               |
| version       | String   | The version of the dAPI that the the wallet supports             |
| compatibility | String[] | A list of all applicable NEPs which the wallet provider supports |
| extra         | Object   | Provider specific attributes                                     |

##### extra
| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| theme     | string | UI theme of the provider |

## ACCOUNT_CHANGED
On a ACCOUNT_CHANGED event, the callback will fire with a single argument of the new account. This occurs when an account is already connected to the dapp, and the user has changed the connected account from the dapi provider side.

| Parameter | Type   | Description                                        |
|:--------- |:------ |:-------------------------------------------------- |
| address   | String | Address of the new account                         |
| label     | String | A label the users has set to identify their wallet |


## CONNECTED

On a CONNECTED event, the user has approved the connection of the dapp with one of their accounts. This will fire the first time any of one of the following methods are called from the dapp: `getAccount`, `invoke`, `send`.

| Parameter | Type   | Description                                        |
|:--------- |:------ |:-------------------------------------------------- |
| address   | String | Address of the new account                         |
| label     | String | A label the users has set to identify their wallet |


## DISCONNECTED

On a DISCONNECTED event, the account connected to the dapp via the dapi provider has been disconnected (logged out).


## NETWORK_CHANGED

On a NETWORK_CHANGED event, the user has changed the network their provider wallet is connected to. The event will return the updated network details.

| Parameter      | Type     | Description                                                        |
|:-------------- |:-------- |:------------------------------------------------------------------ |
| networks       | String[] | A list of all networks which this wallet provider allows access to |
| defaultNetwork | String   | Network the wallet is currently set to                             |

## BLOCK_HEIGHT_CHANGED

On a BLOCK_HEIGHT_CHANGED event, the block has advanced to the next.

| Parameter   | Type     | Description                                       |
|:----------- |:-------- |:------------------------------------------------- |
| network     | String   | Network of the block which changed                |
| blockHeight | Number   | Height of the new block                           |
| blockTime   | Number   | Timestamp of the new block                        |
| blockHash   | String   | Hash of the new block                             |
| tx          | String[] | List of transaction ids executed in the new block |

## TRANSACTION_CONFIRMED

On a TRANSACTION_CONFIRMED event, a previously broadcast transaction via the dapi has been confirmed by the blockchain.

| Parameter   | Type   | Description                                 |
|:----------- |:------ |:------------------------------------------- |
| txid        | String | Transaction id which was confirmed on chain |
| blockHeight | Number | Height of the new block                     |
| blockTime   | Number | Timestamp of the new block                  |

# Event Methods

## addEventListener

```typescript
o3dapi.NEO.addEventListener(o3dapi.NEO.Constants.EventName.ACCOUNT_CHANGED, data => {
  console.log(`Connected Account: ${data.address}`);
});
```

Method is used to add a callback method to be triggered on a specified event.

## removeEventListener

```typescript
o3dapi.NEO.removeEventListener(o3dapi.NEO.Constants.EventName.ACCOUNT_CHANGED);
```

Method is to remove existing callback event listeners.
