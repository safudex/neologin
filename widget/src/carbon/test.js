import { createTransaction } from '../changelly/api'
import { sendTransaction } from '../fiat'

const publicKey = 'ATpKTfUCoBm7PDQ38CrtJ7mDEa34gra4uf'
const amount = 0.07
const ethPublicKey = '0x56c77d84caf29adc6f0bCd02e51a8a33a13Ed749'

async function startTest() {
    return new Promise(async (resolve, reject) => {
        let res = await createTransaction(publicKey, amount)
        console.log(res)
        sendTransaction(publicKey,
            ethPublicKey,
            res['result']['payinAddress'],
            "0.07",
            "8.5",
            'NEO', resolve, reject
        )
    })
}

startTest().then((r) => console.log('ok', r)).catch((e) => console.log('error', e))