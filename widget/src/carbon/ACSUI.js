import React from 'react';

class ACSUI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            acsurl: this.props.acsurl,
            pareq: this.props.pareq,
            termurl: this.props.termurl,
            md: this.props.md,
            height: 438
        };
    }

    componentDidMount() {
        let topBarHeight = document.getElementById("topBar").offsetHeight
        let h = 400 + topBarHeight
        this.setState({ height: `${h}px` })
        this.createIframe3DS()
    }

    createIframe3DS = () => {
        var iframe = document.createElement('iframe');
        iframe.style['width'] = '100%'
        iframe.style['height'] = '100%'
        iframe.style['border'] = '0'
        iframe.id = 'iframe3ds'
        iframe.onLoad = "alert('Test');"
        var html = `
        <form style={{width:'100%', height='100%'}}name="form" id="form" action=${this.state.acsurl} method="POST">
        <input type="hidden" name="PaReq" value=${this.state.pareq} />
        <input type="hidden" name="TermUrl" value=${this.state.termurl} />
        <input type="hidden" name="MD" value=${this.state.md} />
        <p>You will be redirected to 3DS</p>
        <button type="submit" id="completePayment">Complete payment</button>
        </form>
        <script>
        function submitt() {
        document.getElementById('form').submit()
        }
        </script>
        `;
        document.getElementById('3dsContainer').appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();
        setTimeout(() => { document.getElementById('iframe3ds').contentWindow.submitt() }, 1);
    }

    render() {
        return (
            <>
                <div id='3dsContainer' style={{ height: this.state.height }}>
                </div>
            </>
        );
    }
}

export default ACSUI;
