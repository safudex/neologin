import connectToParent from 'penpal/lib/connectToParent';
import Neon, { u, api, sc, tx, wallet, CONST, settings } from "@cityofzion/neon-js";
import { server } from './config';
import React from 'react'
import ReactDOM from 'react-dom'
import LoginButton from './Views/LoginButton'
import UserData from './Views/UserData';
import RequestAcceptance from './Views/RequestAcceptance'
import RequestAcceptanceSend from './Views/RequestAcceptanceSend'
import RequestAcceptanceSignMessage from './Views/RequestAcceptanceSignMessage'
import { v4 as uuid } from 'uuid';
import RequestAcceptanceInvoke from './Views/RequestAcceptanceInvoke';
import RequestAcceptanceDeploy from './Views/RequestAcceptanceDeploy';

let acct = null;
let defaultNetwork = "MainNet";
const supportedNetworks = ["MainNet", "TestNet"];
settings.httpsOnly = true; // Ensure neon-js only talks to RPC endpoint (Neo node) using HTTPS

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

const unathenticatedMethods = ['getProvider', 'getNetworks', 'getBalance', 'getStorage', 'invokeRead', 'verifyMessage', 'getBlock', 'getBlockHeight', 'getTransaction', 'getApplicationLog'];
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

function getNetwork(network) {
	return network === undefined ? defaultNetwork : network;
}

const rpcUrls = {
	"MainNet": "https://seed4.cityofzion.io",
	"TestNet": "https://test4.cityofzion.io",
};
/*
 * Update networks so if the hard-coded ones are taken down or have downtime the rest continue working fine -> Commented because it leads to mixed content problems
supportedNetworks.map(network => {
	const provider = new api.neoscan.instance(network);
	provider.getRPCEndpoint()
		.then(nodeUrl => {
			rpcUrls[network] = nodeUrl;
		})
		.catch(e => e);
})
*/

// See https://github.com/CityOfZion/neon-js/blob/master/examples/browser/README.md
function rpcCall(call, args, network, constructResponse, unsupportedCall = false) {
	return new Promise(async (resolve, reject) => {
		try {
			const url = rpcUrls[getNetwork(network)];
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
		requestAcceptance('This dApp is requesting access to your NeoLogin wallet.').then(() => {
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
		requestAcceptance('This dApp is requesting access to your NeoLogin wallet.').then(() => {
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

// Does NOT need to be accepted
function getBalance(balanceArgs) {
	if (balanceArgs.params.constructor !== Array) {
		balanceArgs.params = [balanceArgs.params];
	}
	return new Promise(async (resolve, reject) => {
		const endpoint = neoscanEndpoints[getNetwork(balanceArgs.network)];
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
		resolve(final);
	})
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
			data: e,
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
		result: Neon.verify.message(messageHex, verifyArgs.data, verifyArgs.publicKey)
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

async function sendTransaction(transaction, broadcastOverride, network, resolve) {
	const txid = transaction.hash;
	if (broadcastOverride) {
		resolve({
			txid,
			signedTx: transaction.serialize()
		});
	} else {
		// Send raw transaction
		const nodeUrl = rpcUrls[getNetwork(network)];
		const client = Neon.create.rpcClient(nodeUrl);
		await client.sendRawTransaction(transaction);

		// Sucess!
		pendingTransactions[network].push(txid);
		resolve({
			txid,
			nodeUrl
		});
	}
}

// Needs to be accepted every time
// See https://cityofzion.io/neon-js/docs/en/examples/native_asset.html
function send(sendArgs) {
	return new Promise((resolve, reject) => {
		requestAcceptance()
			.then(() => {
				requestAcceptanceSend(sendArgs, 'This dApp has requested permission to send ' + sendArgs.amount + ' ' + sendArgs.asset + ' on ' + sendArgs.network + ' to ' + sendArgs.toAddress + ' with ' + (sendArgs.fee || 0) + ' GAS in fees. Accept?').then(async () => {
					if (sendArgs.fromAddress !== acct.address) {
						return reject({
							type: 'MALFORMED_INPUT',
							description: 'From address is not a properly formatted address.'
						});
					}
					let transaction;
					try {
						const endpoint = neoscanEndpoints[getNetwork(sendArgs.network)];
						const apiProvider = new api.neoscan.instance(endpoint);

						// Create contract transaction using Neoscan API
						let balance = await apiProvider.getBalance(sendArgs.fromAddress);
						transaction = Neon.create.contractTx();
						transaction = transaction.addIntent(sendArgs.asset, Number(sendArgs.amount), sendArgs.toAddress);
						if (sendArgs.remark) {
							transaction = transaction.addRemark(sendArgs.remark)
						}
						try {
							if (sendArgs.fee) {
								transaction = transaction.calculate(balance, null, Number(sendArgs.fee))
							} else {
								transaction = transaction.calculate(balance)
							}
						} catch (e) {
							reject({
								type: 'INSUFFICIENT_FUNDS',
								description: "Account doesn't have enough funds.",
							});
							return;
						}
						transaction = transaction.sign(acct.privateKey);
					} catch (e) {
						reject({
							type: 'MALFORMED_INPUT',
							description: "Some input provided was wrong.",
						});
						return;
					}

					try {
						await sendTransaction(transaction, sendArgs.broadcastOverride, sendArgs.network, resolve);
					} catch (e) {
						reject({
							type: 'SEND_ERROR',
							description: "There was an error when broadcasting this transaction to the network.",
						});
						return;
					}
				}).catch(() =>
					reject({
						type: 'CANCELED',
						description: 'There was an error when broadcasting this transaction to the network.',
					})
				)
			}).catch((e) => {
				reject({
					type: 'CANCELED',
					description: 'There was an error when broadcasting this transaction to the network.',
				});
			})
	});
}

// Needs to be accepted every time
// See https://cityofzion.io/neon-js/docs/en/examples/smart_contract.html
function invoke(invokeArgs) {
	let requestMessage = "This dApp has requested permission to invoke the smart contract at " + invokeArgs.scriptHash + ' on ' + getNetwork(invokeArgs.network);
	if (invokeArgs.assetIntentOverrides !== undefined) {
		requestMessage += ". The amount of GAS or NEO that will be spent on this transaction could not be estimated, please make sure that this is a legitimate transaction";
	} else if (invokeArgs.attachedAssets !== undefined) {
		requestMessage += " and send ";
		["NEO, GAS"].map((asset) => {
			if (invokeArgs.attachedAssets[asset]) {
				requestMessage += invokeArgs.attachedAssets[asset] + " " + asset + ",";
			}
		});
		requestMessage += " to it";
	}
	requestMessage += ' with ' + (invokeArgs.fee || 0) + ' GAS in fees. Accept?';
	return new Promise((resolve, reject) => {
		requestAcceptance()
			.then(() => {
				requestAcceptanceInvoke(invokeArgs, getNetwork(invokeArgs.network), (invokeArgs.assetIntentOverrides !== undefined))
					.then(async () => {
						let transaction;
						try {
							const endpoint = neoscanEndpoints[getNetwork(invokeArgs.network)];
							const apiProvider = new api.neoscan.instance(endpoint);

							// Create contract transaction using Neoscan API
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
							if (invokeArgs.triggerContractVerification) {
								transaction.addAttribute(
									tx.TxAttrUsage.Script,
									u.reverseHex(wallet.getScriptHashFromAddress(acct.address))
								);
							} else if (invokeArgs.assetIntentOverrides === undefined && invokeArgs.attachedAssets === undefined && (invokeArgs.fee === undefined || invokeArgs.fee === 0)) {
								transaction.addAttribute(
									tx.TxAttrUsage.Script,
									u.reverseHex(acct.scriptHash)
								);
							} else if (invokeArgs.assetIntentOverrides) {
								let txids = (balance.assets.GAS ? balance.assets.GAS.unspent : []).concat(balance.assets.NEO ? balance.assets.NEO.unspent : []).map(txx => txx.txid);
								let userTxs = invokeArgs.assetIntentOverrides.inputs.filter((input) => txids.includes(input.txid));
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
							if (invokeArgs.assetIntentOverrides) {
								invokeArgs.assetIntentOverrides.outputs.map(output => transaction.addOutput(new tx.TransactionOutput({
									assetId: CONST.ASSET_ID[output.asset],
									value: output.value,
									scriptHash: wallet.getScriptHashFromAddress(output.address)
								})));
								transaction.inputs = invokeArgs.assetIntentOverrides.inputs.map(input => (new tx.TransactionInput({
									prevHash: input.txid,
									prevIndex: input.index
								})));
							} else {
								if (invokeArgs.attachedAssets) {
									["NEO, GAS"].map((asset) => {
										if (invokeArgs.attachedAssets[asset]) {
											transaction = transaction.addIntent(asset, Number(invokeArgs.attachedAssets[asset]), wallet.getAddressFromScriptHash(invokeArgs.scriptHash));
										}
									});
								}
								try {
									if (invokeArgs.fee) {
										transaction = transaction.calculate(balance, null, Number(invokeArgs.fee))
									} else {
										transaction = transaction.calculate(balance)
									}
								} catch (e) {
									reject({
										type: 'INSUFFICIENT_FUNDS',
										description: "Account doesn't have enough funds.",
									});
									return;
								}
							}
							if (invokeArgs.txHashAttributes) {
								invokeArgs.txHashAttributes.map((attr) => {
									if (!attr.txAttrUsage.startsWith("Hash")) {
										return;
									}
									let paddedStr = u.str2hexstring(String(attr.value));
									let i = paddedStr.length;
									while (i++<64){
										paddedStr = "0" + paddedStr;
									}
									transaction.addAttribute(
										tx.TxAttrUsage[attr.txAttrUsage],
										u.reverseHex(paddedStr) //TODO: Do type conversion
									);
								});
							}
							transaction.sign(acct.privateKey);
							try {
								await sendTransaction(transaction, invokeArgs.broadcastOverride, invokeArgs.network, resolve);
							} catch (e) {
								reject({
									type: 'RPC_ERROR',
									description: "There was an error when broadcasting this transaction to the network.",
								});
								return;
							}
						} catch (e) {
							reject({
								type: 'MALFORMED_INPUT',
								description: "Some input provided was wrong.",
							});
							return;
						}

					})
					.catch(() =>
						reject({
							type: 'CANCELED',
							description: 'There was an error when broadcasting this transaction to the network.',
						})
					);
			}).catch((e) => reject(e))
	});
}

// Needs to be accepted every time
function invokeMulti(invokeMultiArgs) {
	return new Promise((resolve, reject) =>
		requestAcceptance("This dApp has requested permission to invoke a smart contract, this may spend some of your funds. Accept?")
			.then(() => {
				alert('sent!')
				//	foo().then(() => resolve({ ... })).catch(() => {
				//		reject({
				//			type: 'RPC_ERROR',
				//			description: 'There was an error when broadcasting this transaction to the network.',
				//			data: ''
				//		});
				//	})
			}).catch(() =>
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
	return new Promise((resolve, reject) =>
		requestAcceptance("This dApp wants to sign the message '" + signArgs.message + "' using your private key. Accept?")
			.then(() => {
				requestAcceptanceSignMessage(signArgs.message)
					.then(() => {
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
						} catch (e) {
							reject({
								type: 'UNKNOWN_ERROR',
								description: 'There was an unknown error.',
								data: ''
							})
						}
					}).catch(() => reject({
						type: 'CANCELED'
					}))
			}).catch((e) => reject(e))
	)
}

// Needs to be accepted every time
// See https://github.com/NeoResearch/neocompiler-eco/blob/master/public/js/eco-scripts/invoke_deploy_NeonJS.js
function deploy(deployArgs) {
	let sysGasFee = 100;
	if (deployArgs.needsStorage) {
		sysGasFee += 400;
	}
	if (deployArgs.dynamicInvoke) {
		sysGasFee += 500;
	}
	return new Promise((resolve, reject) => {
		requestAcceptance("This dApp has requested permission to deploy a smart contract on " + deployArgs.network + ". This will cost " + sysGasFee + " GAS in system costs and " + deployArgs.networkFee + " GAS in network fees. Accept?")
			.then(() => {
				requestAcceptanceDeploy(deployArgs, sysGasFee)
					.then(async () => {
						try {
							if (!deployArgs.code) {
								throw "ERROR (DEPLOY): Empty script (avm)!";
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

							let transaction;
							try {
								const endpoint = neoscanEndpoints[getNetwork(deployArgs.network)];
								const apiProvider = new api.neoscan.instance(endpoint);

								// Create contract transaction using Neoscan API
								let balance = await apiProvider.getBalance(acct.address);
								let transaction = new tx.InvocationTransaction({
									script: sb.str,
									gas: sysGasFee
								});

								transaction.addAttribute(
									tx.TxAttrUsage.Script,
									u.reverseHex(acct.scriptHash)
								);

								try {
									transaction = transaction.calculate(balance, null, Number(deployArgs.networkFee));
								} catch (e) {
									reject({
										type: 'INSUFFICIENT_FUNDS',
										description: "Account doesn't have enough funds.",
									});
									return;
								}
								transaction = transaction.sign(acct.privateKey);
							} catch (e) {
								reject({
									type: 'MALFORMED_INPUT',
									description: "Some input provided was wrong.",
								});
								return;
							}

							try {
								await sendTransaction(transaction, deployArgs.broadcastOverride, deployArgs.network, resolve);
							} catch (e) { // Should it be UNKNOWN_ERROR to maintain compatibility?
								reject({
									type: 'RPC_ERROR',
									description: "There was an error when broadcasting this transaction to the network.",
								});
								return;
							}
						} catch (e) {
							reject({
								type: 'UNKNOWN_ERROR',
								description: 'There was an unknown error.',
								data: ''
							})
						}
					}).catch(() => reject({
						type: 'CANCELED'
					}))
			}).catch((e) => reject(e))
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
	return new Promise((resolve, reject) => {
		if (!calledPermission || userGivesPermission) {
			calledPermission = true
			if (userGivesPermission)
				resolve()
			else {
				var requestContainer = createRequestContainer()
				ReactDOM.render(<RequestAcceptance
					message={"This dApp is requesting access to your NeoLogin wallet."}
					resolve={() => {
						userGivesPermission = true;
						connection.promise.then(parent =>
							parent.sendEvent('CONNECTED', { address: acct.address, label: "My Spending Wallet" }));
						resolve()
					}}
					reject={reject}
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

function requestAcceptanceSend(sendArgs, message) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceSend sendArgs={sendArgs} resolve={() => { userGivesPermission = true; connection.promise.then(parent => parent.sendEvent('CONNECTED', { address: acct.address, label: "My Spending Wallet" })); resolve() }} reject={reject} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function requestAcceptanceSignMessage(message) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceSignMessage message={message} resolve={() => { userGivesPermission = true; connection.promise.then(parent => parent.sendEvent('CONNECTED', { address: acct.address, label: "My Spending Wallet" })); resolve() }} reject={reject} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function requestAcceptanceInvoke(invokeArgs, network, goodEstimation) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceInvoke goodEstimation={goodEstimation} invokeArgs={invokeArgs} network={network} resolve={() => { userGivesPermission = true; connection.promise.then(parent => parent.sendEvent('CONNECTED', { address: acct.address, label: "My Spending Wallet" })); resolve() }} reject={reject} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function requestAcceptanceDeploy(deployArgs, sysGasFee) {
	return new Promise((resolve, reject) => {
		var requestContainer = createRequestContainer()
		ReactDOM.render(<RequestAcceptanceDeploy sysGasFee={sysGasFee} deployArgs={deployArgs} resolve={() => { userGivesPermission = true; connection.promise.then(parent => parent.sendEvent('CONNECTED', { address: acct.address, label: "My Spending Wallet" })); resolve() }} reject={reject} closeWidget={() => { calledPermission = false; closeWidget() }} closeRequest={closeRequest} contid={requestContainer.id} />, document.getElementById(requestContainer.id), () => {
			displayRequest(requestContainer)
		});
	});
}

function createRequestContainer() {
	console.log('called')
	var requestContainer = document.createElement("div");
	requestContainer.id = 'request-' + totalRequests
	requestContainer.style.top = '0'
	requestContainer.style.position = 'fixed'
	requestContainer.style.width = '100%'
	requestContainer.style.background = 'white'
	var mainContainer = document.getElementById("root");
	mainContainer.appendChild(requestContainer);
	return requestContainer;
}

function displayRequest(requestContainer) {
	totalRequests++
	window.setTimeout(() => displayWidget(document.getElementById(requestContainer.id).clientHeight), 10)
}

function closeRequest() {
	totalRequests--
}
