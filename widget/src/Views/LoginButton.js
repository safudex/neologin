import React from 'react';
import Grid from '@material-ui/core/Grid';
import { server } from '../config';

import './LoginButton.css'

import logo from '../logo.svg';
import logo2 from '../logo2.png';

function LoginButton({ closeWidget }) {
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
        style={{ height: '100%', padding: '1em' }}
      >
        <Grid item xs>
          <img src={logo} width='65px' />
        </Grid>
        <Grid item xs>
          <p style={{ fontSize: '0.85em' }}>To continue, log in to NeoLogin, your secure gateway to the blockchain.</p>
        </Grid>
        <Grid item xs style={{ width: '100%' }}>
          <button className='buttonContinue' onClick={() => {
            window.open(server.includes("localhost") ? server : server + "/login/", 'NeoLogin - Login', 'width=400,height=620')
          }}>
            Continue
          </button>
        </Grid>
      </Grid >
    </div>
  );
}

{/* <Button variant="contained" color="primary" fullWidth onClick={() => {
				  window.open(server.includes("localhost")? server : server+"/login/", 'NeoLogin - Login', 'width=400,height=620')
              }}>hhh</Button> */}

export default LoginButton;
