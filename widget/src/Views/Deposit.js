import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './styles.css'

import { getFinalAmount, startConversion } from '../fiat/index'


class Deposit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      amountUSD: 0,
      crypto2buy: '',
      estimatedAmount: 0,
      ccView: false,
      totalFee: 0,
      asset: 'gas',
      amountAsset: 0,
      card_number: '',
      card_expiry: '',
      card_cvc: '',
      card_billingAddr: '',
      card_postalCode: '',
      card_fullName: ''
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value })
    if (name === 'amountUSD')
      getFinalAmount(value).then((res) => this.setState({ 'estimatedAmount': res }))
  }

  buy = () => {
    startConversion(this.props.addr, this.props.privkey, this.state.amountUSD).then((res) => {
      this.setState({ totalFee: res.totalFee, amountAsset: res.amountAsset, ccView: true })
    })
  }

  render() {
    return (
      this.state.ccView ?
        < div >
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ height: '100%', padding: '1em' }}
          >
            <Grid item><p style={{ fontWeight: 'bold', marginTop: '0' }}>Transaction info</p></Grid>
            <Grid item>
              <p style={{ fontSize: '0.5rem' }}>Asset:{this.state.asset}</p>
              <p style={{ fontSize: '0.5rem' }}>Destination address:{this.props.addr}</p>
              <p style={{ fontSize: '0.5rem' }}>Amount:{this.state.amountUSD}</p>
              <p style={{ fontSize: '0.5rem' }}>Fee:{this.state.totalFee}</p>
              <p style={{ fontSize: '0.5rem' }}>Total:{this.state.amountUSD + this.state.totalFee}</p>
              <p style={{ fontSize: '0.5rem' }}>{this.state.asset}: {this.state.amountAsset}</p>
            </Grid>
            <Grid item><p style={{ fontWeight: 'bold', marginTop: '0' }}>Payment info</p></Grid>
            <Grid item>
              <TextField
                id="standard-name"
                label="Card number"
                margin="normal"
                name="card_fullName"
                onChange={this.handleChange}
              />
              <TextField
                id="standard-name"
                label="Card number"
                margin="normal"
                name="card_number"
                onChange={this.handleChange}
              />
              <TextField
                id="standard-name"
                label="MM/YY"
                margin="normal"
                name="card_expiry"
                onChange={this.handleChange}
              />
              <TextField
                id="standard-name"
                label="CVC"
                margin="normal"
                name="card_cvc"
                onChange={this.handleChange}
              />
              <TextField
                id="standard-name"
                label="Billing address"
                margin="normal"
                name="card_billingAddr"
                onChange={this.handleChange}
              />
              <TextField
                id="standard-name"
                label="Postal code"
                margin="normal"
                name="card_postalCode"
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item>
              <button onClick={this.confirm}>Confirm</button>
            </Grid>
          </Grid >
        </div >
        :
        <div>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ height: '100%', padding: '1em' }}
          >
            <Grid item><p style={{ fontWeight: 'bold', marginTop: '0' }}>Deposit</p></Grid>
            <Grid item>
              <select name="asset" id="currency" onChange={this.handleChange}>
                <option value="GAS">GAS</option>
              </select>
            </Grid>
            <Grid item>
              <TextField
                id="standard-name"
                label="Amount"
                type="Number"
                margin="normal"
                name="amountUSD"
                value={this.state.amountUSD}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item>
              <p>{`Estimated amount ${this.state.estimatedAmount}`}</p>
            </Grid>
            <Grid item>
              <button onClick={this.buy}>Buy</button>
            </Grid>
          </Grid >
        </div >
    );
  }
}

export default Deposit;
