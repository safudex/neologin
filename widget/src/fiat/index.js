import { getExchangeAmount, createTransaction } from '../changelly/api'
import { getContactId, getEthUSDPrice, addCreditCard, buyETH, getStatus } from '../carbon/api'
import Web3 from 'web3'
import TOKENS from './tokens'
import { GAS2NEO, getOrderBook } from '../swapAPI'
import { getBalance } from '../conn'

import '../carbon/test.js'

const Tx = require('ethereumjs-tx').Transaction

export async function getFinalAmount(amount, asset, id) {

    let switcheofee = 0
    if (asset === 'NEO') {
        let result = await getGASNeededForNEO(amount)
        amount = result['totalGAS']
        switcheofee = getSwitcheoFeeInUSD(amount, result['averageNEOPrice'])
    }

    let changellyETH2GASRate = await getExchangeAmount(0.1)//changelly
    let carbonETHPrice = await getEthUSDPrice()//carbon
    let ethAmount2Buy = (amount / (changellyETH2GASRate * 0.98))
    let priceInUSD = ethAmount2Buy * carbonETHPrice

    //calculating fees
    let gasPrice = await web3.eth.getGasPrice()
    let txPriceInWei = gasPrice * 21000 * 3 //fast fast fast fast
    let txPriceInEth = web3.utils.fromWei(String(txPriceInWei), 'ether')
    let changellyDepositNetFee = txPriceInEth / carbonETHPrice

    let changellySwapNetFee = (0.1 / (changellyETH2GASRate)) * carbonETHPrice //0.1GAS changelly fee

    let carbonFee = (0.03 * priceInUSD > 2) ? 0.03 * priceInUSD : 2


    let totalFee = carbonFee + changellyDepositNetFee + changellySwapNetFee + switcheofee//+ changellyFeeUSD <- included in getethusdprice
    let fiatChargeAmount = priceInUSD + totalFee

    let minAmountOK = (priceInUSD >= 5)

    fiatChargeAmount = (fiatChargeAmount).toFixed(2)
    totalFee = (totalFee).toFixed(2)
    priceInUSD = (priceInUSD).toFixed(2)

    return {
        fiatChargeAmount,
        priceInUSD,
        totalFee,
        minAmountOK,
        id,
        ethAmount2Buy
    }
}

async function getGASNeededForNEO(amount) {
    const bids_orderBook = (await getOrderBook('GAS_NEO'))['bids']
    let neoPrice = 0
    let gasAmount = 0
    let neoRequested = amount
    let totalGAS = 0

    let price = 0

    let it = 0
    while (neoRequested > 0 && it < bids_orderBook.length) {
        gasAmount = bids_orderBook[it]['quantity']
        neoPrice = bids_orderBook[it]['price']
        let actualNEO = neoPrice * gasAmount
        if (neoRequested <= actualNEO) {
            totalGAS += (neoRequested / neoPrice)
            price += neoPrice * neoRequested
        }
        else {
            totalGAS += actualNEO / neoPrice
            price += neoPrice * actualNEO
        }
        neoRequested -= actualNEO
        it++
    }

    totalGAS = (Math.trunc(totalGAS * 1000) / 1000) + 0.001
    let averageNEOPrice = parseFloat(amount) ? Math.round((price / amount) * 1000) / 1000 : 0
    return {
        totalGAS,
        averageNEOPrice
    }
}

function getSwitcheoFeeInUSD(neoAmount, averageNEOPrice) {
    let netFee = 0
    let switcheoFee = 0.2//percent

    let neoFee = neoAmount * (switcheoFee / 100)
    return (neoFee * averageNEOPrice)
}

//const testnet = 'https://ropsten.infura.io/';
//const web3 = new Web3(new Web3.providers.HttpProvider(testnet));

var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + TOKENS.ifura));//check infura
function createETHWallet(neoPrivKey) {
    let ethwallet = web3.eth.accounts.privateKeyToAccount(neoPrivKey);
    return ethwallet['address']
}


export async function startTransaction(neoAddr, neoPrivkey, ethAmount2Buy) {
    let contactInfo = await getContactId(neoAddr)//carbon
    let contactId = contactInfo['contactId']
    let ethAddress = createETHWallet(neoPrivkey)

    let transaction = await createTransaction(ethAddress, ethAmount2Buy)//changelly

    let payinAddress = transaction['result']['payinAddress']
    let amountExpectedFrom = transaction['result']['amountExpectedFrom']
    let amountExpectedTo = transaction['result']['amountExpectedTo']

    return {
        amountExpectedTo,
        payinAddress,
        contactId,
        ethAddress,
        amountExpectedFrom,
        remainingWeeklyLimit: contactInfo['remainingWeeklyLimit']
    }
}


export async function postCreditCard(contactId, fiatChargeAmount, address, payinAddress, creditCard, ethAmount, asset, neoAddr) {
    let creditDebitId = await addCreditCard(creditCard.card_fullName, creditCard.card_number, creditCard.card_expiry, creditCard.card_cvc, creditCard.creditCardBillingInfo, contactId)
    let actualBalance = await getActualBalance(address)
    let response = await buyETH(contactId, creditDebitId, fiatChargeAmount, address, payinAddress, actualBalance, ethAmount, asset, neoAddr)
    if (response.charge3denrolled !== 'Y' && response.errorcode !== 0) {
        //  require a different card
        return Promise.reject(response)
    } else {
        return response
    }

}

export function finishPurchase(neoAddr, address, payinAddress, amountExpectedTo, amountExpectedFrom, contactID, orderID, actualBalance, asset) {
    return new Promise((resolve, reject) => {
        let checkStatus = setInterval(async () => {
            let code = ''
            try {
                code = '100'//await getStatus(contactID, orderID)
            } catch (e) {
                clearInterval(checkStatus)
                return reject(e)
            }
            if (code === "100") {
                clearInterval(checkStatus)
                //una vez mis eths se han pagado, ahora checkeo que han llegado
                checkIfEthsHasArrivedAndSend2Changelly(neoAddr, address, payinAddress, amountExpectedTo, amountExpectedFrom, actualBalance, asset, resolve, reject)
            } else if (code === '-1' || code === '2' || code === '3' || code === '7000') {
                return reject(code)
            }
        }, 1000);
    })
}

function checkIfEthsHasArrivedAndSend2Changelly(neoAddr, address, payinAddress, amountExpectedTo, amountExpectedFrom, actualBalance, asset, resolve, reject) {
    let checkBalance = setInterval(async () => {
        let newBalance = await getActualBalance(address)
        if (actualBalance < newBalance) {
            clearInterval(checkBalance)
            try {
                await sendTransaction(neoAddr, address, payinAddress, amountExpectedTo, amountExpectedFrom, asset, resolve, reject)
            } catch (e) {
                return reject()
            }
        }
    }, 2000);
}

export async function getActualBalance(addr) {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(addr, async (error, wei) => {
            if (!error) {
                var balance = web3.utils.fromWei(wei, 'ether');
                resolve(balance)
            }
            else
                reject(error)
        });
    });
}

export async function sendTransaction(neoaddr, addr, toAddress, amountToSendETH, amountToSendGas, asset, resolve, reject) {
    /* let gasPrice = await web3.eth.getGasPrice()
    let gasLimit = await web3.eth.getBlock("latest")
    gasLimit = gasLimit.gasLimit
    let nonce = await web3.eth.getTransactionCount(addr)
    let privateKey = "x"
    let privateKeyneo = localStorage.getItem('privkey')
    gasPrice = gasPrice * 3 * 0

    var rawTransaction = {
        "from": addr,
        "nonce": web3.utils.toHex(nonce),
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": toAddress,
        "value": web3.utils.toHex(web3.utils.toWei(amountToSendETH, 'ether')),
        "chainId": 1
    };

    var privKey = new Buffer(privateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    let actualBalance = await getBalanceByAsset(neoaddr, 'GAS') */
    let privateKeyneo = localStorage.getItem('privkey')
    console.log(neoaddr, privateKeyneo, amountToSendGas)
    await GAS2NEO(neoaddr, privateKeyneo, amountToSendGas)
    /* web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async (err, hash) => {
        if (err) {
            console.log('Txn Sent and hash is ' + hash);
            if (asset === 'NEO') {
                //await wait4newBalance(actualBalance, neoaddr, 'GAS')
                await GAS2NEO(neoaddr, privateKeyneo, amountToSendGas)
                resolve()
            }
            else
                resolve()
        }
        else {
            console.error(err);
            reject()
        }
    }); */
}

async function wait4newBalance(balance, addr, asset) {
    let newBalance = 0
    while (balance > newBalance) {
        await sleep(2)
        newBalance = await getBalanceByAsset(addr, asset)
        console.log(balance, newBalance)
    }
}

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

async function getBalanceByAsset(addr, asset) {
    return (await getBalance({
        "params": [
            {
                "address": addr,
                "assets": [asset]
            }
        ],
        "network": "MainNet"
    }))[addr]['amount']
}