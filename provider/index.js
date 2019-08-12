import connectToChild from 'penpal/lib/connectToChild';
 
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

connection.promise.then(child => {
	console.log(child);
	export child;
	//child.multiply(2, 6).then(total => console.log(total));
});
