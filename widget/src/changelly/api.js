import KEYS from './key'

const crypto = require("crypto");

const apiEndpoint = 'https://api.changelly.com';

function createBody(method, params) {
    return {
        "id": "test",
        "jsonrpc": "2.0",
        "method": method,
        "params": params
    }
}

function sign(data) {
    return crypto
        .createHmac('sha512', KEYS.secret)
        .update(JSON.stringify(data))
        .digest('hex');
}

async function doRequest(body, signedBody) {
    let response = await fetch(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(body), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json',
            'api-key': KEYS.key,
            'sign': signedBody
        }
    })
    let data = await response.json()
    return data
}

export async function getExchangeAmount(amount) {
    let bodyExchangeAmount = createBody('getExchangeAmount', [{ "from": "eth", "to": "gas", 'amount': amount }])
    let signedBodyEA = sign(bodyExchangeAmount)
    let response = await doRequest(bodyExchangeAmount, signedBodyEA)
    return response['result'][0]['rate']
}

export async function getExchangeAmount2(amount) {
    let bodyExchangeAmount = createBody('getExchangeAmount', [{ "from": "gas", "to": "eth", 'amount': amount }])
    let signedBodyEA = sign(bodyExchangeAmount)
    let response = await doRequest(bodyExchangeAmount, signedBodyEA)
    return response['result']
}

export async function getFixedExchange(amount) {
    let bodyExchangeAmount = ''
    if (amount) {
        bodyExchangeAmount = createBody('getFixRateForAmount', [{ "from": "eth", "to": "gas", "amountFrom": amount }])
    } else {
        bodyExchangeAmount = createBody('getFixRate', [{ "from": "eth", "to": "gas" }])
    }
    let signedBodyEA = sign(bodyExchangeAmount)
    let response = await doRequest(bodyExchangeAmount, signedBodyEA)
    return response['result']
}

export async function createTransaction(address, amount) {
    let body = createBody('createTransaction', {
        "from": "eth",
        "to": "gas",
        "address": address,
        "amount": String(amount)
    })
    let signedBody = sign(body)
    return await doRequest(body, signedBody)
}