import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './styles.css'

import { getFinalAmount, startConversion, preFinishPurchase, finishPurchase } from '../fiat/index'
import ACSUI from '../carbon/ACSUI';


class Deposit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      crypto2buy: '',
      estimatedAmount: 0,
      totalFee: 0,
      asset: 'GAS',
      amountExpectedTo: 0,
      card_number: '',
      card_expiry: '',
      card_cvc: '',
      card_billingAddr: '',
      card_postalCode: '',
      card_fullName: '',
      ethAddress: 0,

      payinAddress: 0,
      contactId: '',
      ccView: false,
      totalFee: 0,
      amountGAS: 0,
      fiatChargeAmount: 0,
      calculatingPrice: 0,
      priceInUSD: 0,
      minAmountOK: true,
      ccViewIsLoading: false,
      cardError: false
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value })
    if (name === 'amountGAS') {
      let _calculatingPrice = this.state.calculatingPrice + 1
      this.setState({ calculatingPrice: _calculatingPrice }, () => {
        getFinalAmount(value, _calculatingPrice).then((res) => {
          if (res.calculatingPrice == this.state.calculatingPrice) {
            let fixedDecimalsTotal = parseFloat(res.fiatChargeAmount).toFixed(2)
            let fixedDecimalsFee = parseFloat(res.totalFee).toFixed(2)
            let fixedDecimalsAmount = parseFloat(res.priceInUSD).toFixed(2)
            console.log('fixedDecimalsAmount', fixedDecimalsTotal)
            if (this.state.calculatingPrice)
              this.setState({
                fiatChargeAmount: fixedDecimalsTotal,
                totalFee: fixedDecimalsFee,
                priceInUSD: fixedDecimalsAmount,
                calculatingPrice: 0,
                minAmountOK: res.minAmountOK,
                ethAmount2Buy: res.ethAmount2Buy
              }, () => console.log('console.log(this.state.fiatChargeAmount', this.state.fiatChargeAmount))
          }
        })
      })
    }
  }

  buy = () => {
    this.setState({ ccViewIsLoading: true })
    startConversion(this.props.addr, this.props.privkey, this.state.ethAmount2Buy).then((res) => {
      let amountExpectedToFixed = parseFloat(res.amountExpectedTo).toFixed(3)
      this.setState({
        amountExpectedTo: amountExpectedToFixed,
        ccView: true,
        contactId: res.contactId,
        ethAddress: res.address,
        payinAddress: res.payinAddress,
        ccViewIsLoading: false
      })
    })
  }

  confirm = () => {
    let creditCardBillingInfo = {
      card_billingPremise: this.state.card_billingPremise,
      card_billingStreet: this.state.card_billingStreet,
      card_billingPostal: this.state.card_billingPostal
    }
    let creditCard = {
      creditCardBillingInfo: creditCardBillingInfo,
      card_number: this.state.card_number,
      card_expiry: this.state.card_expiry,
      card_cvc: this.state.card_cvc,
      card_fullName: this.state.card_fullName
    }
    console.log(this.state.contactId, this.state.fiatChargeAmount, this.state.amountExpectedTo, this.state.ethAddress, this.state.payinAddress, this.state.amountExpectedTo, creditCard)
    preFinishPurchase(
      this.state.contactId,
      this.state.fiatChargeAmount,
      this.state.amountExpectedTo,
      this.state.ethAddress,
      this.state.payinAddress,
      creditCard
    ).then((response) => {
      this.setState({
        activateACS: true,
        acsurl: response.acsurl,
        pareq: response.pareq,
        termurl: response.termurl,
        md: response.md
      })
    }).catch(() =>
      this.setState({ cardError: true }))
  }

  render() {
    return (
      this.state.activateACS ? <ACSUI acsurl={this.state.acsurl} pareq={this.state.pareq} termurl={this.state.termurl} md={this.state.md} /> :
        this.state.ccViewIsLoading ?
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ height: '100%', padding: '1em' }}
          >
            <Grid item>
              <p>Creating transaction...</p>
            </Grid>
          </Grid>
          :
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
                <Grid item style={{ padding: '1rem', background: 'whitesmoke', width: "100%", marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.75rem' }}>Asset: {this.state.asset}</p>
                  <p style={{ fontSize: '0.75rem' }}>Destination address: <span style={{ fontSize: '0.5rem', fontWeight: 'bold' }}>{this.props.addr}</span></p>
                  <p style={{ fontSize: '0.75rem' }}>Amount requested: {this.state.amountGAS} {this.state.asset}</p>
                  <p style={{ fontSize: '0.75rem' }}>Price: {this.state.priceInUSD}$</p>
                  <p style={{ fontSize: '0.75rem' }}>Fee: {this.state.totalFee}$</p>
                  <p style={{ fontSize: '0.75rem' }}>Total to pay: {this.state.fiatChargeAmount}$</p>
                  <p style={{ fontSize: '0.75rem' }}>Expected to receive: {this.state.amountExpectedTo} {this.state.asset}</p>
                </Grid>
                <Grid item><p style={{ fontWeight: 'bold', marginTop: '0' }}>Payment info</p></Grid>
                <Grid item>
                  <input
                    placeholder="Full name"
                    id="standard-name"
                    label="Full name"
                    margin="normal"
                    name="card_fullName"
                    onChange={this.handleChange}
                  />
                  <input
                    placeholder="Card number"
                    id="standard-name"
                    label="Card number"
                    margin="normal"
                    name="card_number"
                    onChange={this.handleChange}
                  />
                  <input
                    placeholder="MM/YY"
                    id="standard-name"
                    label="MM/YY"
                    margin="normal"
                    name="card_expiry"
                    onChange={this.handleChange}
                  />
                  <input
                    placeholder="CVC"
                    id="standard-name"
                    label="CVC"
                    margin="normal"
                    name="card_cvc"
                    onChange={this.handleChange}
                  />
                  <input
                    placeholder="Billing street"
                    id="standard-name"
                    label="Street"
                    margin="normal"
                    name="card_billingStreet"
                    onChange={this.handleChange}
                  />
                  <input
                    placeholder="Billing premise"
                    id="standard-name"
                    label="Premise"
                    margin="normal"
                    name="card_billingPremise"
                    onChange={this.handleChange}
                  />
                  <input
                    placeholder="Billing postal"
                    id="standard-name"
                    label="Postal code"
                    margin="normal"
                    name="card_billingPostal"
                    onChange={this.handleChange}
                  />
                </Grid>
                {
                  this.state.cardError ?
                    <Grid item>
                      <p style={{ color: 'darkred', fontSize: '0.75rem' }}>Something went wrong:/ Try with another credit card.</p>
                    </Grid>
                    : null
                }
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
                    name="amountGAS"
                    value={this.state.amountGAS}
                    onChange={this.handleChange}
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                    error={this.state.minAmountOK ? null : true}
                    helperText={this.state.minAmountOK ? "" : "You are below the minimum required"}
                  />
                </Grid>
                <Grid item>
                  {
                    this.state.calculatingPrice ?
                      <p>Loading price...</p>
                      :
                      <>
                        <p>You pay {this.state.priceInUSD}$ (+Fee: {this.state.totalFee}$)</p>
                        <p>Total: {this.state.fiatChargeAmount}$</p>
                      </>
                  }
                </Grid>
                {
                  !this.state.calculatingPrice && this.state.minAmountOK ?
                    <Grid item>
                      <button onClick={this.buy}>Buy</button>
                    </Grid> : null
                }
              </Grid >
            </div >
    );
  }
}

export default Deposit;
