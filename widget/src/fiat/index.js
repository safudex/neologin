import { getExchangeAmount, createTransaction, getFixedExchange, getExchangeAmount2 } from '../changelly/api'
import { getContactId, getEthUSDPrice, addCreditCard, buyETH, } from '../carbon/api'
import Web3 from 'web3'
import TOKENS from './tokens'

let amountEth = 0

export async function getFinalAmount(amountGAS, calculatingPrice) {

    let changellyETH2GASRate = await getExchangeAmount(0.1)
    let carbonETHPrice = await getEthUSDPrice()
    let ethAmount2Buy = (amountGAS / (changellyETH2GASRate * 0.98))
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

    return {
        fiatChargeAmount,
        minAmountOK,
        priceInUSD,
        totalFee,
        calculatingPrice,
        ethAmount2Buy
    }
}

var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + TOKENS.ifura));//check infura
function createETHWallet(neoPrivKey) {
    console.log(neoPrivKey)

    let ethwallet = web3.eth.accounts.privateKeyToAccount(neoPrivKey);
    return ethwallet['address']
}


export async function startConversion(neoAddr, neoPrivkey, ethAmount2Buy) {
    //creates or gets the contactID by key neoAddr (carbon)
    let contactId = await getContactId(neoAddr)

    let address = createETHWallet(neoPrivkey)

    let transaction = await createTransaction(neoAddr, ethAmount2Buy)

    let payinAddress = transaction['result']['payinAddress']
    let payoutAddress = transaction['result']['payoutAddress']
    let amountTo = transaction['result']['amountTo']
    let currencyTo = transaction['result']['currencyTo']
    let amountExpectedFrom = transaction['result']['amountExpectedFrom']
    let amountExpectedTo = transaction['result']['amountExpectedTo']
    let currencyFrom = transaction['result']['currencyFrom']

    return {
        amountExpectedTo,
        payinAddress,
        contactId,
        address,
        amountExpectedFrom
    }
}


export async function preFinishPurchase(contactId, fiatChargeAmount, amountExpectedTo, address, payinAddress, creditCard) {
    console.log(contactId, fiatChargeAmount, amountExpectedTo, address, payinAddress, creditCard)
    let creditDebitId = await addCreditCard(creditCard.card_fullName, creditCard.card_number, creditCard.card_expiry, creditCard.card_cvc, creditCard.creditCardBillingInfo, contactId)
    let response = await buyETH(contactId, creditDebitId, fiatChargeAmount, address)
    if (response.charge3denrolled !== 'Y' && response.errorcode !== 0) {
        //  require a different card
        return Promise.reject()
    } else {
        return response
    }

}

export async function finishPurchase(address, payinAddress, amountExpectedTo, estimatedGas, contactID, orderID) {
    //TODO: Descubrir cuando los eths llegan a la billetera
    let checkStatus = setInterval(() => {
        let code = await getStatus(contactID, orderID)//get uuid from somewhere
        if (code == "100") {
            clearInterval(checkStatus)
            //una vez mis eths han llegado, entonces=>
            web3.eth.sendTransaction({//to fix
                from: address,
                to: payinAddress,
                value: amountExpectedTo,
                gas: estimatedGas
            })
        }
    }, 1000);

}