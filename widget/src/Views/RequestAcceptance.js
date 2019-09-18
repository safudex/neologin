import React from 'react';
import Grid from '@material-ui/core/Grid';
import logo from '../logo.svg';
import logo2 from '../logo2.png';

import Brand from './Brand'
import ReactDOM from 'react-dom'

import './styles.css'

//({ transaction, message, resolve, reject, closeWidget }) {
class RequestAcceptance extends React.Component {

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
        <Brand closeWidget={this.unmountComponent} reqNumber={parseInt(this.props.contid.split('-')[1]) + 1} />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: '100%', padding: '1em' }}
        >
          {
            this.props.transaction ?
              <Grid item xs>
                <img src={logo} height='65px' />
              </Grid> : null
          }

          <Grid item xs>
            <p style={{ fontSize: '0.85em' }}>{this.props.transaction ? 'Do you accept that transaction?' : this.props.message}</p>
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

export default RequestAcceptance;