import React from 'react';
import Grid from '@material-ui/core/Grid';
import logo from '../logo.svg';
import logo2 from '../logo2.png';

import Brand from './Brand'
import ReactDOM from 'react-dom'

import './styles.css'

class InsufficientFunds extends React.Component {

  unmountComponent = () => {
    ReactDOM.unmountComponentAtNode(window.document.getElementById(this.props.contid))
  }

  componentWillUnmount() {
    window.document.getElementById(this.props.contid).remove();
    this.props.closeRequest()
    this.props.closeWidget()
  }

  render() {
    return (
      <div>
        <Brand closeWidget={() => { this.props.reject(); this.unmountComponent(); }} reqNumber={parseInt(this.props.contid.split('-')[1]) + 1} />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: '100%', padding: '1em' }}
        >
          <Grid item xs>
            <img style={{ height: '150px' }} src={"https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + this.props.address + "&chld=L|0"} />
          </Grid>
          <Grid item xs>
            <span style={{ fontSize: '0.85em' }}>{this.props.address}</span>
          </Grid>
          <Grid item xs>
            <p style={{ fontSize: '0.85em' }}>You have not enough funds. Scan the above QR code to get your address.</p>
          </Grid>
        </Grid >
      </div >
    );
  }
}

export default InsufficientFunds;
