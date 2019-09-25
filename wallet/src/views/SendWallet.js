import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import copyIcon from '../imgs/copy.png'

import neologin from 'neologin';

import TextField from '@material-ui/core/TextField';

class SendWallet extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '-',
            balance: [],
            toAddress: ''
        };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        })
    }

    send = () => {
        neologin.getAccount()
            .then((account) => {
                this.setState({ address: account.address })
                console.log(this.state.address,
                    this.state.toAddress,
                    this.state.asset,
                    this.state.amount,
                    this.state.remark,
                    this.state.fee,
                    this.props.network,
                    false
                )

                neologin.send({
                    fromAddress: this.state.address,
                    toAddress: this.state.toAddress,
                    asset: this.state.asset,
                    amount: this.state.amount,
                    remark: this.state.remark,
                    fee: this.state.fee,
                    network: this.props.network,
                    broadcastOverride: false,
                })
                    .then(({ txid, nodeUrl }) => {
                        console.log('Send transaction success!');
                        console.log('Transaction ID: ' + txid);
                        console.log('RPC node URL: ' + nodeUrl);
                    })
                    .catch(({ type, description, data }) => {
                        switch (type) {
                            case 'NO_PROVIDER':
                                console.log('No provider available.');
                                break;
                            case 'SEND_ERROR':
                                console.log('There was an error when broadcasting this transaction to the network.');
                                break;
                            case "MALFORMED_INPUT":
                                console.log('The receiver address provided is not valid.');
                                break;
                            case 'CANCELED':
                                console.log('The user has canceled this transaction.');
                                break;
                            case 'INSUFFICIENT_FUNDS':
                                console.log('The user has insufficient funds to execute this transaction.');
                                break;
                            default:
                                console.log('unknown error', type, description, data)
                        }
                    });

            }).catch((e) => console.log(e));


    }

    render() {
        return (
            <div>
                <Grid container direction="column">
                    <Grid item style={{ margin: '1rem 0 0 0', width: '100%' }}>
                        {/* <Grid container> */}
                        {/* <Grid item> */}
                        <TextField
                            fullWidth
                            id="standard-name"
                            label="Destination address"
                            margin="normal"
                            name="toAddress"
                            onChange={this.handleInputChange}
                        />
                        {/* </Grid> */}
                        {/* </Grid> */}
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-name"
                            label="Asset"
                            margin="normal"
                            name="asset"
                            onChange={this.handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-name"
                            label="Amount"
                            type="Number"
                            margin="normal"
                            name="amount"
                            onChange={this.handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-name"
                            label="Remark"
                            margin="normal"
                            name="remark"
                            onChange={this.handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-name"
                            label="Fee"
                            type="Number"
                            margin="normal"
                            name="fee"
                            onChange={this.handleInputChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" style={{ marginTop: '1rem' }} onClick={this.send}>
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default SendWallet
