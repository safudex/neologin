import React from 'react';

class ACSUI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            wantsDeposit: false
        }
    }

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    handleLoad = () => {
        document.form.submit()
    }

    render() {
        return (
            <>
                <div>
                    <h2 style="text-align:center;">Loading ACS Page...</h2>
                    <form style="visibility:hidden;" name="form" id="form" action={this.props.acsurl} method="POST">
                        <input type="hidden" name="PaReq" value={this.props.pareq} />
                        <input type="hidden" name="TermUrl" value={this.props.termurl} />
                        <input type="hidden" name="MD" value={this.props.md} />
                    </form>
                </div>
            </>
        );
    }
}

export default ACSUI;
