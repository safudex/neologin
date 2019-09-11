import React from 'react';

function UserData({ account, closeWidget }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Your address is</h1>
        <p style={{ color: 'black' }}>
          {account._address}
        </p>
        <button onClick={() => closeWidget()}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            marginTop: '2.5rem',
            marginRight: '1em',
            padding: '0 .25em',
            border: 'none',
            fontSize: '1.25em',
            color: '#777',
            transition: 'color .3s ease'
          }}>X</button>
      </header>
    </div>
  );
}

export default UserData;