import { createECDH, createHash, createCipheriv, createHmac, randomBytes } from 'crypto';
import { wallet } from '@cityofzion/neon-js';

const IV_LENGTH = 16; // For AES, this is always 16

function aes256CbcEncrypt(iv, key, data) {
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const firstChunk = cipher.update(data);
  const secondChunk = cipher.final();
  return Buffer.concat([firstChunk, secondChunk]);
}

function getIV() {
  return randomBytes(IV_LENGTH);
}

export default function encrypt({ recipientPublicKey, wif, data }) {
  const ecdh = createECDH('prime256v1');
  const senderAccount = new wallet.Account(wif);
  const senderPrivateKey = senderAccount.privateKey;

  ecdh.setPrivateKey(senderPrivateKey, 'hex');
  const senderPublicKey = Buffer.from(senderAccount.publicKey, 'hex');
  const sharedKey = ecdh.computeSecret(recipientPublicKey, 'hex');
  const hash = createHash('sha512')
    .update(sharedKey)
    .digest();
  const iv = getIV()
  const encryptionKey = hash.slice(0, 32);
  const macKey = hash.slice(32);
  const encrypted = aes256CbcEncrypt(iv, encryptionKey, data);
  const dataToMac = Buffer.concat([iv, senderPublicKey, encrypted]);
  const mac = createHmac('sha256', macKey)
    .update(dataToMac)
    .digest();

  return {
    iv: iv.toString('hex'),
    mac: mac.toString('hex'),
    data: encrypted.toString('hex')
  };
}
