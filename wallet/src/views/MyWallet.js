import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import copyIcon from '../imgs/copy.png'

//import neologin from 'neologin';
import neologin from '../provider.js';

class MyWallet extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '-',
            balance: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.network !== this.state.network) {
            this.getUserAccount()
        }
    }

    getUserAccount() {
        neologin.getAccount()
            .then((account) => {
                this.setState({ address: account.address })
                this.setState({ balance: [] })
                neologin.getBalance({
                    params: [{
                        address: account.address
                    }],
                    network: this.props.network,
                })
                    .then((results) => {
                        console.log('reeees', results)
                        Object.keys(results).forEach(address => {
                            const balances = results[address];
                            balances.forEach(balance => {
                                const { assetID, symbol, amount } = balance

                                console.log('Address: ' + address);
                                console.log('Asset ID: ' + assetID);
                                console.log('Asset symbol: ' + symbol);
                                console.log('Amount: ' + amount);
                                this.setState((oldState) => ({ balance: [...oldState.balance, balance] }))
                            });
                        });
                    })

            }).catch((e) => console.log(e));
    }

    componentDidMount() {
        this.getUserAccount()
    }

    render() {
        return (
            <div>
                <Grid container direction="column">
                    <Grid item style={{ margin: '1rem 0' }}>
                        <span style={{ fontWeight: 'bold' }}>Address: </span><span style={{ wordBreak: 'break-all' }}>{this.state.address}</span> {/* <img src={copyIcon} className='copyIcon' style={{ width: '1em', display: 'inline' }} ></img> */}
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing={3}>
                            <Grid item>
                                <Grid container direction="column">
                                    <Grid item>
                                        <span style={{ fontWeight: 'bold' }}>SYMBOL</span>
                                    </Grid>
                                    {
                                        this.state.balance.map((el) =>
                                            <Grid item key={el.symbol}>
                                                <span>{el.symbol}</span>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction="column">
                                    <Grid item>
                                        <span style={{ fontWeight: 'bold' }}>AMOUNT</span>
                                    </Grid>
                                    {
                                        this.state.balance.map((el, n) =>
                                            <Grid item key={n}>
                                                <span>{el.amount}</span>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default MyWallet