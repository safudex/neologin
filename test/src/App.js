import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import neologin from './conn.js'

function App() {
  const [result, setResult] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={() => neologin.getAccount()
            .then((account) => {
              setResult(account.address)
              console.log('Provider address: ' + account);
            }).catch((err) => setResult(JSON.stringify(err)))}>getAccount</button>

          <button onClick={() => neologin.getProvider()
            .then((provider) => {
              setResult(JSON.stringify(provider))
              console.log('Provider', provider);
            })}>getProvider</button>

          <button onClick={() => neologin.getNetworks()
            .then((networks) => {
              setResult(JSON.stringify(networks))
              console.log('Networks: ' + networks);
            })}>getNetworks</button>

          <button onClick={() => neologin.getPublicKey()
            .then((publicKey) => {
              setResult(JSON.stringify(publicKey))
              console.log('Public key: ' + publicKey);
            })}>getPublicKey</button>

          <button onClick={() => neologin.send().catch(err => setResult(JSON.stringify(err)))}>send</button>
        </div>
        <div>
          <p>{result}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
