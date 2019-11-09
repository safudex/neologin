import React from 'react';


class StatusScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: "Waiting for payment..."
        }
    }

  /*   taskOnWebHook(response) {
        let code = 0
        if (code == "100") {
            this.setState({ msg: "Payment ok. Finishing transaction..." })
            //ejecutar transaccion que envia dinero
            this.props.finishPurchase().then((tx) => this.setState({ msg: `Purchase completed, you will receive your purchase soon., your tx: ${tx}` }))
        }
        this.setState({ msg: "Payment failed, try again." })
    }
 */
    render() {
        return (
            <>
                <p>{this.state.msg}</p>
            </>
        );
    }
}

export default StatusScreen;
