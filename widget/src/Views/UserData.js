import React from 'react';
import logo from '../logo.svg';
import logo2 from '../logo2.png';
import Grid from '@material-ui/core/Grid';

import './LoginButton.css'

function UserData({ account, closeWidget }) {
  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ textAlign: 'center', padding: '8px 0', background: '#fff' }}
      >
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <img src={logo2} style={{ height: '1em' }} />
        </Grid>
        <Grid item xs={1}>
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <span className='closeButton' onClick={() => closeWidget()}>
                ✖
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Grid >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ padding: '1em', textAlign:'center' }}
      >
        <Grid item xs>
          <img src={logo} width='65px' />
        </Grid>
        <Grid item xs>
          <p style={{ fontSize: '0.85em' }}>Your address is { account._address }</p>
        </Grid>
      </Grid >
    </div>
  );
}

export default UserData;