import { getExchangeAmount, createTransaction, getFixedExchange, getExchangeAmount2 } from '../changelly/api'
import { getContactId, getEthUSDPrice, addCreditCard, buyETH, getStatus } from '../carbon/api'
import Web3 from 'web3'
import TOKENS from './tokens'
import { GAS2NEO, wait4newBalanceGAS, getActualGASBalance } from '../swapAPI'
const Tx = require('ethereumjs-tx').Transaction

export async function getFinalAmount(amount, calculatingPrice, asset) {

    let changellyETH2GASRate = await getExchangeAmount(0.1)//changelly
    let carbonETHPrice = await getEthUSDPrice()//carbon
    let ethAmount2Buy = (amount / (changellyETH2GASRate * 0.98))
    let priceInUSD = ethAmount2Buy * carbonETHPrice

    //calculating fees
    let gasPrice = await web3.eth.getGasPrice()
    let txPriceInWei = gasPrice * 21000
    let txPriceInEth = web3.utils.fromWei(String(txPriceInWei), 'ether')
    let changellyDepositNetFee = txPriceInEth / carbonETHPrice

    let changellySwapNetFee = changellyDepositNetFee //?

    let carbonFee = (0.03 * priceInUSD > 2) ? 0.03 * priceInUSD : 2


    let totalFee = carbonFee + changellyDepositNetFee + changellySwapNetFee //+ changellyFeeUSD <- included in getethusdprice
    let fiatChargeAmount = priceInUSD + totalFee

    let minAmountOK = (priceInUSD >= 5)

    if (asset === 'NEO') {
        let switcheofee = 1


        totalFee += switcheofee
        fiatChargeAmount = priceInUSD + totalFee
    }

    return {
        fiatChargeAmount,
        minAmountOK,
        priceInUSD,
        totalFee,
        calculatingPrice,
        ethAmount2Buy
    }
}

const testnet = 'https://ropsten.infura.io/';
const web3 = new Web3(new Web3.providers.HttpProvider(testnet));

/* var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + TOKENS.ifura));//check infura */
function createETHWallet(neoPrivKey) {
    let ethwallet = web3.eth.accounts.privateKeyToAccount(neoPrivKey);
    return ethwallet['address']
}


export async function startTransaction(neoAddr, neoPrivkey, ethAmount2Buy) {
    let contactInfo = await getContactId(neoAddr)//carbon
    let contactId = contactInfo['contactId']
    let address = createETHWallet(neoPrivkey)

    let transaction = await createTransaction(neoAddr, ethAmount2Buy)//changelly

    let payinAddress = transaction['result']['payinAddress']
    let amountExpectedFrom = transaction['result']['amountExpectedFrom']
    let amountExpectedTo = transaction['result']['amountExpectedTo']

    return {
        amountExpectedTo,
        payinAddress,
        contactId,
        address,
        amountExpectedFrom,
        remainingWeeklyLimit: contactInfo['remainingWeeklyLimit']
    }
}


export async function postCreditCard(contactId, fiatChargeAmount, address, payinAddress, creditCard, ethAmount, asset) {
    let creditDebitId = await addCreditCard(creditCard.card_fullName, creditCard.card_number, creditCard.card_expiry, creditCard.card_cvc, creditCard.creditCardBillingInfo, contactId)
    let actualBalance = await getActualBalance(address)
    let response = await buyETH(contactId, creditDebitId, fiatChargeAmount, address, payinAddress, actualBalance, ethAmount, asset)
    if (response.charge3denrolled !== 'Y' && response.errorcode !== 0) {
        //  require a different card
        return Promise.reject(response)
    } else {
        return response
    }

}

export function finishPurchase(address, payinAddress, amountExpectedTo, estimatedGas, contactID, orderID, actualBalance, asset) {
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
                checkIfEthsHasArrivedAndSend2Changelly(address, payinAddress, amountExpectedTo, actualBalance, asset, resolve, reject)
            } else if (code === '-1' || code === '2' || code === '3' || code === '7000') {
                return reject(code)
            }
        }, 1000);
    })
}

function checkIfEthsHasArrivedAndSend2Changelly(address, payinAddress, amountExpectedTo, actualBalance, asset, resolve, reject) {
    let checkBalance = setInterval(async () => {
        let newBalance = await getActualBalance(address)
        console.log('balances', address, actualBalance, newBalance)
        if (actualBalance < newBalance) {
            clearInterval(checkBalance)
            try {
                await sendTransaction(address, payinAddress, amountExpectedTo, asset, resolve, reject)
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
                console.log(balance + " ETH");
                resolve(balance)
            }
            else
                reject(error)
        });
    });
}

async function sendTransaction(addr, toAddress, amountToSend, asset, resolve, reject) {
    let gasPrice = await web3.eth.getGasPrice()
    let gasLimit = await web3.eth.getBlock("latest")
    gasLimit = gasLimit.gasLimit
    let nonce = await web3.eth.getTransactionCount(addr)
    let privateKey = localStorage.getItem('privkey')
    var rawTransaction = {
        "from": addr,
        "nonce": web3.utils.toHex(nonce),
        "gasPrice": gasPrice,
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": toAddress,
        "value": amountToSend,
        "chainId": 3 //remember to change this
    };

    var privKey = new Buffer(privateKey, 'hex');
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    let actualBalanceGAS = await getActualGASBalance()

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async (err, hash) => {
        if (!err) {
            console.log('Txn Sent and hash is ' + hash);
            if (asset === 'NEO') {
                await wait4newBalanceGAS(addr, actualBalanceGAS)
                await GAS2NEO(resolve, reject)
                resolve()
            }
            else
                resolve()
        }
        else {
            console.error(err);
            reject()
        }
    });
}

async function wait4newBalance(balance, addr) {
    let newBalance = 0
    while (balance > newBalance)
        newBalance = await getActualBalance(addr)
}