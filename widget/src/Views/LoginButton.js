import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { server } from '../config';
import ReactDOM from 'react-dom'
import { withTranslation } from 'react-i18next';
import './styles.css'

import Brand from './Brand'

function LoginButton({ closeWidget, t, i18n }) {
  return (
    <div>
      <Brand closeWidget={() => {
        closeWidget()
        ReactDOM.unmountComponentAtNode(window.document.getElementById('content'))
      }} />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ height: '100%', padding: '1em' }}
      >
        <Grid item xs>
          <p style={{ fontSize: '0.85em' }}>{t("info_login")}</p>
        </Grid>
        <Grid item xs style={{ width: '100%' }}>
          <button className='buttonContinue' onClick={() => {
            window.open(server.includes("localhost") ? server : server + "/login/", 'NeoLogin - Login', 'width=400,height=660')
          }}>
            {t("button_continue")}
          </button>
        </Grid>
        <Grid item xs>
          <span className="cursorOnHover" variant="body2" onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}>
            <p style={{ color: '#2e5aac', marginBottom: '0' }}>{t("inverse:link_language")}</p>
          </span>
        </Grid>
      </Grid >
    </div>
  );
}

export default withTranslation()(LoginButton);
