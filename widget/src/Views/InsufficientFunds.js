import React from 'react';
import ReactDOM from 'react-dom'

import Grid from '@material-ui/core/Grid';
import { withTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';

import Brand from './Brand'
import Deposit from './Deposit'

import './styles.css'

class InsufficientFunds extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wantsDeposit: false
    }
  }

  unmountComponent = () => {
    ReactDOM.unmountComponentAtNode(window.document.getElementById(this.props.contid))
  }

  componentWillUnmount() {
    window.document.getElementById(this.props.contid).remove();
    this.props.closeRequest()
    this.props.closeWidget()
  }


  render() {
    const { t } = this.props
    return (
      <>
        <Brand closeWidget={() => { this.props.reject(); this.unmountComponent(); }} reqNumber={parseInt(this.props.contid.split('-')[1]) + 1} />
        {
          !this.state.wantsDeposit ?
            < div >
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ height: '100%', padding: '1em' }}
              >
                <Grid item><p style={{ fontWeight: 'bold', marginTop: '0' }}>Insufficient funds</p></Grid>
                <Grid item xs>
                  <img alt="address" style={{ height: '150px' }} src={"https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + this.props.address + "&chld=L|0"} />
                </Grid>
                <Grid item xs>
                  <span style={{ fontSize: '0.85em' }}>{this.props.address}</span>
                </Grid>
                <Grid item xs>
					<p style={{ fontSize: '0.85em' }}>{t("info_notFounds")}</p>
                </Grid>
                <Grid item style={{ width: '100%', marginBottom: '15px' }}>
                  <Grid container direction='row' alignItems='center' justify='center' style={{ width: '100%', textAlign: 'center' }}>
                    <Grid item xs >
                      <Divider />
                    </Grid>
                    <Grid item >
                      <span style={{ margin: '0px 10px' }}>or</span>
                    </Grid>
                    <Grid item xs >
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs style={{ width: '100%' }}>
                  <button className='buttonContinue' onClick={() => this.setState({ wantsDeposit: true })}>
                    Deposit
            </button>
                </Grid>
              </Grid >
            </div >
            :
            <Deposit privkey={this.props.privkey} addr={this.props.address} />
        }
      </>
    );
  }
}

export default withTranslation()(InsufficientFunds);
