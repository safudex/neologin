import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withTranslation } from 'react-i18next';
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
    const { t } = this.props
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
            <p style={{ fontSize: '0.85em' }}>{t("info_invoke")}</p>
          </Grid>
          <Grid item xs>
            <span style={{ fontSize: '0.75em' }}>{this.props.invokeArgs.scriptHash}</span>
          </Grid>
          <Grid item xs style={{ width: '100%' }}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-start"
              style={{ padding: '1em' }}
            >
              <div>
                <span style={{ fontSize: '0.85em', display: 'block' }}>Network: {this.props.network}</span>
                {
                  (this.props.invokeArgs.attachedAssets !== undefined) ?
                    ["NEO", "GAS"].map((asset, i) =>
                      (this.props.invokeArgs.attachedAssets[asset]) ?
                        <span key={i} style={{ fontSize: '0.85em', display: 'block' }}>Amount: {this.props.invokeArgs.attachedAssets[asset]} {asset}</span>
                        : null
                    )
                    : null

                }
                <span style={{ fontSize: '0.85em', display: 'block' }}>Fee: {this.props.invokeArgs.fee || 0} GAS</span>
                {
                  this.props.goodEstimation ?
                    <span style={{ fontSize: '0.85em', display: 'block', color: '#B33A3A' }}>{t("warning_invoke")}</span>
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
                  {t("button_accept")}
                </button>
              </Grid>
              <Grid item xs>
                <button className='buttonContinue buttonReject' onClick={() => {
                  this.props.reject()
                  this.unmountComponent()
                }}>
                  {t("button_reject")}
                </button>
              </Grid>
            </Grid>
          </Grid>
        </Grid >
      </div >
    );
  }
}

export default withTranslation()(RequestAcceptanceInvoke);
