import React, { useEffect } from 'react';
import './App.css';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import QRCode from 'qrcode'
import SvgIcon from '@material-ui/core/SvgIcon';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AssetRow from './Components/AssetRow'
import Menu from '@material-ui/core/Menu';
import neologin from 'neologin'
import { withTranslation } from 'react-i18next';

import { server } from './config';

function drawQR(address) {
  let canvas = document.getElementById('addressQR')
  QRCode.toCanvas(canvas, address, (error) => {
    if (error) {
      console.error(error);
      alert(error);
    }
  })
}

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 110,
  },
  header: {
    margin: '1rem'
  }
}));

function App({ t, i18n }) {

  const classes = useStyles();
  const [network, setNetwork] = React.useState('TestNet');
  const [address, setAddress] = React.useState('');
  const [mainBalance, setBalance] = React.useState([]);
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
    getBalance(address, event.target.value);
    neologin.removeEventListener(neologin.Constants.EventName.BLOCK_HEIGHT_CHANGED);
    neologin.addEventListener(neologin.Constants.EventName.BLOCK_HEIGHT_CHANGED, data => getBalance(address, event.target.value));
  }

  useEffect(() => {
    neologin.getAccount()
      .then(({ address }) => {
        drawQR(address)
        setAddress(address)
        getBalance(address, network)
        neologin.addEventListener(neologin.Constants.EventName.BLOCK_HEIGHT_CHANGED, data => getBalance(address, network));
      })
      .catch(({ type, description, data }) => {
        setAddress(type)
        switch (type) {
          case "NO_PROVIDER":
            console.log('No provider available.');
            break;
          case "CONNECTION_DENIED":
            console.log('The user rejected the request to connect with your dApp');
            break;
          default:
            break
        }
      })
  }, [])

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function getBalance(address, network) {
    neologin.getBalance({
      params: {
        address: address
      },
      network: network,
    })
      .then((results) => {
        Object.keys(results).forEach(address => {
          const balances = results[address];
          setBalance(balances)
        });
      })
      .catch(({ type, description, data }) => {
        switch (type) {
          case "NO_PROVIDER":
            console.log('No provider available.');
            break;
          case "CONNECTION_DENIED":
            console.log('The user rejected the request to connect with your dApp');
            break;
          default:
            break;
        }
      });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#21242c', color: 'white', paddingBottom: '5rem' }}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item style={{
          width: '100%',
          fontSize: '20px',
          backgroundColor: '#2d2d37',
          color: '#fff',
          padding: '1rem',
        }}>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs>
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  value={network}
                  onChange={handleChange}
                  style={{
                    height: '2rem',
                    background: 'white',
                    borderRadius: '4px'
                  }}
                >
                  <MenuItem value='MainNet'>{t("mainNet")}</MenuItem>
                  <MenuItem value='TestNet'>{t("testNet")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs style={{ textAlign: 'center' }}>
              <span>{isMobile ? '' : t("tittle")}</span>
            </Grid>
            <Grid item xs style={{ textAlign: 'end' }}>
              <FormControl variant="outlined" className={classes.formControl} style={{ alignItems: 'flex-end' }}>
                <SvgIcon aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{ cursor: 'pointer' }}>
                  <path d="M9 5.5c.83 0 1.5-.67 1.5-1.5S9.83 2.5 9 2.5 7.5 3.17 7.5 4 8.17 5.5 9 5.5zm0 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S9.83 7.5 9 7.5zm0 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                </SvgIcon>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {
                    handleClose()
                    window.open(server.includes("localhost") ? server + "?settings=true" : server + "?settings=true/", 'NeoLogin - ' + t('login'), 'width=400,height=660')
                  }}>{t("menu_settings")}</MenuItem>
                  <MenuItem onClick={() => {
                    handleClose()
                    window.open("https://github.com/safudex/neologin/issues")
                  }}>
                    {t("menu_issues")}
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleClose()
                    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
                  }}>
                    {t("inverse:menu_language")}
                  </MenuItem>
                </Menu>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Grid container direction='column' justify="flex-start" alignItems="center">
            {
              isMobile ?
                <Grid item>
                  <h3>{t("tittle")}</h3>
                </Grid>
                : null
            }
            <Grid item style={{ margin: isMobile ? '1rem 0 1rem 0' : '3rem 0 1rem 0' }}>
              <canvas id="addressQR" />
            </Grid>
            <Grid item style={{ marginBottom: isMobile ? '1.5rem' : '3rem' }}>
              <span>{address}</span>
            </Grid>
            {
              mainBalance.length !== 0 ?
                mainBalance.map((balance, i) =>
                  <Grid item key={i} style={{ width: isMobile ? '90%' : '50%', margin: '0.3rem 0rem' }}>
                    <AssetRow isMobile={isMobile} symbol={balance.symbol} amount={balance.amount} address={address} network={network} getBalance={() => this.getBalance(address, network)} />
                  </Grid>
                )
                :
                address === '' ? null :
                  <Grid item style={{ margin: '0.3rem 0rem' }}>
                    <p>{t("info_noFunds")}</p>
                  </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    </div >
  );
}

export default withTranslation()(App)
