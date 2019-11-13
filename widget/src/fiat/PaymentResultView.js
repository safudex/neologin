import React from 'react';
import { finishPurchase } from './index'

class PaymentResultView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            success: null,
            resultMsg: ''
        };
    }

    componentDidMount() {
        var temp = this.props.url.searchParams.get("contactId");
        if (this.props.success === 'true') {
            var asset = this.props.url.searchParams.get("asset");
            var actualBalance = this.props.url.searchParams.get("actualBalance");
            temp = temp ? temp : "a?A";
            var contactId = temp.split('?')[0]
            var orderId = temp.split('?')[1].split('=')[1]
            var from = this.props.url.searchParams.get("from");
            var to = this.props.url.searchParams.get("to");
            var value = this.props.url.searchParams.get("value");
            var neoAddr = this.props.url.searchParams.get("neoAddr");
            this.setState({
                resultMsg: 'Payment ok. Please wait..'
            })
            this.startFinalTransaction(neoAddr, from, to, value, null, contactId, orderId, actualBalance, asset)
        } else {
            this.setState({ resultMsg: 'Error with your credit card' })
        }
    }

    startFinalTransaction = (neoAddr, from, to, value, gas, contactId, orderId, actualBalance, asset) => {
        finishPurchase(neoAddr, from, to, value, gas, contactId, orderId, actualBalance, asset).then((tx) => {
            this.setState({ resultMsg: `Done! This is your tx id: ${tx}` })
        }).catch(() => {
            this.setState({ resultMsg: `Something went wrong (orderId = ${this.state.orderId}), please contact us (fiat@neologin.io)` })
        })
    }

    render() {
        return (
            <>
                <p>{this.state.resultMsg}</p>
            </>
        );
    }
}

export default PaymentResultView;