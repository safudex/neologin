import React, { useEffect } from 'react';
import './App.css';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import QRCode from 'qrcode'
import SvgIcon from '@material-ui/core/SvgIcon';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import neologin from 'neologin'

import AssetRow from './Components/AssetRow'

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

function App() {

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
    getBalance(address, event.target.value)
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
                  <MenuItem value='MainNet'>MainNet</MenuItem>
                  <MenuItem value='TestNet'>TestNet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs style={{ textAlign: 'center' }}>
              {isMobile ? '' : 'WALLET'}
            </Grid>
            <Grid item xs style={{ textAlign: 'end' }}>
              <SvgIcon style={{ cursor: 'pointer' }} onClick={() => window.open(server.includes("localhost") ? server + "?settings=true" : server + "?settings=true/", 'NeoLogin - Login', 'width=400,height=660')}>
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </SvgIcon>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Grid container direction='column' justify="flex-start" alignItems="center">
            {
              isMobile ?
                <Grid item>
                  <h3>WALLET</h3>
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
                    <p>You have nothing:)</p>
                  </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    </div >
  );
}

export default App;
