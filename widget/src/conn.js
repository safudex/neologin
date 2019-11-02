import connectToParent from 'penpal/lib/connectToParent';
import Neon, { u, api, sc, tx, wallet, CONST, settings } from "@cityofzion/neon-js";
import { server } from './config';
import React from 'react'
import ReactDOM from 'react-dom'
import LoginButton from './Views/LoginButton'
import RequestAcceptance from './Views/RequestAcceptance'
import RequestAcceptanceSend from './Views/RequestAcceptanceSend'
import RequestAcceptanceSignMessage from './Views/RequestAcceptanceSignMessage'
import { v4 as uuid } from 'uuid';
import RequestAcceptanceInvoke from './Views/RequestAcceptanceInvoke';
import RequestAcceptanceDeploy from './Views/RequestAcceptanceDeploy';
import InsufficientFunds from './Views/InsufficientFunds';
import RequestAcceptanceInvokeMulti from './Views/RequestAcceptanceInvokeMulti';
import { default as encryptRaw } from './crypt/encrypt';
import { default as decryptRaw } from './crypt/decrypt';

let acct = null;
let defaultNetwork = "MainNet";
const supportedNetworks = ["MainNet", "TestNet"];
settings.httpsOnly = true; // Ensure neon-js only talks to RPC endpoint (Neo node) using HTTPS

let totalRequests = 0
let calledLogin = false
let calledPermission = false
let userGivesPermission = false

function getNetwork(network) {
	return network === undefined ? defaultNetwork : network;
}

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
	encrypt,
	decrypt,
	disconnect,
	//Methods implemented in the client SDK
	//addEventListener,
	//removeEventListener
};

let methods = {};

const unathenticatedMethods = ['getProvider', 'getNetworks', 'getBalance', 'getStorage', 'invokeRead', 'verifyMessage', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog', 'disconnect'];
const requireNetworkCheckMethods = ['getBalance', 'getStorage', 'invokeRead', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog', 'send', 'invoke', 'invokeMulti', 'deploy'];

Object.keys(rawMethods).map((key) => {
	methods[key] = (...args) => {
		if (requireNetworkCheckMethods.includes(key)) {
			if (args[0].network !== undefined && !supportedNetworks.includes(args[0].network)) {
				return Promise.reject({
					"type": "INVALID_NETWORK",
					"description": "This network is not supported."
				});
			}
			args[0].network = getNetwork(args[0].network);
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

let pendingTransactions = {
	MainNet: [],
	TestNet: []
};

let lastBlockHeight = {
	MainNet: 0,
	TestNet: 0
};

connection.promise.then(parent => {
	parent.sendEvent('READY', providerInfo);

	//TODO: Add event listeners for CONNECTED, BLOCK_HEIGHT_CHANGED and TRANSACTION_CONFIRMED
	supportedNetworks.map(async network => {
		lastBlockHeight[network] = (await getBlockHeight({ network })).result;
		setInterval(() => {
			getBlock({
				network,
				blockHeight: lastBlockHeight[network] + 1
			})
				.then(block => {
					lastBlockHeight[network] = block.index;
					parent.sendEvent('BLOCK_HEIGHT_CHANGED', {
						network,
						blockHeight: block.index,
						blockTime: block.time,
						blockHash: block.hash,
						tx: block.tx
					});
					const txids = block.tx.map(txx => txx.txid.substr(2));
					pendingTransactions[network] = pendingTransactions[network].filter(pendingTx => {
						if (txids.includes(pendingTx)) {
							parent.sendEvent('TRANSACTION_CONFIRMED', {
								txid: pendingTx,
								blockHeight: block.index,
							});
							return false;
						} else {
							return true;
						}
					});
				})
				.catch(e => e);
		}, 1000); // Run every second
	});
});

let backlogCalledSignIn = [];

function signIn() {
	return new Promise((resolve, reject) => {
		backlogCalledSignIn.push({ resolve, reject });
		if (!calledLogin) {

			calledLogin = true
			let storedPrivkey = window.localStorage.getItem('privkey');
			if (storedPrivkey === null) {
				window.addEventListener("message",
					(event) => {

						if (event.origin !== server || !event.data.privkey) {
							return;
						}
						acct = Neon.create.account(event.data.privkey);
						if (event.data.rememberMe) {
							// Store privkey in localStore and restore later 
							window.localStorage.setItem('privkey', event.data.privkey);
						}
						successfulSignIn(acct)
					},
					false
				);
				showLoginButton(reject);
			} else {
				acct = Neon.create.account(storedPrivkey);
				successfulSignIn(acct)
			}
		}
	});
}

async function disconnect() {
	if(acct === null){
		throw "User has not logged in";
	}
	window.localStorage.removeItem('privkey');
	acct = null;
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

const rpcUrls = {
	"MainNet": "https://seed4.cityofzion.io",
	"TestNet": "https://test4.cityofzion.io",
};

//Update networks so if the hard-coded ones are taken down or have downtime the rest continue working fine -> Commented because it leads to mixed content problems
supportedNetworks.map(network => {
	const provider = new api.neoscan.instance(network);
	provider.getRPCEndpoint()
		.then(nodeUrl => {
			rpcUrls[network] = nodeUrl;
		})
		.catch(e => e);
})


// See https://github.com/CityOfZion/neon-js/blob/master/examples/browser/README.md
function rpcCall(call, args, network, constructResponse, unsupportedCall = false) {
	return new Promise(async (resolve, reject) => {
		try {
			const url = rpcUrls[network];
			const client = Neon.create.rpcClient(url);
			let result;
			if (unsupportedCall) {
				const query = Neon.create.query({ method: call, params: args });
				result = await query.execute(url);
			} else {
				result = await client[call](...args);
			}
			resolve(constructResponse(result));
		} catch (e) {
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
		requestAcceptance().then(() => {
			resolve({
				address: acct.address,
				label: 'My Spending Wallet'
			})
		}).catch((e) => {
			reject(e);
		})
	})
}

// Needs to be accepted once
function getPublicKey() {
	return new Promise((resolve, reject) => {
		requestAcceptance().then(() => {
			resolve({
				address: acct.address,
				publicKey: acct.publicKey
			})
		}).catch((e) => {
			reject(e);
		})
	})
}

const neoscanEndpoints = {
	"MainNet": "https://api.neoscan.io/api/main_net",
	"TestNet": "https://neoscan-testnet.io/api/test_net"
};

function getApiProvider(network) {
	const endpoint = neoscanEndpoints[network];
	const apiProvider = new api.neoscan.instance(endpoint);
	return { endpoint, apiProvider };
}

// Does NOT need to be accepted
async function getBalance(balanceArgs) {
	try {
		if (balanceArgs.params.constructor !== Array) {
			balanceArgs.params = [balanceArgs.params];
		}
		const { endpoint } = getApiProvider(balanceArgs.network);
		let balances = await Promise.all(
			balanceArgs.params.map(
				(param) => fetch(endpoint + "/v1/get_balance/" + param.address)
					.then(res => res.json())
					.then(res => {
						let balance = [];
						for (let i = 0; i < res.balance.length; i++) {
							if (param.assets === undefined || param.assets.includes(res.balance[i].asset_symbol)) {
								let newAsset = {
									assetID: res.balance[i].asset_hash,
									symbol: res.balance[i].asset_symbol,
									amount: String(res.balance[i].amount),
								};
								if (param.fetchUTXO) {
									newAsset.unspent = res.balance[i].unspent.map((utxo) => (utxo.value = String(utxo.value), utxo)); // Convert type of value field from Number to String
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
		for (let i = 0; i < balances.length; i++) {
			final[balances[i].address] = balances[i].balance;
		}
		return final;
	} catch (e) {
		throw {
			type: "MALFORMED_INPUT",
			description: "An error was encountered when processing this account."
		};
	}
}

// Does NOT need to be accepted
function getStorage(storageArgs) {
	return rpcCall("getStorage", [storageArgs.scriptHash, storageArgs.key], storageArgs.network, (res) => { return { result: (res === null ? "" : res) } });
}

// Does NOT need to be accepted
function invokeRead(invokeArgs) {
	let script = "";
	try {
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
		});
	}

	return rpcCall("invokeScript", [script], invokeArgs.network, res => res);
}

// Does NOT need to be accepted
function verifyMessage(verifyArgs) {
	const parameterHexString = u.str2hexstring(verifyArgs.message);
	const lengthHex = u.num2VarInt(parameterHexString.length / 2);
	const concatenatedString = lengthHex + parameterHexString;
	const messageHex = '010001f0' + concatenatedString + '0000';
	return Promise.resolve({
		result: Neon.verify.hex(messageHex, verifyArgs.data, verifyArgs.publicKey)
	});
}

// Does NOT need to be accepted
function getBlock(blockArgs) {
	return rpcCall("getBlock", [blockArgs.blockHeight], blockArgs.network, (res) => res);
}

// Does NOT need to be accepted
function getBlockHeight(blockHeightArgs) {
	return rpcCall("getBlockCount", [], blockHeightArgs.network, (res) => { return { result: res } });
}

// Does NOT need to be accepted
function getTransaction(txArgs) {
	return rpcCall("getRawTransaction", [txArgs.txid], txArgs.network, (res) => res);
}

// Does NOT need to be accepted
function getApplicationLog(appLogArgs) {
	return rpcCall("getapplicationlog", [appLogArgs.txid], appLogArgs.network, (res) => res.result, true);
}

async function sendTransaction(transaction, broadcastOverride, network) {
	try {
		const txid = transaction.hash;
		if (broadcastOverride) {
			return {
				txid,
				signedTx: transaction.serialize()
			};
		} else {
			// Send raw transaction
			const nodeUrl = rpcUrls[network];
			const client = Neon.create.rpcClient(nodeUrl);
			await client.sendRawTransaction(transaction);

			// Sucess!
			pendingTransactions[network].push(txid);
			return {
				txid,
				nodeUrl
			};
		}
	} catch {
		throw {
			type: 'RPC_ERROR',
			description: "There was an error when broadcasting this transaction to the network.",
		};
	}
}

function processGeneralError(error, defaultError = { type: 'MALFORMED_INPUT', description: "Some input provided was wrong." }) {
	if (error && error.type) { // If the error has been created by ourselves let it pass
		throw error;
	} else {
		throw defaultError;
	}
}

// Needs to be accepted every time
// See https://cityofzion.io/neon-js/docs/en/examples/native_asset.html
async function send(sendArgs) {
	await requestAcceptance();
	await requestAcceptanceSend(sendArgs);
	try {
		if (sendArgs.fromAddress !== acct.address) {
			throw {
				type: 'MALFORMED_INPUT',
				description: 'From address is not a properly formatted address.'
			};
		}
		const { endpoint, apiProvider } = getApiProvider(sendArgs.network);
		let balance = await apiProvider.getBalance(sendArgs.fromAddress);
		let transaction = Neon.create.contractTx();
		transaction = transaction.addIntent(sendArgs.asset, Number(sendArgs.amount), sendArgs.toAddress);
		if (sendArgs.remark) {
			transaction = transaction.addRemark(sendArgs.remark)
		}
		calculateUTXOs(transaction, balance, sendArgs.fee);
		transaction = transaction.sign(acct.privateKey);

		try {
			return await sendTransaction(transaction, sendArgs.broadcastOverride, sendArgs.network);
		} catch (e) {
			throw { //Overwrite the error generated by sendTransaction
				type: 'SEND_ERROR',
				description: "There was an error when broadcasting this transaction to the network.",
			};
		}
	} catch (e) {
		processGeneralError(e);
	}
}

function calculateUTXOs(transaction, balance, fee) {
	try {
		if (fee) {
			return transaction.calculate(balance, null, Number(fee))
		} else {
			return transaction.calculate(balance)
		}
	} catch (e) {
		displayInsufficientFundsView();
		throw {
			type: 'INSUFFICIENT_FUNDS',
			description: "Account doesn't have enough funds.",
		};
	}
}

function addScriptAttribute(transaction, triggerContractVerification, assetIntentOverrides, attachedAssets, fee, balance) {
	if (triggerContractVerification) {
		transaction.addAttribute(
			tx.TxAttrUsage.Script,
			u.reverseHex(wallet.getScriptHashFromAddress(acct.address))
		);
	} else if (assetIntentOverrides === undefined && attachedAssets === undefined && (fee === undefined || fee === 0)) {
		transaction.addAttribute(
			tx.TxAttrUsage.Script,
			u.reverseHex(acct.scriptHash)
		);
	} else if (assetIntentOverrides) {
		let txids = (balance.assets.GAS ? balance.assets.GAS.unspent : []).concat(balance.assets.NEO ? balance.assets.NEO.unspent : []).map(txx => txx.txid);
		let userTxs = assetIntentOverrides.inputs.filter((input) => txids.includes(input.txid));
		if (userTxs.length === 0) {
			transaction.addAttribute(
				tx.TxAttrUsage.Script,
				u.reverseHex(acct.scriptHash)
			);
		} else {
			transaction.addAttribute(
				tx.TxAttrUsage.Script,
				u.reverseHex(acct.scriptHash)
			);
		}
	} else {
		transaction.addAttribute(
			tx.TxAttrUsage.Script,
			u.reverseHex(acct.scriptHash)
		);
	}
}

function addExplicitIntents(transaction, assetIntentOverrides) {
	assetIntentOverrides.outputs.map(output =>
		transaction.addOutput(
			new tx.TransactionOutput({
				assetId: CONST.ASSET_ID[output.asset],
				value: output.value,
				scriptHash: wallet.getScriptHashFromAddress(output.address)
			})
		));
	transaction.inputs = assetIntentOverrides.inputs.map(input =>
		new tx.TransactionInput({
			prevHash: input.txid,
			prevIndex: input.index
		}));
}

function addHashAttributes(transaction, txHashAttributes) {
	txHashAttributes.map((attr) => {
		if (!attr.txAttrUsage.startsWith("Hash")) {
			throw {
				type: "MALFORMED_INPUT",
				description: `${attr.txAttrUsage} is not a hash attribute.`
			};
		}
		let parsedValue = zeroPad(attr.value, 64, true);
		switch (attr.type) {
			case "Boolean":
				parsedValue = zeroPad(!!attr.value ? 0x51 : 0x00, 64, true);
				break;
			case "Address":
				parsedValue = zeroPad(u.reverseHex(wallet.getScriptHashFromAddress(attr.value)), 64, true);
				break;
			case "Integer":
				const h = Number(attr.value).toString(16);
				parsedValue = zeroPad(u.reverseHex(h.length % 2 ? '0' + h : h), 64, true);
				break;
			case "String":
				parsedValue = zeroPad(str2hex(attr.value), 64, true);
				break;
		}
		transaction.addAttribute(
			tx.TxAttrUsage[attr.txAttrUsage],
			parsedValue
		);
	});

	function zeroPad(input, length, padEnd = false) {
		const zero = '0';
		input = String(input);
		if (padEnd) {
			return input + zero.repeat(length - input.length);
		}
		return zero.repeat(length - input.length) + input;
	}

	function str2hex(str) {
		var arr = [];
		for (var i = 0, l = str.length; i < l; i++) {
			var hex = Number(str.charCodeAt(i)).toString(16);
			arr.push(hex.length > 1 && hex || "0" + hex);
		}
		return arr.join('');
	}
}

function addAssets(transaction, attachedAssets, scriptHash) {
	["NEO, GAS"].map((asset) => {
		if (attachedAssets[asset]) {
			transaction = transaction.addIntent(asset, Number(attachedAssets[asset]), wallet.getAddressFromScriptHash(scriptHash));
		}
	});
}

// Needs to be accepted every time
// See https://cityofzion.io/neon-js/docs/en/examples/smart_contract.html
async function invoke(invokeArgs) {
	await requestAcceptance();
	await requestAcceptanceInvoke(invokeArgs, invokeArgs.network, (invokeArgs.assetIntentOverrides !== undefined));
	try {
		const { endpoint, apiProvider } = getApiProvider(invokeArgs.network);
		let balance = await apiProvider.getBalance(acct.address);
		const script = Neon.create.script({
			scriptHash: invokeArgs.scriptHash,
			operation: invokeArgs.operation,
			args: invokeArgs.args
		});
		let transaction = new tx.InvocationTransaction({
			script: script,
			gas: 0
		});
		addScriptAttribute(transaction, invokeArgs.triggerContractVerification, invokeArgs.assetIntentOverrides, invokeArgs.attachedAssets, invokeArgs.fee, balance);
		if (invokeArgs.assetIntentOverrides) {
			addExplicitIntents(transaction, invokeArgs.assetIntentOverrides);
		} else {
			if (invokeArgs.attachedAssets) {
				addAssets(transaction, invokeArgs.attachedAssets, invokeArgs.scriptHash);
			}
			calculateUTXOs(transaction, balance, invokeArgs.fee);
		}
		if (invokeArgs.txHashAttributes) {
			addHashAttributes(transaction, invokeArgs.txHashAttributes);
		}
		transaction.sign(acct.privateKey);
		return await sendTransaction(transaction, invokeArgs.broadcastOverride, invokeArgs.network);
	} catch (e) {
		processGeneralError(e);
	}
}

// Needs to be accepted every time
async function invokeMulti(invokeMultiArgs) {
	await requestAcceptance()
	await requestAcceptanceInvokeMulti(invokeMultiArgs, (invokeMultiArgs.assetIntentOverrides !== undefined));
	try {
		const { endpoint, apiProvider } = getApiProvider(invokeMultiArgs.network);
		let balance = await apiProvider.getBalance(acct.address);
		const script = Neon.create.script(...invokeMultiArgs.invokeArgs.map(arg => ({
			scriptHash: arg.scriptHash,
			operation: arg.operation,
			args: arg.args
		})));
		let transaction = new tx.InvocationTransaction({
			script: script,
			gas: 0
		});
		invokeMultiArgs.invokeArgs.map(arg =>
			addScriptAttribute(transaction, arg.triggerContractVerification, invokeMultiArgs.assetIntentOverrides, arg.attachedAssets, invokeMultiArgs.fee, balance)
		);
		if (invokeMultiArgs.assetIntentOverrides) {
			addExplicitIntents(transaction, invokeMultiArgs.assetIntentOverrides);
		} else {
			invokeMultiArgs.invokeArgs.map(arg => {
				if (arg.attachedAssets) {
					addAssets(transaction, arg.attachedAssets, arg.scriptHash);
				}
			});
			calculateUTXOs(transaction, balance, invokeMultiArgs.fee);
		}
		if (invokeMultiArgs.txHashAttributes) {
			addHashAttributes(transaction, invokeMultiArgs.txHashAttributes);
		}
		transaction.sign(acct.privateKey);
		return await sendTransaction(transaction, invokeMultiArgs.broadcastOverride, invokeMultiArgs.network);
	} catch (e) {
		processGeneralError(e);
	}
}

// Needs to be accepted every time
async function signMessage(signArgs) {
	await requestAcceptance();
	await requestAcceptanceSignMessage(signArgs.message);
	try {
		const salt = uuid().replace(/-/g, '');
		const parameterHexString = u.str2hexstring(salt + signArgs.message);
		const lengthHex = u.num2VarInt(parameterHexString.length / 2);
		const concatenatedString = lengthHex + parameterHexString;
		const messageHex = '010001f0' + concatenatedString + '0000';
		const signedMessage = Neon.sign.hex(messageHex, acct.privateKey);

		return {
			publicKey: acct.publicKey, // Public key of account that signed message
			message: signArgs.message, // Original message signed
			salt: salt, // Salt added to original message as prefix, before signing
			data: signedMessage, // Signed message
		};
	} catch (e) {
		throw {
			type: 'UNKNOWN_ERROR',
			description: 'There was an unknown error.',
		};
	}
}

// Needs to be accepted every time
// See https://github.com/NeoResearch/neocompiler-eco/blob/master/public/js/eco-scripts/invoke_deploy_NeonJS.js
async function deploy(deployArgs) {
	let sysGasFee = 100;
	if (deployArgs.needsStorage) {
		sysGasFee += 400;
	}
	if (deployArgs.dynamicInvoke) {
		sysGasFee += 500;
	}
	await requestAcceptance();
	await requestAcceptanceDeploy(deployArgs, sysGasFee);
	try {
		if (!deployArgs.code) {
			throw {
				type: 'MALFORMED_INPUT',
				description: "ERROR (DEPLOY): Empty script (avm)!"
			};
		}
		const sb = Neon.create.scriptBuilder();
		sb.emitPush(u.str2hexstring(deployArgs.description)) // description
			.emitPush(u.str2hexstring(deployArgs.email)) // email
			.emitPush(u.str2hexstring(deployArgs.author)) // author
			.emitPush(u.str2hexstring(deployArgs.version)) // code_version
			.emitPush(u.str2hexstring(deployArgs.name)) // name
			.emitPush(0x00 | (deployArgs.needsStorage ? 0x01 : 0x00) | (deployArgs.dynamicInvoke ? 0x02 : 0x00) | (deployArgs.isPayable ? 0x04 : 0x00)) // storage: {none: 0x00, storage: 0x01, dynamic: 0x02, storage+dynamic:0x03}
			.emitPush(deployArgs.returnType) // expects hexstring  (_emitString) // usually '05'
			.emitPush(deployArgs.parameterList) // expects hexstring  (_emitString) // usually '0710'
			.emitPush(deployArgs.code) //script
			.emitSysCall('Neo.Contract.Create');

		const { endpoint, apiProvider } = getApiProvider(deployArgs.network);

		let balance = await apiProvider.getBalance(acct.address);
		let transaction = new tx.InvocationTransaction({
			script: sb.str,
			gas: sysGasFee
		});

		transaction.addAttribute(
			tx.TxAttrUsage.Script,
			u.reverseHex(acct.scriptHash)
		);

		calculateUTXOs(transaction, balance, deployArgs.networkFee);
		transaction = transaction.sign(acct.privateKey);

		return await sendTransaction(transaction, deployArgs.broadcastOverride, deployArgs.network);
	} catch (e) {
		processGeneralError(e, {
			type: 'UNKNOWN_ERROR',
			description: 'There was an unknown error.',
		});
	}
}

async function encrypt({ recipientPublicKey, data }) {
	await requestAcceptance();
	try {
		return encryptRaw({ recipientPublicKey, 'wif': wallet.getWIFFromPrivateKey(acct.privateKey), data })
	} catch (error) {
		processGeneralError(error)
	}
}

async function decrypt({ senderPublicKey, iv, mac, data }) {
	await requestAcceptance();
	try {
		let bufferData = decryptRaw({ senderPublicKey, 'wif': wallet.getWIFFromPrivateKey(acct.privateKey), iv, mac, data })
		return {
			bufferData: bufferData,
			data: new TextDecoder("utf-8").decode(bufferData)
		}
	} catch (error) {
		if (error.message.includes('Bad MAC'))
			throw ({ type: 'BAD_MAC', description: error.message })
		else
			processGeneralError(error)
	}
}

function closeWidget() {
	connection.promise.then((parent) => parent.closeWidget())
}

function displayWidget(wheight) {
	connection.promise.then((parent) => parent.displayWidget(wheight))
}

function showLoginButton(reject) {
	const rejectError = {
		type: 'CONNECTION_DENIED',
		description: 'The user rejected the request to connect with your dApp.',
	}
	ReactDOM.render(
		<LoginButton closeWidget={() => { reject(rejectError); closeWidget(); calledLogin = false; }} />,
		document.getElementById('content'),
		() => displayWidget(document.getElementById('content').clientHeight)
	);
}

function successfulSignIn(account) {
	ReactDOM.unmountComponentAtNode(window.document.getElementById('content'))
	closeWidget()
	backlogCalledSignIn.map(({ resolve }) => resolve());
	backlogCalledSignIn = [];
	calledLogin = false;
}

let backlogRequestedAcceptance = [];

function requestAcceptance() {
	return new Promise((resolve, reject) => {
		backlogRequestedAcceptance.push({ resolve, reject });
		if (!calledPermission || userGivesPermission) {
			calledPermission = true
			if (userGivesPermission)
				resolve()
			else {
				var requestContainer = createRequestContainer()
				ReactDOM.render(<RequestAcceptance
					resolve={() => {
						userGivesPermission = true;
						connection.promise.then(parent =>
							parent.sendEvent('CONNECTED', { address: acct.address, label: "My Spending Wallet" }));
						backlogRequestedAcceptance.map(({ resolve }) => resolve());
					}}
					reject={(error) => {
						backlogRequestedAcceptance.map(({ reject }) => reject(error));
						backlogRequestedAcceptance = [];
					}}
					closeWidget={() => { calledPermission = false; closeWidget() }}
					closeRequest={closeRequest}
					contid={requestContainer.id}
				/>, document.getElementById(requestContainer.id), () => {
					displayRequest(requestContainer)
				})
			}
		}
	});
}

const failedAcceptanceRequestError = {
	type: 'CANCELED',
	description: 'The user rejected the transaction.'
};

function requestAcceptanceSend(sendArgs) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceSend sendArgs={sendArgs} resolve={resolve} reject={() => reject(failedAcceptanceRequestError)} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function displayInsufficientFundsView() {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<InsufficientFunds address={acct.address} privkey={acct.privateKey} reject={() => reject(failedAcceptanceRequestError)} closeWidget={() => { closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function requestAcceptanceSignMessage(message) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceSignMessage message={message} resolve={resolve} reject={() => reject(failedAcceptanceRequestError)} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function requestAcceptanceInvoke(invokeArgs, network, goodEstimation) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceInvoke goodEstimation={goodEstimation} invokeArgs={invokeArgs} network={network} resolve={resolve} reject={() => reject(failedAcceptanceRequestError)} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function requestAcceptanceInvokeMulti(invokeMultiArgs, goodEstimation) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceInvokeMulti goodEstimation={goodEstimation} invokeMultiArgs={invokeMultiArgs} resolve={resolve} reject={() => reject(failedAcceptanceRequestError)} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} updateWidgetHeight={(h) => connection.promise.then((parent) => parent.updateWidgetHeight(h))} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function requestAcceptanceDeploy(deployArgs, sysGasFee) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceDeploy sysGasFee={sysGasFee} deployArgs={deployArgs} resolve={resolve} reject={() => reject(failedAcceptanceRequestError)} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function createRequestContainer() {
	var requestContainer = document.createElement("div");
	requestContainer.id = 'request-' + totalRequests
	let containerStyle = {
		top: '0',
		position: 'fixed',
		width: '100%',
		background: 'white',
	}
	for (let style in containerStyle) {
		requestContainer.style[style] = containerStyle[style];
	}
	var mainContainer = document.getElementById("root");
	mainContainer.appendChild(requestContainer);
	return requestContainer;
}

function displayRequest(requestContainer) {
	displayWidget(document.getElementById(requestContainer.id).clientHeight)
	totalRequests++
}

function closeRequest() {
	totalRequests--
}

const observer = new MutationObserver((mutationsList, observer) => {
	const container = document.getElementById('request-' + (totalRequests - 1)) || document.getElementById('content');
	displayWidget(container ? container.clientHeight : 0);
});
observer.observe(document.getElementById("root"), {
	attributes: true,
	childList: true,
	subtree: true
});
