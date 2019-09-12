import React from 'react';
import Grid from '@material-ui/core/Grid';
import { server } from '../config';

import Button from '@material-ui/core/Button';

function LoginButton({ closeWidget }) {
  return (
    <div >
      <Grid container spacing={2} direction={"column"} style={{ width: '100%', height: '100%' }} justify="center" alignItems="center">
        <Grid item xs={12}>
          <span>Powered by Headjack</span>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction={"column"} style={{ height: '100%' }} justify="space-between" alignItems="center">
            <Grid item xs={12}>
              <span>This is a test App</span>
            </Grid>
            <Grid item xs={12}>
              <span>
                To continue on TestApp, log in to Headjack, your secure gateway to the blockchain.
            </span>
            </Grid>
            <Grid item xs={12} style={{ width: '100%', height: '100%' }}>
              <Button variant="contained" color="primary" fullWidth onClick={() => {
                window.open(server, 'Headjack - Login', 'width=400,height=620')
              }}>
                Continue
             </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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

    </div>
  );
}

export default LoginButton;
