import React from 'react';
import Grid from '@material-ui/core/Grid';
import { server } from '../config';

import './styles.css'

import logo from '../logobox.png';
import Brand from './Brand'

function LoginButton({ closeWidget }) {
  return (
    <div>
      <Brand closeWidget={closeWidget}/>
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
            window.open(server.includes("localhost") ? server : server + "/login/", 'NeoLogin - Login', 'width=400,height=660')
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
