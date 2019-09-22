import connectToParent from 'penpal/lib/connectToParent';
import Neon, { u, api, sc } from "@cityofzion/neon-js";
import { server } from './config';
import React from 'react'
import ReactDOM from 'react-dom'
import LoginButton from './Views/LoginButton'
import UserData from './Views/UserData';
import RequestAcceptance from './Views/RequestAcceptance'
import { v4 as uuid } from 'uuid';

let acct = null;
let defaultNetwork = "MainNet";
const supportedNetworks = ["MainNet", "TestNet"];

let totalRequests = 0
let calledLogin = false
let calledPermission = false
let userGivesPermission = false

let rawMethods = {
	getProvider,
	getNetworks,
	getAccount,
	getPublicKey,
	getBalance,
	getStorage,
	invokeRead,
	verifyMessage,
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

const unathenticatedMethods = ['getProvider', 'getNetworks', 'getBalance', 'getStorage', 'verifyMessage', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog'];
const requireNetworkCheckMethods = ['getBalance', 'getStorage', 'invokeRead', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog', 'send', 'invoke', 'invokeMulti', 'deploy'];

Object.keys(rawMethods).map((key) => {
	methods[key] = (...args) => {
		if (requireNetworkCheckMethods.includes(key)) {
			if (args[0].network !== undefined && !supportedNetworks.includes(args[0].network)){
				return Promise.reject({
					"type": "INVALID_NETWORK",
					"description": "This network is not supported."
				});
			}
		}
		if (acct || unathenticatedMethods.includes(key)) {
			return rawMethods[key](...args);
		} else {
			return signIn().then(() => rawMethods[key](...args)).catch((e) => Promise.reject(e))
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
		if (!calledLogin) {
			console.log('inn')
			calledLogin = true
			let storedPrivkey = window.localStorage.getItem('privkey');
			if (storedPrivkey === null) {
				window.addEventListener("message",
					(event) => {
						console.log(event.origin, server)
						if (event.origin !== server || !event.data.privkey) {
							return;
						}
						acct = Neon.create.account(event.data.privkey);
						if (event.data.rememberMe) {
							// Store privkey in localStore and restore later 
							window.localStorage.setItem('privkey', event.data.privkey);
						}
						successfulSignIn(acct)
						resolve();
					},
					false
				);
				showLoginButton();
			} else {
				acct = Neon.create.account(storedPrivkey);
				successfulSignIn(acct)
				resolve();
			}
		}
		else {
			reject()
		}
	});
}

const providerInfo = {
	name: 'NeoLogin',
	website: 'https://neologin.io',
	version: 'v0.1',
	compatibility: [],
	extra: {
		theme: null,
		currency: null
	}
};

function getNetwork(network){
	return network === undefined? defaultNetwork : network;
}

const rpcUrls = {
	"MainNet": "http://seed1.neo.org:10332",
	"TestNet": "http://seed1.ngd.network:20332",
};

// See https://github.com/CityOfZion/neon-js/blob/master/examples/browser/README.md
function rpcCall(call, args, network, constructResponse, unsupportedCall = false){
	return new Promise(async (resolve, reject) => {
		try{
			const url = rpcUrls[getNetwork(network)];
			const client = Neon.create.rpcClient(url);
			let result;
			if(unsupportedCall){
				const query = Neon.create.query({ method: call, params: args });
				result = await query.execute(url);
			} else {
				result = await client[call](...args);
			}
			resolve(constructResponse(result));
		} catch(e){
			reject({
				type: 'RPC_ERROR',
				description: 'There was an error with this RPC call.',
				data: ''
			});
		}
	})
}

// Does NOT need to be accepted
function getProvider() {
	return Promise.resolve(providerInfo);
}

// Does NOT need to be accepted
function getNetworks() {
	return Promise.resolve({
		networks: supportedNetworks,
		defaultNetwork: defaultNetwork
	});
}

// Needs to be accepted once
function getAccount(...args) {
	return new Promise((resolve, reject) => {
		requestAcceptance('Do you want to give access to your address?').then(() => {
			resolve({
				address: acct.address,
				label: 'My Spending Wallet'
			})
		}).catch(() => {
			reject({
				type: 'CONNECTION_DENIED',
				description: 'The user rejected the request to connect with your dApp.',
				data: ''
			});
		})
	})
}

// Needs to be accepted once
function getPublicKey() {
	return new Promise((resolve, reject) => {
		requestAcceptance('Do you want to give access to your public key?').then(() => {
			resolve({
				address: acct.address,
				publicKey: acct.publicKey
			})
		}).catch(() => {
			reject({
				type: 'CONNECTION_DENIED',
				description: 'The user rejected the request to connect with your dApp.',
				data: ''
			});
		})
	})
}

const neoscanEndpoints = {
	"MainNet": "https://api.neoscan.io/api/main_net",
	"TestNet": "https://neoscan-testnet.io/api/test_net"
};

// Does NOT need to be accepted
function getBalance(balanceArgs) {
	if(balanceArgs.params.constructor !== Array) {
		balanceArgs.params = [balanceArgs.params];
	}
	return new Promise(async (resolve, reject) => {
		const endpoint = neoscanEndpoints[getNetwork(balanceArgs.network)]; 
		let balances = await Promise.all(
			balanceArgs.params.map(
				(param) => fetch(endpoint+"/v1/get_balance/"+param.address)
				.then(res => res.json())
				.then(res => {
					let balance = [];
					for(let i = 0; i < res.balance.length; i++){
						if(param.assets === undefined || param.assets.includes(balance[i].asset_symbol)){
							let newAsset = {
								assetID: res.balance[i].asset_hash,
								symbol: res.balance[i].asset_symbol,
								amount: String(res.balance[i].amount),
							};
							if(param.fetchUTXO){
								newAsset.unspent = res.balance[i].unspent.map((utxo)=>(utxo.value=String(utxo.value), utxo)); // Convert type of value field from Number to String
							}
							balance.push(newAsset);
						}
					}
					return {
						balance: balance,
						address: res.address
					}; 
				})
			)
		);
		let final = {};
		for(let i = 0; i < balances.length; i++){
			final[balances[i].address] = balances[i].balance;
		}
		resolve(final);
	})
}

// Does NOT need to be accepted
function getStorage(storageArgs) {
	return rpcCall("getStorage", [storageArgs.scriptHash, storageArgs.key], storageArgs.network, (res)=>{return {result:u.hexstring2str(res)}});
}

// Does NOT need to be accepted -> This is a security hole (can be used to leak the user's public key/address) but O3 does it like this so it's better to maintain compatibility
function invokeRead(invokeArgs) {
	let script = "";
	try{
		const props = {
			// Scripthash for the contract
			scriptHash: invokeArgs.scriptHash,
			// name of operation to perform.
			operation: invokeArgs.operation,
			// any optional arguments to pass in. If null, use empty array.
			args: invokeArgs.args,
		}

		script = sc.createScript(props);
	} catch (e) {
		return Promise.reject({
			type: 'RPC_ERROR', //Should be MALFORMED_INPUT but compatibility
			description: 'The parameters or the scriptHash that you passed to the function are wrong',
			data: e,
		});
	}

	return rpcCall("invokeScript", [script], invokeArgs.network, (res)=>res.result);
}

// Does NOT need to be accepted
function verifyMessage(verifyArgs) {
	return Promise.resolve({
		result: Neon.verify.message(verifyArgs.message, verifyArgs.data, verifyArgs.publicKey)
	});
}

// Does NOT need to be accepted
function getBlock(blockArgs) {
	return rpcCall("getBlock", [blockArgs.blockHeight], blockArgs.network, (res)=>res);
}

// Does NOT need to be accepted
function getBlockHeight(blockHeightArgs) {
	return rpcCall("getBlockCount", [], blockHeightArgs.network, (res)=>{return {result:res}});
}

// Does NOT need to be accepted
function getTransaction(txArgs) {
	return rpcCall("getRawTransaction", [txArgs.txid], txArgs.network, (res)=>res);
}

// Does NOT need to be accepted
function getApplicationLog(appLogArgs) {
	return rpcCall("getapplicationlog", [appLogArgs.txid], appLogArgs.network, (res)=>res, true);
}

// Needs to be accepted every time
// See https://cityofzion.io/neon-js/docs/en/examples/native_asset.html
function send(sendArgs) {
	if(sendArgs.fromAddress !== acct.address){
		return Promise.reject({
			type: 'MALFORMED_INPUT', 
			description: 'From address is not a properly formatted address.'
		});
	}
	return new Promise((resolve, reject) => {
		requestAcceptance('Send monies?', sendArgs)
			.catch(() =>
				reject({
					type: 'CANCELED',
					description: 'There was an error when broadcasting this transaction to the network.',
				})
			)
			.then(async () => {
				let transaction;
				try{
					const endpoint = neoscanEndpoints[getNetwork(sendArgs.network)]; 
					const apiProvider = new api.neoscan.instance(endpoint);

					// Create contract transaction using Neoscan API
					let balance = await apiProvider.getBalance(sendArgs.fromAddress);
					transaction = Neon.create.contractTx();
					transaction = transaction.addIntent(sendArgs.asset, Number(sendArgs.amount), sendArgs.toAddress);
					if(sendArgs.remark) {
						transaction = transaction.addRemark(sendArgs.remark)
					}
					try{
						if(sendArgs.fee) {
							transaction = transaction.calculate(balance, null, Number(sendArgs.fee))
						} else {
							transaction = transaction.calculate(balance)
						}
					} catch(e) {
						reject({
							type: 'INSUFFICIENT_FUNDS',
							description: "Account doesn't have enough funds.",
						});
						return;
					}
					transaction = transaction.sign(acct.privateKey);
				} catch(e) {
					reject({
						type: 'MALFORMED_INPUT',
						description: "Some input provided was wrong.",
					});
					return;
				}

				try{
					const txid = transaction.hash;
					if(sendArgs.broadcastOverride) {
						resolve({
							txid,
							signedTx: transaction.serialize()
						});
					} else {
						// Send raw transaction
						const nodeURL = rpcUrls[getNetwork(sendArgs.network)];
						const client = Neon.create.rpcClient(nodeURL);
						await client.sendRawTransaction(transaction);

						// Sucess!
						resolve({
							txid,
							nodeURL
						});
					}
				} catch(e) {
					reject({
						type: 'SEND_ERROR',
						description: "There was an error when broadcasting this transaction to the network.",
					});
					return;
				}
			});
	});
}

// Needs to be accepted every time
// See https://cityofzion.io/neon-js/docs/en/examples/smart_contract.html
function invoke(invokeArgs) {
	return new Promise((resolve, reject) =>
		requestAcceptance(JSON.stringify(invokeArgs)).then(() =>
			alert('sent!')
			//	foo().then(() => resolve({ ... })).catch(() => {
			//		reject({
			//			type: 'RPC_ERROR',
			//			description: 'There was an error when broadcasting this transaction to the network.',
			//			data: ''
			//		});
			//	})
		).catch(() =>
			reject({
				type: 'CANCELED',
				description: 'There was an error when broadcasting this transaction to the network.',
				data: ''
			})
		)
	)
}

// Needs to be accepted every time
function invokeMulti(invokeMultiArgs) {
	return new Promise((resolve, reject) =>
		requestAcceptance(JSON.stringify(invokeMultiArgs)).then(() =>
			alert('sent!')
			//	foo().then(() => resolve({ ... })).catch(() => {
			//		reject({
			//			type: 'RPC_ERROR',
			//			description: 'There was an error when broadcasting this transaction to the network.',
			//			data: ''
			//		});
			//	})
		).catch(() =>
			reject({
				type: 'CANCELED',
				description: 'There was an error when broadcasting this transaction to the network.',
				data: ''
			})
		)
	)
}

// Needs to be accepted every time
function signMessage(signArgs) {
	return requestAcceptance(signArgs.message)
		.then(() => {
			return new Promise((resolve, reject) => {
				try {
					const salt = uuid().replace(/-/g, '');
					const parameterHexString = u.str2hexstring(salt + signArgs.message);
					const lengthHex = u.num2VarInt(parameterHexString.length / 2);
					const concatenatedString = lengthHex + parameterHexString;
					const messageHex = '010001f0' + concatenatedString + '0000';
					const signedMessage = Neon.sign.hex(messageHex, acct.privateKey);

					resolve({
						publicKey: acct.publicKey, // Public key of account that signed message
						message: signArgs.message, // Original message signed
						salt: salt, // Salt added to original message as prefix, before signing
						data: signedMessage, // Signed message
					});
				} catch(e) {
					reject({
						type: 'UNKNOWN_ERROR',
						description: 'There was an unknown error.',
						data: ''
					})
				}
			})
		})
}

// Needs to be accepted every time
function deploy(deployArgs) {
	return requestAcceptance(JSON.stringify(deployArgs))
		.then(() => {
			return new Promise((resolve, reject) => {
				alert('sent!')

				//reject({
				//	type: 'UNKNOWN_ERROR',
				//	description: 'There was an unknown error.',
				//	data: ''
				//})
				resolve({
					txid: null,
					nodeUrl: null
				})
			})
		})
}

function closeWidget() {
	connection.promise.then((parent) => parent.closeWidget())
}

function displayWidget(wheight) {
	connection.promise.then((parent) => parent.displayWidget(wheight))
	console.log('displayed!!')
}

function showLoginButton() {
	ReactDOM.render(<LoginButton closeWidget={() => { closeWidget(); calledLogin = false; }} />, document.getElementById('content'), () =>
		displayWidget(document.getElementById('content').clientHeight)
	);
}

function successfulSignIn(account) {
	window.document.getElementById('content').innerHTML = '';
	closeWidget()
	//ReactDOM.render(<UserData account={account} closeWidget={closeWidget} />, document.getElementById('content'), () => {
	//	displayWidget(document.getElementById('content').clientHeight)
	//});
}

function requestAcceptance(message) {
	var requestContainer = document.createElement("div");
	requestContainer.id = 'request-' + totalRequests
	requestContainer.style.top = '0'
	requestContainer.style.position = 'fixed'
	requestContainer.style.width = '100%'
	requestContainer.style.background = 'white'
	var mainContainer = document.getElementById("root");
	mainContainer.appendChild(requestContainer);
	return new Promise((resolve, reject) => {
		if (!calledPermission || userGivesPermission) {
			calledPermission = true
			if (userGivesPermission)
				resolve()
			else
				ReactDOM.render(<RequestAcceptance message={message} resolve={() => { userGivesPermission = true; resolve() }} reject={reject} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
					totalRequests++
					displayWidget(document.getElementById(requestContainer.id).clientHeight)
				});
		}
	});
}

function closeRequest() {
	totalRequests--
}
