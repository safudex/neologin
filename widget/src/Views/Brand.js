import React from 'react';
import Grid from '@material-ui/core/Grid';

import './styles.css'

function Brand({ closeWidget, reqNumber }) {
  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ textAlign: 'center', padding: '8px 0', background: '#fff' }}
      >
        <Grid item xs={1}>
          <Grid container direction="row" justify="flex-end" alignItems="center">
            <Grid item>
              <span className='pendingRequestBadge'>{reqNumber === 1 ? null : reqNumber}</span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <span className="brand" onClick={() => window.open('https://neologin.io')}>NEO LOGIN</span>
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
    </div>
  );
}

export default Brand;
