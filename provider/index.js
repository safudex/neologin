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

function checkEvent(ev){
	if(Object.keys(registeredEvents).includes(ev)){
		return true;
	} else {
		console.error(`The event used ("${ev}") is not supported. The only events supported are ${Object.keys(registeredEvents)}.`);
		return false;
	}
}

function addEventListener(ev, cb){
	if(checkEvent(ev)){
		registeredEvents[ev].push(cb);
	}
}

function removeEventListener(ev){
	if(checkEvent(ev)){
		registeredEvents[ev] = [];
	}
}

const iframe = document.createElement('iframe');
iframe.src = 'https://headjack.to/widget/index.html';
document.body.appendChild(iframe);

const connection = connectToChild({
	// The iframe to which a connection should be made
	iframe,
	// Methods the parent is exposing to the child
	methods: {
		sendEvent
	}
});

const promiseMethods = ["getProvider", "getNetworks", "getAccount", "getPublicKey", "getBalance", "getStorage", "invokeRead", "getBlock", "getBlockHeight", "getTransaction", "getApplicationLog", "send", "invoke", "invokeMulti", "signMessage", "deploy"]; //Doesn't include addEventListener nor removeEventListener as these don't return promises

let headjack = {removeEventListener, addEventListener};

for(let i=0; i<promiseMethods.length; i++){
	let method = promiseMethods[i];
	headjack[method] = function(...args){
		return connection.promise.then((child) => child[method](...args));
	};
}

export default headjack;
