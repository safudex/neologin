import React from 'react';
import Button from '@material-ui/core/Button';

function RequestAcceptance({ message, resolve, reject, closeWidget }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        <div>
          <Button variant="contained" color="primary" onClick={() => { resolve(); closeWidget() }}>
            Accept
          </Button>
          <Button variant="contained" color="secondary" onClick={() => { reject(); closeWidget() }}>
            Reject
      </Button>
        </div>
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

export default RequestAcceptance;