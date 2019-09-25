import React from 'react';
import './App.css';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import WalletView from './Components/WalletView'

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import walletIcon from './imgs/wallet.png'
import sendIcon from './imgs/mail.png'
import keyIcon from './imgs/key.png'
import settingsIcon from './imgs/settings.png'

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MyWallet from './views/MyWallet';
import SendWallet from './views/SendWallet';
import SecurityWallet from './views/SecurityWallet';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 110,
  },
  header: {
    margin: '1rem'
  }
}));

function App() {

  const classes = useStyles();
  const [network, setNetwork] = React.useState('TestNet');
  const [tabSelected, setTabSelected] = React.useState(2);
  const [isMobile, setIsMobile] = React.useState(document.documentElement.clientWidth < 576);

  function changeStyles(w, h) {
    w < 576 ? setIsMobile(true) : setIsMobile(false)
  }

  function getWindowSize() {
    // Get width and height of the window excluding scrollbars
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    changeStyles(w, h)
  }

  window.addEventListener("resize", getWindowSize);

  function handleChange(event) {
    setNetwork(event.target.value);
  }

  return (
    <div>
      <div className="gradientBg"></div>
      <Grid container direction="column" justify="center" alignItems="center" className="centerPaper">
        <Grid item style={{ width: '75%' }}>
          <Paper style={{ padding: '1rem', marginBottom: '5rem' }}>
            <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between" alignItems="center">
              <Grid item>
                <span style={{ fontWeight: 'bold', marginBottom: isMobile ? '1rem' : '0rem', display: isMobile ? 'block' : 'inline' }}>
                  {
                    tabSelected == 0 ? "WALLET" :
                      tabSelected == 1 ? "SEND ASSETS" :
                        tabSelected == 2 ? "SECURITY & SETTINGS" : "SETTINGS"
                  }
                </span>
              </Grid>
              <Grid item>
                <Grid container direction="row"
                  justify="flex-end"
                  alignItems="center"
                  spacing={1}>
                  <Grid item>
                    <span style={{ fontWeight: 'bold' }}>
                      Network:
                    </span>
                  </Grid>
                  <Grid item>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <Select
                        value={network}
                        onChange={handleChange}
                        style={{ height: '2rem' }}
                      >
                        <MenuItem value='MainNet'>MainNet</MenuItem>
                        <MenuItem value='TestNet'>TestNet</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider style={{ margin: '1rem 0' }} />
            <Grid container direction="row" justify={isMobile ? 'center' : "flex-start"} alignItems="flex-start" spacing={3}>
              <Grid item>
                <Grid container direction="column" justify="center" alignItems="center">
                  <Grid item>
                    <WalletView icon={walletIcon} onClick={() => setTabSelected(0)} />
                  </Grid>
                  <Grid item>
                    <span style={{ fontWeight: tabSelected == 0 ? 'bold' : 'normal' }}>My wallet</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction="column" justify="center" alignItems="center">
                  <Grid item>
                    <WalletView icon={sendIcon} onClick={() => setTabSelected(1)} />
                  </Grid>
                  <Grid item>
                    <span style={{ fontWeight: tabSelected == 1 ? 'bold' : 'normal' }}>Send</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction="column" justify="center" alignItems="center">
                  <Grid item>
                    <WalletView icon={keyIcon} onClick={() => setTabSelected(2)} />
                  </Grid>
                  <Grid item>
                    <span style={{ fontWeight: tabSelected == 2 ? 'bold' : 'normal' }}>{'Security & settings'}</span>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item>
                <Grid container direction="column" justify="center" alignItems="center">
                  <Grid item>
                    <WalletView icon={settingsIcon} onClick={() => setTabSelected(3)} />
                  </Grid>
                  <Grid item>
                    <span style={{ fontWeight: tabSelected == 3 ? 'bold' : 'normal' }}>Settings</span>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={3}>
              <Grid item style={{ padding: '21px', width: '100%' }}>
                {
                  tabSelected == 0 ?
                    <MyWallet network={network} />
                    : tabSelected == 1 ?
                      <SendWallet network={network} />
                      : tabSelected == 2 ?
                        <SecurityWallet isMobile={isMobile} />
                        : null
                }
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div >
  );
}

export default App;
