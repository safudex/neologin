// THE GENESIS: https://github.com/ConjurTech/switcheo-api-examples
// THE BIBLE: https://docs.switcheo.network
const { getTimestamp, signParams, signTransaction, toAssetAmount, getScriptHashFromAddress } = require('./switcheo/utils')
const { API_URL, CONTRACT_HASH } = require('./switcheo/config')
const api = require('./switcheo/api')
const io = require('socket.io-client')
const WEBSOCKET_URL = "wss://ws.switcheo.io"

function getOrderBook(pair) {
	const apiParams = { pair }
	return api.get('https://api.switcheo.network/v2' + '/offers/book', apiParams).then(res => res.body)
}

function createDeposit({ blockchain, address, asset_id, amount, privateKey }) {
	const signableParams = {
		amount,
		asset_id,
		blockchain,
		contract_hash: CONTRACT_HASH,
		timestamp: getTimestamp()
	}
	const signature = signParams(signableParams, privateKey)
	const apiParams = { ...signableParams, address, signature }
	return api.post(API_URL + '/deposits', apiParams).then(res => res.body)
}

function executeDeposit({ deposit, privateKey }) {
	const signature = signTransaction(deposit.transaction, privateKey)
	const url = `${API_URL}/deposits/${deposit.id}/broadcast`
	return api.post(url, { signature })
}

function listBalances({ addresses }) {
	const params = { addresses, contract_hashes: [CONTRACT_HASH] }
	return api.get(API_URL + '/balances', params)
}

function sleep(s) {
	return new Promise(resolve => setTimeout(resolve, s * 1000));
}

function createOrder({ pair, blockchain, side, price,
	quantity, useNativeTokens, orderType,
	privateKey, address }) {
	const signableParams = {
		pair,
		blockchain,
		side,
		price,
		quantity: toAssetAmount(quantity, 'GAS'),
		use_native_tokens: useNativeTokens,
		order_type: orderType,
		timestamp: getTimestamp(),
		contract_hash: CONTRACT_HASH,
	}
	const signature = signParams(signableParams, privateKey)
	const apiParams = { ...signableParams, address, signature }
	return api.post(API_URL + '/orders', apiParams).then(res => res.body)
}

function signArray(array, privateKey) {
	return array.reduce((map, item) => {
		map[item.id] = signTransaction(item.txn, privateKey)
		return map
	}, {})
}

function broadcastOrder({ order, privateKey }) {
	const { fills, makes } = order
	const signatures = {
		fills: signArray(order.fills, privateKey),
		makes: signArray(order.makes, privateKey)
	}
	const url = `${API_URL}/orders/${order.id}/broadcast`
	return api.post(url, { signatures })
}

function createWithdrawal({ blockchain, address, asset_id, amount, privateKey }) {
	const signableParams = {
		blockchain, asset_id, amount,
		contract_hash: CONTRACT_HASH, timestamp: getTimestamp()
	}
	const signature = signParams(signableParams, privateKey)
	const apiParams = { ...signableParams, address, signature }
	return api.post(API_URL + '/withdrawals', apiParams)
}

function executeWithdrawal({ withdrawal, privateKey }) {
	const signableParams = { id: withdrawal.id, timestamp: getTimestamp() }
	const signature = signParams(signableParams, privateKey)
	const url = `${API_URL}/withdrawals/${withdrawal.id}/broadcast`
	return api.post(url, { ...signableParams, signature })
}

async function getActualGASBalance(address) {
	return (await listBalances({ addresses: [address] })).body.confirmed.GAS
}

async function wait4newBalanceGAS(address, amount) {
	let contractBalanceGAS = (await listBalances({ addresses: [address] })).body.confirmed.GAS;

	while (contractBalanceGAS < amount) {
		await sleep(0.5)
		contractBalanceGAS = (await listBalances({ addresses: [address] })).body.confirmed.NEO;
	}
}

async function depositNEO(address, privateKey, amount) {
	let contractBalanceNEO = (await listBalances({ addresses: [address] })).body.confirmed.NEO;

	// Create deposit
	const deposit = await createDeposit({
		blockchain: 'neo',
		address,
		asset_id: 'NEO',
		amount,
		privateKey
	});

	// Execute neo deposit
	await executeDeposit({ deposit, privateKey })

	// Wait for deposit to complete
	while (contractBalanceNEO < amount) {
		await sleep(0.5)
		contractBalanceNEO = (await listBalances({ addresses: [address] })).body.confirmed.NEO;
	}
}

async function depositGAS(address, privateKey, amount) {
	let contractBalanceGAS = (await listBalances({ addresses: [address] })).body.confirmed.GAS;
	contractBalanceGAS = contractBalanceGAS ? contractBalanceGAS : 0
	console.log('contractBalanceGAS', contractBalanceGAS, CONTRACT_HASH)
	// Create deposit
	const deposit = await createDeposit({
		blockchain: 'neo',
		address,
		asset_id: 'GAS',
		amount: toAssetAmount(amount, 'GAS'),
		privateKey
	});

	// Execute gas deposit
	await executeDeposit({ deposit, privateKey })

	// Wait for deposit to complete
	while (contractBalanceGAS < amount) {
		await sleep(0.5)
		contractBalanceGAS = (await listBalances({ addresses: [address] })).body.confirmed.GAS;
		console.log('contractBalanceGAS', contractBalanceGAS)
	}
}

async function withdraw(address, privateKey, amount, asset) {
	// Create withdrawal
	const withdrawal = await createWithdrawal({
		blockchain: 'neo',
		address,
		asset_id: asset,
		amount,
		privateKey
	})

	// Execute withdrawal
	await executeWithdrawal({ withdrawal, privateKey })

	// Wait for withdrawal to finish
	const oldBalance = (await listBalances({ addresses: [address] })).body.confirmed[asset];
	let contractBalance = oldBalance
	while (contractBalance == oldBalance) {
		await sleep(0.5)
		contractBalance = (await listBalances({ addresses: [address] })).body.confirmed[asset];
	}
}

function createPromisedOrder(address, pair) {
	return new Promise((resolve, reject) => {
		const socketClient = io(`${WEBSOCKET_URL}/orders`)
		socketClient.on('connection', function (socket) {
			socket.join({
				contract_hash: CONTRACT_HASH,
				pair: pair,
				address
			})
			socket.on('updates', ({ events }) => {
				events.forEach(event => {
					resolve(event.orders[0].filledAmount) //TODO: Test
				})
			});
		});
	})
}

async function tradeNEO2GAS(address, privateKey, amount, filledOrder) {
	// Create order
	const order = await createOrder({
		pair: 'GAS_NEO',
		blockchain: 'neo',
		address,
		side: 'buy',
		price: null,
		quantity: amount,
		useNativeTokens: false,
		orderType: 'market',
		privateKey
	})

	// Execute order
	await broadcastOrder({ order, privateKey })

	// Wait for order to complete
	await filledOrder;
}

async function tradeGAS2NEO(address, privateKey, amount) {
	// Create order
	const order = await createOrder({
		pair: 'GAS_NEO',
		blockchain: 'neo',
		address,
		side: 'sell',
		price: null,
		quantity: amount,
		useNativeTokens: false,
		orderType: 'market',
		privateKey
	})

	// Execute order
	let tradedNEO = (await broadcastOrder({ order, privateKey })).data.want_amount
	// Wait for order to complete
	let contractBalanceNEO = (await listBalances({ addresses: [address] })).body.confirmed.NEO;
	contractBalanceNEO = contractBalanceNEO ? contractBalanceNEO : 0

	// Wait for order to complete
	while (contractBalanceNEO < amount) {
		await sleep(0.5)
		contractBalanceNEO = (await listBalances({ addresses: [address] })).body.confirmed.NEO;
	}

	return Number(tradedNEO)/2
}

async function NEO2GAS(address, privateKey, amount) {
	let filledOrder = createPromisedOrder(address, "GAS_NEO")

	// DEPOSIT
	await depositNEO(address, privateKey, amount)

	// TRADE
	await tradeNEO2GAS(address, privateKey, amount, filledOrder)

	// WITHDRAW
	await withdraw(address, privateKey, filledOrder, "GAS")
}

async function GAS2NEO(address, privateKey, amount) {
	address = getScriptHashFromAddress(address)
	// DEPOSIT
	console.log('depositing gas...')
	//await depositGAS(address, privateKey, amount)

	// TRADE
	console.log('trading...')
	const tradedNEO = await tradeGAS2NEO(address, privateKey, amount) % 10**8

	// WITHDRAW
	console.log('withdrawing...')
	await withdraw(address, privateKey, tradedNEO, "NEO")
}

async function ETH2NEO() {

}

async function ETH2GAS() {
	// ETH -> SWTH

	// SWTH -> GAS
}

export { NEO2GAS, ETH2NEO, ETH2GAS, GAS2NEO, getOrderBook }; 
