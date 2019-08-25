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
		showLoginButton();
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

function send(sendArgs){
	requestAcceptance(JSON.stringify(sendArgs)).then(()=>alert('sent!'));
}

function invoke(invokeArgs){
	requestAcceptance(JSON.stringify(invokeArgs)).then(()=>alert('sent!'));
}

function invokeMulti(invokeMultiArgs){
	requestAcceptance(JSON.stringify(invokeMultiArgs)).then(()=>alert('sent!'));
}

function signMessage(signArgs){
	requestAcceptance(JSON.stringify(signArgs)).then(()=>alert('sent!'));
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

function deploy(deployArgs){
	requestAcceptance(JSON.stringify(deployArgs)).then(()=>alert('sent!'));
}

// EVERYTHING ONWARDS HAS TO BE REMODELED TO IMPROVE THE USER INTERFACE

function write(html){
	document.getElementById("content").innerHTML = html;
}

function showLoginButton(){
	write("<button id='login-button'>Login</button>");
	document.getElementById("login-button").addEventListener("click", ()=>window.open("../login/index.html", "Headjack - Login", "width=300,height=200"));
}

function requestAcceptance(message){
	return new Promise((resolve, reject) => {
		write(message+"<br><button id='accept-button'>Accept</button><br><button id='reject-button'>Reject</button>");
		document.getElementById("accept-button").addEventListener("click", resolve);
		document.getElementById("reject-button").addEventListener("click", reject);
	});
}
