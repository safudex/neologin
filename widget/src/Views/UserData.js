import React from 'react';
import logo from '../logobox.png';
import Grid from '@material-ui/core/Grid';
import Brand from './Brand'
import './styles.css'

function UserData({ account, closeWidget }) {
  return (
    <div>
      <Brand closeWidget={closeWidget}/>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ padding: '1em', textAlign:'center' }}
      >
        {/* <Grid item xs>
          <img src={logo} width='65px' />
        </Grid> */}
        <Grid item xs>
          <p style={{ fontSize: '0.85em' }}>Your address is { account._address }</p>
        </Grid>
      </Grid >
    </div>
  );
}

export default UserData;