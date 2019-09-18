import connectToChild from 'penpal/lib/connectToChild';

let heights = []

function sendEvent(ev, data) { //{type, data}
    registeredEvents[ev].map((cb) => cb(data));
}

let registeredEvents = {
    'READY': [],
    'ACCOUNT_CHANGED': [],
    'NETWORK_CHANGED': [],
    'CONNECTED': [],
    'DISCONNECTED': [],
    'BLOCK_HEIGHT_CHANGED': [],
    'TRANSACTION_CONFIRMED': [],
};

function checkEvent(ev) {
    if (Object.keys(registeredEvents).includes(ev)) {
        return true;
    } else {
        console.error(`The event used ("${ev}") is not supported. The only events supported are ${Object.keys(registeredEvents)}.`);
        return false;
    }
}

function addEventListener(ev, cb) {
    if (checkEvent(ev)) {
        registeredEvents[ev].push(cb);
    }
}

function removeEventListener(ev) {
    if (checkEvent(ev)) {
        registeredEvents[ev] = [];
    }
}

const iframe = document.createElement('iframe');
iframe.src = 'http://localhost:3002/';

document.body.appendChild(iframe);
closeWidget()

const connection = connectToChild({
    // The iframe to which a connection should be made
    iframe,
    // Methods the parent is exposing to the child
    methods: {
        sendEvent,
        displayWidget,
        closeWidget
    }
});

const promiseMethods = ["getProvider", "getNetworks", "getAccount", "getPublicKey", "getBalance", "getStorage", "invokeRead", "getBlock", "getBlockHeight", "getTransaction", "getApplicationLog", "send", "invoke", "invokeMulti", "signMessage", "deploy"]; //Doesn't include addEventListener nor removeEventListener as these don't return promises

let neologin = { removeEventListener, addEventListener };

for (let i = 0; i < promiseMethods.length; i++) {
    let method = promiseMethods[i];
    neologin[method] = function (...args) {
        return connection.promise.then((child) => {
            return child
        }).then((child) => child[method](...args));
    };
}

var iframeDeskStyle = {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    boxShadow: '0 5px 40px rgba(0,0,0,.16)',
    borderRadius: '4px',
    border: '0',
    width: '375px',
    background: 'white',

}

var iframeMobileStyle = {
    position: 'fixed',
    bottom: '0',
    boxShadow: '0 5px 40px rgba(0,0,0,.16)',
    borderRadius: '0px',
    width: '100%',
    border: '0',
    background: 'white'
}

function setIframeStyle(w, h) {
    let iframeStyle = w > 576 ? iframeDeskStyle : iframeMobileStyle
    for (let style in iframeStyle) {
        iframe.style[style] = iframeStyle[style];
    }
}

function displayWidget(widgetHeight) {
    heights.push(widgetHeight)
    iframe.style['height'] = widgetHeight + 'px';
    console.log(heights)
}

function closeWidget() {
    heights.pop()
    if (heights.length) {
        iframe.style['height'] = heights[heights.length - 1] + 'px';
        console.log(heights[heights.length - 1], '<----')
        console.log(iframe.style['height'])
    }
    else
        iframe.style['height'] = '0px';
    console.log(heights)
}

function getWindowSize() {
    // Get width and height of the window excluding scrollbars
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    setIframeStyle(w, h)
}

window.addEventListener("resize", getWindowSize);
getWindowSize();

neologin.utils = {
	hex2str: (hexx)=>{
		var hex = hexx.toString();//force conversion
		var str = '';
		for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	},
	str2hex: (str)=>{
		var arr = [];
		for (var i = 0, l = str.length; i < l; i ++) {
			var hex = Number(str.charCodeAt(i)).toString(16);
			arr.push(hex.length > 1 && hex || "0" + hex); //arr.push(hex);
		}
		return arr.join('');
	},
	hex2int: (hex) => parseInt(hex, 16),
	int2hex: (int) => int.toString(16),
	reverseHex: (hex) => hex.match(/.{2}/g).reverse().join(''),
	address2scriptHash: (address) =>{},
	scriptHash2address: (scriptHash) =>{}
};

export default neologin;
