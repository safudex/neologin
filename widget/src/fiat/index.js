import { getExchangeAmount, createTransaction } from '../changelly/api'
import { getContactId, getEthUSDPrice, addCreditCard, buyETH } from '../carbon/api'
import Web3 from 'web3'

export async function getFinalAmount(amountUSD) {
    //TODO: obtain amountEth from carbon api
    let amountEth = amountUSD * 0.0056
    return await getExchangeAmount(amountEth)
}
var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ocCdekUYwOyLn7h7OlJM'));
function createETHWallet(neoPrivKey) {
    console.log(neoPrivKey)
    let rpcUrl = "https://mainnet.infura.io/ocCdekUYwOyLn7h7OlJM";

    let ethwallet = web3.eth.accounts.privateKeyToAccount(neoPrivKey);
    return ethwallet['address']
}

export async function startConversion(neoAddr, neoPrivkey, amountUSD) {
    let contactId = getContactId(neoAddr)
    let ethPrice = getEthUSDPrice(amountUSD)

    let address = createETHWallet(neoPrivkey)

    let amountEth = amountUSD * 0.0056
    let transaction = await createTransaction(neoAddr, amountEth)
    console.log(transaction)
    let payinAddress = transaction['result']['payinAddress']
    let payoutAddress = transaction['result']['payoutAddress']
    let amountTo = transaction['result']['amountTo']
    let changellyFee = transaction['result']['changellyFee']
    let currencyTo = transaction['result']['currencyTo']
    let amountExpectedFrom = transaction['result']['amountExpectedFrom']
    let amountExpectedTo = transaction['result']['amountExpectedTo']
    let currencyFrom = transaction['result']['currencyFrom']

    //calculating fees
    let estimatedGas = web3.eth.gasPrice * 0.000000001 * 21000
    let estimatedGasUSD = estimatedGas * ethPrice
    let carbonFee = (0.03 * amountUSD > 2) ? 0.03 * amountUSD : 2
    let changellyDepositNetFee = estimatedGasUSD
    let changellySwapNetFee = estimatedGasUSD
    let changellyFeeUSD = (changellyFee / 100) * amountUSD
    let totalFee = carbonFee + changellyFeeUSD + changellyDepositNetFee + changellySwapNetFee

    let fiatChargeAmount = amountUSD + totalFee

    return {
        amountExpectedTo,
        payinAddress,
        totalFee,
        contactId, fiatChargeAmount, address,
        ethPrice,
        amountExpectedFrom,
        estimatedGas
    }
}

export function finishPurchase(contactId, fiatChargeAmount, amountExpectedTo, address, payinAddress, estimatedGas, creditCard) {
    let creditDebitId = addCreditCard(creditCard.nameOnCard, creditCard.cardNumber, creditCard.expiry, creditCard.cvc, creditCard.billingInfo, contactId)
    let ok = buyETH(contactId, creditDebitId, fiatChargeAmount, address)
    if (!ok)
        console.log('Try with other credit card')

    //TODO: Descubrir cuando los eths llegan a la billetera

    //una vez mis eths han llegado, entonces=>
    web3.eth.sendTransaction({
        from: address,
        to: payinAddress,
        value: amountExpectedTo,
        gas: estimatedGas
    })
}