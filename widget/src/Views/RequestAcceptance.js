import React from 'react';
import Grid from '@material-ui/core/Grid';
import logo from '../logo.svg';
import logo2 from '../logo2.png';

import Brand from './Brand'

import './styles.css'

function RequestAcceptance({ message, resolve, reject, closeWidget }) {
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
        {/* <Grid item xs>
          <img src={logo} width='65px' />
        </Grid> */}
        <Grid item xs>
          <p style={{ fontSize: '0.85em' }}>Do you accept this transacction?</p>
        </Grid>
        <Grid item xs style={{ width: '100%' }}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs>
              <button className='buttonContinue buttonAccept' onClick={() => { resolve(); closeWidget() }}>
                Accept
            </button>
            </Grid>
            <Grid item xs>
              <button className='buttonContinue buttonReject' onClick={() => { reject(); closeWidget() }}>
                Reject
            </button>
            </Grid>
          </Grid>
        </Grid>
      </Grid >
    </div>
  );
}

{/* <Button variant="contained" color="primary" onClick={() => { resolve(); closeWidget() }}>
  Accept
          </Button>
  <Button variant="contained" color="secondary" onClick={() => { reject(); closeWidget() }}>
    Reject
      </Button> */}

export default RequestAcceptance;