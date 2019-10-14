import React from 'react';
import Grid from '@material-ui/core/Grid';

import Brand from './Brand'
import ReactDOM from 'react-dom'

import './styles.css'

class RequestAcceptanceInvokeMulti extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentContract: props.invokeMultiArgs.invokeArgs[0],
            totalContracts: props.invokeMultiArgs.invokeArgs.length,
            actualIndex: 0
        }
    }

    unmountComponent = () => {
        ReactDOM.unmountComponentAtNode(window.document.getElementById(this.props.contid))
    }

    componentWillUnmount() {
        window.document.getElementById(this.props.contid).remove();
        this.props.closeRequest()
        this.props.closeWidget()
    }

    componentDidUpdate() {
        this.props.updateWidgetHeight(document.getElementById(this.props.contid).clientHeight)
    }

    render() {
        return (
            <div>
                <Brand closeWidget={() => { this.props.reject(); this.unmountComponent(); }} reqNumber={parseInt(this.props.contid.split('-')[1]) + 1} />
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%', padding: '1em' }}
                >
                    <Grid item xs>
                        <p style={{ fontSize: '0.85em' }}>This dApp has requested permission to invoke the following smart contracts:</p>
                    </Grid>
                    <Grid item xs>
                        <Grid container direction="row">
                            <Grid item onClick={() => { if (this.state.actualIndex !== 0) this.setState({ actualIndex: this.state.actualIndex - 1 }) }}
                                style={{ transform: 'translateY(-4px)', cursor: this.state.actualIndex === 0 ? 'default' : 'pointer', opacity: this.state.actualIndex === 0 ? '0.2' : '1' }}>
                                &#x1F860;
            </Grid>
                            <Grid item style={{ margin: '0px 14px' }}>
                                <span>{this.state.actualIndex + 1} / {this.state.totalContracts}</span>
                            </Grid>
                            <Grid item onClick={() => { if (this.state.actualIndex !== this.state.totalContracts - 1) this.setState({ actualIndex: this.state.actualIndex + 1 }) }}
                                style={{ transform: 'translateY(-4px)', cursor: this.state.actualIndex === this.state.totalContracts - 1 ? 'default' : 'pointer', opacity: this.state.actualIndex === this.state.totalContracts - 1 ? '0.2' : '1' }}>
                                &#x1F862;
            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <span style={{ fontSize: '0.75em' }}>{this.props.invokeMultiArgs.invokeArgs[this.state.actualIndex].scriptHash}</span>
                    </Grid>
                    <Grid item xs style={{ width: '100%' }}>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                            style={{ padding: '1em' }}
                        >
                            <div>
                                {
                                    (this.props.invokeMultiArgs.invokeArgs[this.state.actualIndex].attachedAssets !== undefined) ?
                                        ["NEO", "GAS"].map((asset, i) =>
                                            <span key={i} style={{ fontSize: '0.85em', display: 'block' }}>
                                                Amount: {(this.props.invokeMultiArgs.invokeArgs[this.state.actualIndex].attachedAssets[asset]) ?
                                                    this.props.invokeMultiArgs.invokeArgs[this.state.actualIndex].attachedAssets[asset] : 0} {asset}</span>
                                        )
                                        : (<>
                                            <span style={{ fontSize: '0.85em', display: 'block' }}>
                                                Amount: {0} {'NEO'}</span>
                                            <span style={{ fontSize: '0.85em', display: 'block' }}>
                                                Amount: {0} {'GAS'}</span></>
                                        )

                                }
                                <span style={{ fontSize: '0.85em', display: 'block' }}>Network: {this.props.invokeMultiArgs.network}</span>
                                {
                                    ["NEO", "GAS"].map((asset, i) => {
                                        let total = 0;
                                        this.props.invokeMultiArgs.invokeArgs.forEach(element => {

                                            if (element.attachedAssets && element.attachedAssets[asset])
                                                total += parseFloat(element.attachedAssets[asset])
                                        })
                                        return (< span key={i} style={{ fontSize: '0.85em', display: 'block' }}>Total amount: {total} {asset}</span>)
                                    })
                                }
                                <span style={{ fontSize: '0.85em', display: 'block' }}>Fee: {this.props.invokeMultiArgs.fee || 0} GAS</span>
                                {
                                    this.props.goodEstimation ?
                                        <span style={{ fontSize: '0.85em', display: 'block', color: '#B33A3A' }}>The amount of GAS or NEO that will be spent on this transaction could not be estimated, please make sure that this is a legitimate transaction</span>
                                        : null
                                }
                            </div>
                        </Grid>
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
                                    Accept
                </button>
                            </Grid>
                            <Grid item xs>
                                <button className='buttonContinue buttonReject' onClick={() => {
                                    this.props.reject()
                                    this.unmountComponent()
                                }}>
                                    Reject
            </button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid >
            </div >
        );
    }
}

export default RequestAcceptanceInvokeMulti;
