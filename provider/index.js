import connectToChild from 'penpal/lib/connectToChild';
import base58 from 'bs58'; //TODO: Remove dependency
import SHA256 from 'crypto-js/sha256';
import hexEncoding from 'crypto-js/enc-hex';

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

document.addEventListener("DOMContentLoaded", () => {
	document.body.appendChild(iframe);
	closeWidget()
});

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
    else {
        iframe.style['height'] = '0px';
	}
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

// UTILS

let reverseHex = (hex) => hex.match(/.{2}/g).reverse().join('');

function sha256(data) {
  const hex = hexEncoding.parse(data);
  const sha = SHA256(hex).toString();
  return sha;
}

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
			arr.push(hex.length > 1 && hex || "0" + hex);
		}
		return arr.join('');
	},
	hex2int: (hex) => parseInt(reverseHex(hex), 16),
	int2hex: (int) => {
		let hex = int.toString(16);
		return reverseHex(hex.length % 2 ? '0' + hex : hex)
	},
	reverseHex,
	// Functions taken directly from o3's implementation (MIT licensed)
	address2scriptHash: (address) => {
		const hash = base58.decode(address).toString('hex'); //TODO: Replace with base58tohex
		return hash.substr(2, 40);
	},
	scriptHash2address: (scriptHash) =>{
		const ADDR_VERSION = '17';
		scriptHash = scriptHash.substr(0, 40);
		const firstSha = sha256(ADDR_VERSION + scriptHash);
		const secondSha = sha256(firstSha);
		const shaChecksum = secondSha.substr(0, 8);
		const arrayBuffer = Buffer.from(ADDR_VERSION + scriptHash + shaChecksum, "hex");
		return base58.encode(arrayBuffer);
	}
};

export default neologin;
