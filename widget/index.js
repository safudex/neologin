import connectToParent from 'penpal/lib/connectToParent';
import Neon from "@cityofzion/neon-js";
import { server } from '../config';

let acct = null;
let defaultNetwork = "MainNet";

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
	//TODO: Add event listeners for CONNECTED, BLOCK_HEIGHT_CHANGED and TRANSACTION_CONFIRMED
	
	//parent.add(3, 1).then(total => console.log(total));
});

function signIn(){
	return new Promise((resolve, reject) => {
		window.addEventListener("message",
			(event) => {
				if (event.origin !== server || !event.data.privkey){
					return;
				}
				acct = Neon.create.account(event.data.privkey);
				resolve();
			},
			false
		);
		window.open("../login/index.html", "Headjack - Login", "width=300,height=200");
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
		defaultNetwork: defaultNetwork
	});
}

function getAccount(...args){
	console.log(args);
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

function getBlockHeight(blockHeightArgs){
	//return client.getBlockCount();
}

function getTransaction(txArgs){}

function getApplicationLog(appLogArgs){}

function send(sendArgs){}

function invoke(invokeArgs){}

function invokeMulti(invokeMultiArgs){}

function signMessage(signArgs){
	/*
	const salt = random(); 
	return {
		publicKey: acct.publicKey; // Public key of account that signed message
		message: signArgs.message; // Original message signed
		salt: string; // Salt added to original message as prefix, before signing
		data: string; // Signed message
	};
	*/
}

function deploy(deployArgs){}


