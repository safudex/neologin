import connectToParent from 'penpal/lib/connectToParent';
import connectToChild from 'penpal/lib/connectToChild';
import Neon from "@cityofzion/neon-js";

let acct = null; //Neon.create.Account("ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW");
let currentNetwork = "MainNet";

let rawMethods = {
	getProvider,
	getNetworks,
	getAccount,
	getPublicKey,
	getBalance,
	getStorage,
	invokeRead,
	getBlock,
	getBlockHeight,
	getTransaction,
	getApplicationLog,
	send,
	invoke,
	invokeMulti,
	signMessage,
	deploy,
	//Methods implemented in the client SDK
	//addEventListener,
	//removeEventListener
};

let methods={};

const unathenticatedMethods = ['getProvider', 'getNetworks', 'getBalance', 'getStorage', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog'];

Object.keys(rawMethods).map((key) => {
	methods[key] = (...args)=>{
		if(acct || unathenticatedMethods.includes(key)){
			return rawMethods[key](...args);
		} else {
			return signIn().then(()=>rawMethods[key](...args));
		}
	}
})

const connection = connectToParent({
	methods
});

connection.promise.then(parent => {
	parent.sendEvent('READY', providerInfo);
	//Add event listeners for CONNECTED, BLOCK_HEIGHT_CHANGED and TRANSACTION_CONFIRMED
	
	//parent.add(3, 1).then(total => console.log(total));
});

function signIn(){
	let loginWindow = window.open("/login/index.html");
	const connection = connectToChild({
		// The iframe to which a connection should be made
		loginWindow,
		// Methods the parent is exposing to the child
		methods: {}
	});

	return connection.promise.then(child => {
		return child.getPrivateKey().then(privkey => acct = Neon.create.account(privkey));
	});
}

const providerInfo = {
  name: 'Headjack',
  website: 'https://headjack.to',
  version: 'v0.1',
  compatibility: [],
  extra: {}
};

function getProvider(){
	return Promise.resolve(providerInfo);
}

function getNetworks(){
	return Promise.resolve({
		networks: ["MainNet", "TestNet"],
		defaultNetwork: currentNetwork
	});
}

function getAccount(){
	return Promise.resolve({
		address: acct.address,
		label: 'My Spending Wallet'
	});
}

function getPublicKey(){
	return Promise.resolve({
		address: acct.address,
		publicKey: acct.publicKey
	});
}

function getBalance(balanceArgs){}

function getStorage(storageArgs){} //{ scriptHash: string, key: string, network?: string }){

function invokeRead(invokeArgs){}

function getBlock(blockArgs){}

function getBlockHeight(blockHeightArgs){}

function getTransaction(txArgs){}

function getApplicationLog(appLogArgs){}

function send(sendArgs){}

function invoke(invokeArgs){}

function invokeMulti(invokeMultiArgs){}

function signMessage(signArgs){}

function deploy(deployArgs){}



