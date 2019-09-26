import React from 'react';
import Grid from '@material-ui/core/Grid';
import logo from '../logo.svg';
import logo2 from '../logo2.png';

import Brand from './Brand'
import ReactDOM from 'react-dom'

import './styles.css'

class RequestAcceptanceInvoke extends React.Component {

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
          <Grid item xs>
            <p style={{ fontSize: '0.85em' }}>This dApp has requested permission to invoke the smart contract:</p>
          </Grid>
          <Grid item xs>
            <span style={{ fontWeight: 'bold', fontSize: '0.85em' }}>{this.props.invokeArgs.scriptHash}</span>
          </Grid>
          <Grid item xs style={{ width: '100%' }}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-start"
              style={{ padding: '1em' }}
            >{/* sendArgs.network + ' to ' + sendArgs.toAddress + ' with ' + (sendArgs.fee || 0) + ' GAS in fees. Accept?' */}
              <div>
                <span style={{ fontSize: '0.85em', display: 'block' }}>Network: {this.props.invokeArgs.network}</span>
                {
                  ["NEO", "GAS"].map((asset, i) =>
                    (this.props.invokeArgs.attachedAssets[asset]) ?
                      <span key={i} style={{ fontSize: '0.85em', display: 'block' }}>Amount: {this.props.invokeArgs.attachedAssets[asset]} {asset}</span>
                      : null
                  )
                }
                <span style={{ fontSize: '0.85em', display: 'block' }}>Fee: {this.props.invokeArgs.fee || 0} GAS</span>
                {
                  this.props.goodEstimation ?
                    <span style={{ fontSize: '0.85em', display: 'block', color: '#B33A3A' }}>The amount of GAS or NEO that will be spent on this transaction could not be estimated, please make sure that this is a legitimate transaction</span>
                    : null
                }
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

export default RequestAcceptanceInvoke;