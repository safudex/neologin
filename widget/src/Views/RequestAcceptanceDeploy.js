import React from 'react';
import Grid from '@material-ui/core/Grid';
import logo from '../logo.svg';
import logo2 from '../logo2.png';

import Brand from './Brand'
import ReactDOM from 'react-dom'

import './styles.css'

class RequestAcceptanceDeploy extends React.Component {

  unmountComponent = () => {
    ReactDOM.unmountComponentAtNode(window.document.getElementById(this.props.contid))
  }

  componentWillUnmount() {
    window.document.getElementById(this.props.contid).remove();
    this.props.closeRequest()
    this.props.closeWidget()
  }

  render() {
    console.log(this.props.invokeArgs)
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
          <Grid item xs style={{textAlign:'center'}}>
            <p style={{ fontSize: '0.85em' }}>This dApp has requested permission to deploy a smart contract.</p>
          </Grid>
          {/* <Grid item xs>
            <span style={{ fontWeight: 'bold', fontSize: '0.85em' }}>{this.props.invokeArgs.scriptHash}</span>
          </Grid> */}
          <Grid item xs style={{ width: '100%' }}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-start"
              style={{ padding: '1em' }}
            >
              <div>
                <span style={{ fontSize: '0.85em', display: 'block' }}>Network: {this.props.deployArgs.network}</span>
                <span style={{ fontSize: '0.85em', display: 'block' }}>System cost: {this.props.sysGasFee} GAS</span>
                <span style={{ fontSize: '0.85em', display: 'block' }}>Fee: {this.props.deployArgs.networkFee} GAS</span>
              </div>
            </Grid>
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
                <button className='buttonContinue buttonAccept' onClick={() => {
                  this.props.resolve('resolveincomponent')
                  this.unmountComponent()
                }}>
                  Accept
                </button>
              </Grid>
              <Grid item xs>
                <button className='buttonContinue buttonReject' onClick={() => {
                  this.props.reject()
                  this.unmountComponent()
                }}>
                  Reject
            </button>
              </Grid>
            </Grid>
          </Grid>
        </Grid >
      </div >
    );
  }
}

export default RequestAcceptanceDeploy;