import connectToParent from 'penpal/lib/connectToParent';
import Neon from "@cityofzion/neon-js";
import { server } from './config';
import React from 'react'
import ReactDOM from 'react-dom'
import LoginButton from './Views/LoginButton'
import UserData from './Views/UserData';
import RequestAcceptance from './Views/RequestAcceptance'

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

let methods = {};

const unathenticatedMethods = ['getProvider', 'getNetworks', 'getBalance', 'getStorage', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog'];

Object.keys(rawMethods).map((key) => {
	methods[key] = (...args) => {
		if (acct || unathenticatedMethods.includes(key)) {
			return rawMethods[key](...args);
		} else {
			return signIn().then(() => rawMethods[key](...args));
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

function signIn() {
	return new Promise((resolve, reject) => {
		window.addEventListener("message",
			(event) => {
				console.log(event.origin, server)
				if (event.origin !== server || !event.data.privkey) {
					return;
				}
				acct = Neon.create.account(event.data.privkey);
				console.log(event.data.privkey, acct)
				successfulSignIn(acct)
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

function getProvider() {
	return Promise.resolve(providerInfo);
}

function getNetworks() {
	return Promise.resolve({
		networks: ["MainNet", "TestNet"],
		defaultNetwork: defaultNetwork
	});
}

function getAccount(...args) {
	return Promise.resolve({
		address: acct.address,
		label: 'My Spending Wallet'
	});
}

function getPublicKey() {
	return Promise.resolve({
		address: acct.address,
		publicKey: acct.publicKey
	});
}

function getBalance(balanceArgs) { }

function getStorage(storageArgs) { } //{ scriptHash: string, key: string, network?: string }){

function invokeRead(invokeArgs) { }

function getBlock(blockArgs) { }

function getBlockHeight(blockHeightArgs) {
	//return client.getBlockCount();
}

function getTransaction(txArgs) { }

function getApplicationLog(appLogArgs) { }

function send(sendArgs) {
	requestAcceptance(JSON.stringify(sendArgs)).then(() => alert('sent!'));
}

function invoke(invokeArgs) {
	requestAcceptance(JSON.stringify(invokeArgs)).then(() => alert('sent!'));
}

function invokeMulti(invokeMultiArgs) {
	requestAcceptance(JSON.stringify(invokeMultiArgs)).then(() => alert('sent!'));
}

function signMessage(signArgs) {
	requestAcceptance(JSON.stringify(signArgs)).then(() => alert('sent!'));
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

function deploy(deployArgs) {
	requestAcceptance(JSON.stringify(deployArgs)).then(() => alert('sent!'));
}

// EVERYTHING ONWARDS HAS TO BE REMODELED TO IMPROVE THE USER INTERFACE

function closeWidget() {
	connection.promise.then((parent) => parent.closeWidget())
}

function write(html) {
	document.getElementById("content").innerHTML = html
}

function showLoginButton() {
	connection.promise.then((parent) => parent.displayWidget())
	ReactDOM.render(<LoginButton closeWidget={closeWidget} />, document.getElementById('content'));
}

function successfulSignIn(account) {
	connection.promise.then((parent) => parent.displayWidget())
	ReactDOM.render(<UserData account={account} closeWidget={closeWidget} />, document.getElementById('content'));
}


function requestAcceptance(message) {
	console.log('mess', message)
	return new Promise((resolve, reject) => {
		connection.promise.then((parent) => parent.displayWidget())
		ReactDOM.render(<RequestAcceptance message={message} resolve={resolve} reject={reject} closeWidget={closeWidget} />, document.getElementById('content'));
	});
}
