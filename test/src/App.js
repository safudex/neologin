import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import neologin from './provider.js'

window.neologin = neologin;

function App() {
  const [result, setResult] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            <button onClick={() => neologin.getProvider()
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
              .catch(({ type, description, data }) => {
                switch (type) {
                  case "NO_PROVIDER":
                    console.log('No provider available.');
                    break;
                  case "CONNECTION_DENIED":
                    console.log('The user rejected the request to connect with your dApp.');
                    break;
                }
              })}>getProvider</button>
          </div>
          <div>
            <button onClick={() => neologin.getNetworks()
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
              .catch(({ type, description, data }) => {
                switch (type) {
                  case "NO_PROVIDER":
                    console.log('No provider available.');
                    break;
                  case "CONNECTION_DENIED":
                    console.log('The user rejected the request to connect with your dApp');
                    break;
                }
              })}>getNetworks</button>
          </div>
          <div>
            <button onClick={() => neologin.getAccount()
              .then((account) => {
                const {
                  address,
                  label,
                } = account;

                console.log('Account address: ' + address);
                console.log('Account label: ' + label);
              })
              .catch(({ type, description, data }) => {
                switch (type) {
                  case "NO_PROVIDER":
                    console.log('No provider available.');
                    break;
                  case "CONNECTION_DENIED":
                    console.log('The user rejected the request to connect with your dApp');
                    break;
                }
              })}>getAccount</button>
          </div>
          <div>
            <button onClick={() => neologin.getNetworks()
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
              .catch(({ type, description, data }) => {
                switch (type) {
                  case "NO_PROVIDER":
                    console.log('No provider available.');
                    break;
                  case "CONNECTION_DENIED":
                    console.log('The user rejected the request to connect with your dApp');
                    break;
                }
              })}>getNetworks</button>
          </div>
          <div>
            <button onClick={() => neologin.getPublicKey()
              .then((publicKeyData) => {
                const {
                  address,
                  publicKey,
                } = publicKeyData;

                console.log('Account address: ' + address);
                console.log('Account public key: ' + publicKey);
              })
              .catch(({ type, description, data }) => {
                switch (type) {
                  case "NO_PROVIDER":
                    console.log('No provider available.');
                    break;
                  case "CONNECTION_DENIED":
                    console.log('The user rejected the request to connect with your dApp');
                    break;
                }
              })
            }>getPublicKey</button>
          </div>
          <div>
            <button onClick={() => neologin.getBalance({
              params: {
                address: 'ATpKTfUCoBm7PDQ38CrtJ7mDEa34gra4uf',
                assets: ['GAS']
              },
              network: 'MainNet',
            })
              .then((results) => {
                console.log(results)
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
              .catch(({ type, description, data }) => {
                switch (type) {
                  case "NO_PROVIDER":
                    console.log('No provider available.');
                    break;
                  case "CONNECTION_DENIED":
                    console.log('The user rejected the request to connect with your dApp');
                    break;
                }
              })
            }>getBalance</button>
          </div>
          <div>
            <button onClick={() => neologin.getStorage({
              scriptHash: 'b3a14d99a3fb6646c78bf2f4e2f25a7964d2956a',
              key: '74657374',
              network: 'TestNet'
            })
              .then(res => {
                const value = res.result;
                console.log('Storage value: ' + value);
              })
              .catch(({ type, description, data }) => {
                switch (type) {
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
              })
            }>getStorage</button>
        </div>
        <div>
          <button onClick={() => neologin.invokeRead({
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
            .catch(({ type, description, data }) => {
              switch (type) {
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
            })
          }>invokeRead</button>
        </div>
        <div>
          <button onClick={() => neologin.verifyMessage({
            message: '058b9e03e7154e4db1e489c99256b7faHello World!',
            data: '0147fb89d0999e9d8a90edacfa26152fe695ec8b3770dcad522048297ab903822e12472364e254ff2e088fc3ebb641cc24722c563ff679bb1d1623d08bd5863d0d',
            publicKey: '0241392007396d6ef96159f047967c5a61f1af0871ecf9dc82afbedb68afbb949a',
          })
            .then(({ result }) => {
              console.log('Signature data matches provided message and public key: ' + result);
            })
            .catch(({ type, description, data }) => {
              switch (type) {
                case "NO_PROVIDER":
                  console.log('No provider available.');
                  break;
                case "CONNECTION_DENIED":
                  console.log('The user rejected the request to connect with your dApp');
                  break;
              }
            })
          }>verifyMessage</button>
        </div>
        <div>
          <button onClick={() => neologin.getBlock({
            blockHeight: 2619690,
            network: 'TestNet'
          })
            .then((result) => {
              console.log('Block information: ' + JSON.stringify(result));
            })
            .catch(({ type, description, data }) => {
              switch (type) {
                case "NO_PROVIDER":
                  console.log('No provider available.');
                  break;
                case "RPC_ERROR":
                  console.log('There was an error when broadcasting this transaction to the network.');
                  break;
              }
            })
          }>getBlock</button>
        </div>
        <div>
          <button onClick={() => neologin.getBlockHeight({
            network: 'TestNet'
          })
            .then((res) => {
              console.log('Block height: ' + res.result);
            })
            .catch(({ type, description, data }) => {
              switch (type) {
                case "NO_PROVIDER":
                  console.log('No provider available.');
                  break;
                case "RPC_ERROR":
                  console.log('There was an error when broadcasting this transaction to the network.');
                  break;
              }
            })
          }>getBlockHeight</button>
        </div>
        <div>
          <button onClick={() => neologin.getTransaction({
            txid: '7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2',
            network: 'TestNet'
          })
            .then((result) => {
              console.log('Transaction details: ' + JSON.stringify(result));
            })
            .catch(({ type, description, data }) => {
              switch (type) {
                case "NO_PROVIDER":
                  console.log('No provider available.');
                  break;
                case "RPC_ERROR":
                  console.log('There was an error when broadcasting this transaction to the network.');
                  break;
              }
            })
          }>getTransaction</button>
        </div>
        <div>
          <button onClick={() => neologin.getApplicationLog({
            txid: '7e049fd7c253dabf38e4156df30c78b30d49f307196aa89b99a47d2330789bf2',
            network: 'TestNet'
          })
            .then((result) => {
              console.log('Application log of transaction execution: ' + JSON.stringify(result));
            })
            .catch(({ type, description, data }) => {
              switch (type) {
                case "NO_PROVIDER":
                  console.log('No provider available.');
                  break;
                case "RPC_ERROR":
                  console.log('There was an error when broadcasting this transaction to the network.');
                  break;
              }
            })
          }>getApplicationLog</button>
        </div>
        <div>
          <button onClick={() => neologin.send({
            fromAddress: 'ATpKTfUCoBm7PDQ38CrtJ7mDEa34gra4uf',
            toAddress: 'AZ3dTfNQzjwsqcDTbozu6F1HwHedSxZ5Ry',
            asset: 'GAS',
            amount: '0.0001',
            remark: 'Hash puppy clothing purchase. Invoice#abc123',
            fee: '0.0001',
            network: 'TestNet',
            broadcastOverride: false,
          })
            .then(({ txid, nodeUrl }) => {
              console.log('Send transaction success!');
              console.log('Transaction ID: ' + txid);
              console.log('RPC node URL: ' + nodeUrl);
            })
            .catch(({ type, description, data }) => {
              switch (type) {
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
                  console.log('The user has canceled this transaction.', description);
                  break;
                case "INSUFFICIENT_FUNDS":
                  console.log('The user has insufficient funds to execute this transaction.');
                  break;
              }
            })
          }>send</button>
        </div>
        <div>
          <button onClick={() =>
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
                NEO: '1',
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
              .then(({ txid, nodeUrl }) => {
                console.log('Invoke transaction success!');
                console.log('Transaction ID: ' + txid);
                console.log('RPC node URL: ' + nodeUrl);
              })
              .catch(({ type, description, data }) => {
                console.log(type)
                switch (type) {
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
              })
          }>invoke</button>
        </div>
        <div>
          <button onClick={() =>
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
              .catch(({ type, description, data }) => {
                switch (type) {
                  case "UNKNOWN_ERROR":
                    console.log(description);
                    break;
                  case "CANCELED":
                    console.log('The user has canceled this transaction.');
                    break;
                }
              })
          }>signMessage</button>
        </div>
        <div>
          <button onClick={() =>
            neologin.deploy({
              network: 'TestNet',
              name: 'Hello world!',
              version: 'v0.0.1',
              author: 'John Smith',
              email: 'neo@neologin.io',
              description: 'My first contract.',
              needsStorage: false,
              dynamicInvoke: false,
              isPayable: false,
              parameterList: '0710',
              returnType: '05',
              code: '00c56b6114c7a944c6e2c7522da8e60474932cfd4287f4e01b6168184e656f2e52756e74696d652e436865636b5769746e65737364320051c576000f4f574e45522069732063616c6c6572c46168124e656f2e52756e74696d652e4e6f7469667951616c756600616c7566',
              networkFee: '0.001',
            })
              .then(({ txid, nodeUrl }) => {
                console.log('Deploy transaction success!');
                console.log('Transaction ID: ' + txid);
                console.log('RPC node URL: ' + nodeUrl);
              })
              .catch(({ type, description, data }) => {
                console.log(type, description, data)
                switch (type) {
                  case "UNKNOWN_ERROR":
                    console.log(description);
                    break;
                }
              })
          }> deploy</button>
        </div>
        </div>
      <div>
        <p>{result}</p>
      </div>
      </header>
    </div >
  );
}

export default App;
