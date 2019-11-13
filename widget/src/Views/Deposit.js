import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './styles.css'

import { getFinalAmount, startTransaction, postCreditCard } from '../fiat/index'
import ACSUI from '../carbon/ACSUI';

class Deposit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      asset: this.props.asset,
      ethAddress: 0,
      payinAddress: 0,
      contactId: null,
      ccView: false,
      totalFee: 0,
      amount: this.props.amount,
      fiatChargeAmount: 0,
      calculatingPrice: 0,
      priceInUSD: 0,
      minAmountOK: true,
      ccViewIsLoading: false,
      cardError: false,
      activateStatusScreen: false,
      disableConfirmButton: false,

      blocked: false
    };
  }

  componentDidMount() {
    this.calculatePrice(this.state.amount, this.state.asset)
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value })
    if (name === 'amount') {
      this.calculatePrice(value, this.state.asset)
    } else if (name === 'asset') {
      this.calculatePrice(this.state.amount, value)
    }
  }

  calculatePrice = (value, asset) => {
    let _calculatingPrice = this.state.calculatingPrice + 1
    this.setState({ calculatingPrice: _calculatingPrice }, () => {
      getFinalAmount(value, _calculatingPrice, asset).then((res) => {
        if (res.calculatingPrice == this.state.calculatingPrice) {
          if (this.state.calculatingPrice)
            this.setState({
              fiatChargeAmount: res.fiatChargeAmount,
              totalFee: res.totalFee,
              priceInUSD: res.priceInUSD,
              calculatingPrice: 0,
              minAmountOK: res.minAmountOK,
              ethAmount2Buy: res.ethAmount2Buy
            })
        }
      })
    })
  }

  buy = () => {
    this.setState({ ccViewIsLoading: true, ccView: true })
    startTransaction(this.props.addr, this.props.privkey, this.state.ethAmount2Buy).then((res) => {
      this.setState({
        contactId: res.contactId,
        ethAddress: res.address,
        payinAddress: res.payinAddress,
        ccViewIsLoading: false,
        remainingWeeklyLimit: res.remainingWeeklyLimit,
        amountExpectedFrom: res.amountExpectedFrom
      })
      if (res.remainingWeeklyLimit < this.state.fiatChargeAmount) {
        this.setState({ cardError: true, errorMsg: `The amount you are trying to buy exceeds you remaining dialy limit: ${res.remainingWeeklyLimit}$` })
      }
      if (this.state.disableConfirmButton) {
        this.postCreditCard()
      }
    })
  }

  confirmCreditCard = () => {
    this.setState({ disableConfirmButton: true })
    if (this.state.contactId) {
      this.postCreditCard()
    }
  }

  postCreditCard = () => {
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
    console.log(this.state.ethAddress)
    let temp_address = this.state.ethAddress
    postCreditCard(this.state.contactId, this.state.fiatChargeAmount, temp_address,
      this.state.payinAddress, creditCard, this.state.amountExpectedFrom, this.state.asset, this.props.neoAddr).then((response) => {
        this.setState({
          activateACS: true,
          acsurl: response.acsurl,
          pareq: response.pareq,
          termurl: response.termurl,
          md: response.md
        })
      }).catch((e) => {
        console.log(e)
        this.setState({ disableConfirmButton: false })
        if (!this.state.cardError)
          this.setState({ cardError: true, errorMsg: 'Something went wrong:/ Try with another credit card.' })
      })
  }

  render() {
    return (
      this.state.activateACS && !this.state.ccViewIsLoading ? <ACSUI onSubmit={() => this.setState({ activateStatusScreen: true })} acsurl={this.state.acsurl} pareq={this.state.pareq} termurl={this.state.termurl} md={this.state.md} /> :
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
                <p style={{ fontSize: '0.75rem' }}>Destination address: {this.props.addr}</p>
                <p style={{ fontSize: '0.75rem' }}>Amount requested: {this.state.amount} {this.state.asset}</p>
                <p style={{ fontSize: '0.75rem' }}>Price: {this.state.priceInUSD}$</p>
                <p style={{ fontSize: '0.75rem' }}>Fee: {this.state.totalFee}$</p>
                <p style={{ fontSize: '0.75rem' }}>Total to pay: {this.state.fiatChargeAmount}$</p>
              </Grid>
              <Grid item><p style={{ fontWeight: 'bold', marginTop: '0' }}>Payment info</p></Grid>
              <Grid item>
                <Grid container spacing={1}
                  direction="row"
                  justify="center"
                  alignItems="center">

                  <Grid item xs={6}>
                    <input
                      className="inputCC"
                      placeholder="Card number"
                      id="standard-name"
                      label="Card number"
                      margin="normal"
                      name="card_number"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      className="inputCC"
                      placeholder="Billing premise"
                      id="standard-name"
                      label="Premise"
                      margin="normal"
                      name="card_billingPremise"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      className="inputCC"
                      placeholder="MM/YY"
                      id="standard-name"
                      label="MM/YY"
                      margin="normal"
                      name="card_expiry"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      className="inputCC"
                      placeholder="Billing street"
                      id="standard-name"
                      label="Street"
                      margin="normal"
                      name="card_billingStreet"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      className="inputCC"
                      placeholder="CVC"
                      id="standard-name"
                      label="CVC"
                      margin="normal"
                      name="card_cvc"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      className="inputCC"
                      placeholder="Billing postal"
                      id="standard-name"
                      label="Postal code"
                      margin="normal"
                      name="card_billingPostal"
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      className="inputCC"
                      placeholder="Full name"
                      id="standard-name"
                      label="Full name"
                      margin="normal"
                      name="card_fullName"
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {
                this.state.cardError ?
                  <Grid item>
                    <p style={{ color: 'darkred', fontSize: '0.75rem' }}>{this.state.errorMsg}</p>
                  </Grid>
                  : null
              }
              <Grid item>
                {
                  !this.state.disableConfirmButton ? <span onClick={() => this.setState({ ccView: false })} className='backtext'>Back</span> : null
                }
                <button className='buttonBuy' disabled={this.state.disableConfirmButton} onClick={() => this.confirmCreditCard()}>{!this.state.disableConfirmButton ? 'Confirm' : 'Creating transaction...'}</button>
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
              <Grid item><p style={{ fontWeight: 'bold', marginTop: '0' }}>Buy assets</p></Grid>
              <Grid item>
                <select name="asset" id="currency" onChange={this.handleChange}>
                  <option value="GAS">GAS</option>
                  <option value="NEO">NEO</option>
                </select>
              </Grid>
              <Grid item>
                <TextField
                  id="standard-name"
                  label="Amount"
                  type="Number"
                  margin="normal"
                  name="amount"
                  value={this.state.amount}
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
                    <button className="buttonBuy" disabled={!this.state.amount} onClick={this.buy}>Buy</button>
                  </Grid> : null
              }
            </Grid >
          </div >
    );
  }
}

export default Deposit;
