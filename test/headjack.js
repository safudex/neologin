import connectToChild from 'penpal/lib/connectToChild';

function sendEvent(ev, data){ //{type, data}
	registeredEvents[ev].map((cb)=>cb(data));
}

let registeredEvents = {
	'READY':[],
	'ACCOUNT_CHANGED':[],
	'NETWORK_CHANGED':[],
	'CONNECTED':[],
	'DISCONNECTED':[],
	'BLOCK_HEIGHT_CHANGED':[],
	'TRANSACTION_CONFIRMED':[]
};

function addEventListener(ev, cb){
	registeredEvents[ev].push(cb);
}

function removeEventListener(ev){
	registeredEvents[ev] = [];
}

const iframe = document.createElement('iframe');
iframe.src = 'http://localhost:8080/widget/index.html';
document.body.appendChild(iframe);

const connection = connectToChild({
	// The iframe to which a connection should be made
	iframe,
	// Methods the parent is exposing to the child
	methods: {
		sendEvent
	}
});

/*
let  = connection.promise.then(child => {
	//child.addEventListener = addEventListener;
	//child.removeEventListener = removeEventListener;
	return child;
	//child.multiply(2, 6).then(total => console.log(total));
});
*/

const promiseMethods = ["getProvider", "getNetworks", "getAccount", "getPublicKey", "getBalance", "getStorage", "invokeRead", "getBlock", "getBlockHeight", "getTransaction", "getApplicationLog", "send", "invoke", "invokeMulti", "signMessage", "deploy"]; //Doesn't include addEventListener nor removeEventListener as these don't return promises

let headjack = {removeEventListener, addEventListener};

for(let i=0; i<promiseMethods.length; i++){
	let method = promiseMethods[i];
	headjack[method] = function(...args){
		return connection.promise.then((child) => child[method](...args));
	};
}

export default headjack;
