import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Brand from './Brand'
import ReactDOM from 'react-dom'
import { withTranslation } from 'react-i18next';
import './styles.css'

const rejectError = {
  type: 'CONNECTION_DENIED',
  description: 'The user rejected the request to connect with your dApp.'
}

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
    const { t, i18n } = this.props
    return (
      <div>
        <Brand closeWidget={() => {
          this.props.reject(rejectError); this.unmountComponent();
        }} reqNumber={parseInt(this.props.contid.split('-')[1]) + 1} />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: '100%', padding: '1em' }}
        >
          <Grid item xs>
            <p style={{ fontSize: '0.85em' }}>{t("info_requestAcceptance")}</p>
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
                  this.props.reject(rejectError)
                  this.unmountComponent()
                }}>
                  {t("button_reject")}
                </button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Link href="#" variant="body2" onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}>
              <p style={{ color: '#2e5aac', marginBottom: '0' }}>{t("inverse:link_language")}</p>
            </Link>
          </Grid>
        </Grid >
      </div >
    );
  }
}

export default withTranslation()(RequestAcceptance)
