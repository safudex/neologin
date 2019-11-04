import { KEYS } from './key'
const axios = require("axios");
const ROOT = process.env.NODE_ENV === "PRODUCTION" ? "https://api.carbon.money" : "https://sandbox.carbon.money";


let jwtToken = ''
let headers = ''
async function init() {
    getFees()
    let url = `${ROOT}/v1/users/returnJWT?apikey=${KEYS.SANDBOX}`;
    let res = await fetch(url, {
        method: 'GET'
    })
    let result = await res.json()
    jwtToken = result.jwtToken
}

//'publicKey'may be any general identifier on your side for linking that user as well. (https://docs.carbon.money/docs/contacts)
async function createContact(publicKey) {
    let url = `${ROOT}/v1/contacts/create`;

    let data = {
        publicKey: publicKey
    }
    let headers = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    let result = await axios.post(url, data, headers)
    return result.data['details']['contactId']
}

async function getContact(publicKey) {
    let url = `${ROOT}/v1/contacts/query?publicKey=${publicKey}`;

    let headers = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    let result = await axios.get(url, headers)
    return result.data['contactId']
}


export async function getContactId(publicKey) {
    await init()
    let contactID = await getContact(publicKey)
    if (contactID) {
        console.log('getcontact')
        return contactID
    }
    else {
        console.log('create')
        contactID = await createContact(publicKey)
        return contactID
    }
}

//https://www.iban.com/currency-codes
function updateDefaultCurrency(defaultCurrencyCode, contactId) {
    let url = `${ROOT}/v1/contacts/updateCurrency`;

    let data = {
        currency: defaultCurrencyCode,
        contactId: contactId
    }

    axios.patch(url, data).then(result => console.log(result)).catch(err => console.log(err));
}

//TODO: verify contact for all purchases above the non-verified daily limit ($250)

let fees = {
    percentFee: 0,
    minimumFee: 0
}

function getFees() {
    console.log('sooooooooooooooooooooooooooo')
    let url = `${ROOT}/v1/admin/fees`;

    axios.get(url)
        .then(result => {
            fees['minimumFee'] = result.data['fiatToCrypto']['minimumFee']
            fees['percentFee'] = result.data['fiatToCrypto']['percentFee']
            console.log(fees)
        })
        .catch(err => console.log(err));

    /* 
    {
      message: 'Successfully retrieved fees for fiat > crypto, crypto <> crypto, and crypto > fiat services',
      code: 200,
      data: {
        fiatToCrypto: {
          percentFee: 3,
          minimumFee: 2
        } ,
        cryptoToFiat: {
          paypal: {
            percentFee: 3.4,
            minimumFee: 1,
            }
          }
      }
    }
             */
}

//rateSignature under the response headers
/**
 * You also have the option of passing in the rateSignature
 * to the purchase crypto (see below) routes and if the rates
 * are expired, the call will fail. In particular, we will
 * return a 412 status code.
 */
export async function getEthUSDPrice(fiatChargeAmount) {
    let url = `${ROOT}/v1/rates?cryptocurrencyArray=eth&fiatBaseCurrency=usd&fiatChargeAmount=${fiatChargeAmount};`

    axios.get(url).then(result => console.log(result)).catch(err => console.log(err));

    let res = await axios.get(url)
    return res.data['eth']['usd/eth']
}

//cuck
export async function estimatedETHPurchease(fiatChargeAmount) {
    /* let url = `${ROOT}/v1/rates?cryptocurrencyArray=eth&fiatBaseCurrency=usd&fiatChargeAmount=10000;` */
    let url = `${ROOT}/v1/rates?cryptocurrencyArray=btc,eth,eos,trx&fiatBaseCurrency=eur&fiatChargeAmount=10000;`

    axios.get(url).then(result => console.log(result)).catch(err => console.log(err));
    let res = await axios.get(url)
    return res.data['eth']['estimatedCryptoPurchase']
}

export async function addCreditCard(nameOnCard, cardNumber, expiry, cvc, billingInfo, contactId) {

    let headers = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    let urlq = `${ROOT}/v1/card?contactId=${contactId}`;

    axios.get(urlq, headers).then(result => console.log('getCreditcardddddd', result)).catch(err => console.log('thaterre', err));

    let url = `${ROOT}/v1/card/addNew`;
    let data = {
        nameOnCard: nameOnCard,
        cardNumber: cardNumber,
        expiry: expiry,
        cvc: cvc,
        billingPremise: billingInfo.card_billingPremise,
        billingStreet: billingInfo.card_billingStreet,
        billingPostal: billingInfo.card_billingPostal,
        contactId: contactId,
        rememberMe: "true",
        fiatBaseCurrency: "USD"//check
    }

    let res = await axios.post(url, data, headers)
    return res.data['details']['creditDebitId']
}

export async function buyETH(contactId, creditDebitId, fiatChargeAmount, ethAddr) {
    let url = `${ROOT}/v1/card/charge3d`;

    let headers = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    /**
     * The amount you'd like to charge a card.
     * You need to pass in a string without any
     * decimals. For example a charge of $10.39
     * would be rendered as "1039" and $233.91
     * would be "23391".
     */
    let _fiatChargeAmount = parseFloat(fiatChargeAmount * 100) + ''
    let data = {
        creditDebitId: creditDebitId,
        fiatChargeAmount: "1000",//_fiatChargeAmount,
        cryptocurrencySymbol: "eth",
        receiveAddress: ethAddr,
        confirmationUrl: "www.mycallback.example",
        successRedirectUrl: "www.successURL.com",
        errorRedirectUrl: "www.errorURL.com",
        contactId: contactId
    }
    /* let data = {
        creditDebitId: "0f61c914-4f7e-48a1-9951-b8725638bf14",
        fiatChargeAmount: "1000",
        cryptocurrencySymbol: "eos",
        receiveAddress: "blockone1111",
        confirmationUrl: "www.mycallback.example",
        successRedirectUrl: "www.successURL.com",
        errorRedirectUrl: "www.errorURL.com",
        contactId: "ab5bb41b-5979-4a54-b734-23eb9076188e"
    } */
    try {
        let resp = await axios.post(url, data, headers)
        console.log('yyyyyyyyyyyyyyyyyyyy', resp)
        return resp
    } catch (e) {
        console.log(e)
    }
    /**
     * charge3denrolled. 
     * If its value is anything other than 'Y',
     * you must prompt the customer to try again
     * with a different card as only 3DS charges
     * are supported.
     */
}

export async function getStatus(orderID, contactID) {
    let url = `${ROOT}/v1/status?orderId=${orderID}&contactId=${contactID}`;

    let result = await axios.get(url)
    return result['details']['status']
}