# Utils

These are a collection of commonly used utilities for parsing responses from smart contracts.


## hex2str

Converts a hex string to a string.

example:

```typescript
const hex2strInput = '68656c6c6f';
const hex2strExpected = 'hello';

const hex2strResult = o3dapi.utils.hex2str(hex2strInput);

console.log('hex2str', hex2strExpected === hex2strResult);
```

## str2hex

Converts a string to a hex string.

example:

```typescript
const str2hexInput = 'hello';
const str2hexExpected = '68656c6c6f';

const str2hexResult = o3dapi.utils.str2hex(str2hexInput);

console.log('str2hex', str2hexExpected === str2hexResult);
```

## hex2int

Converts a hex string to an integer.

example:

```typescript
const hex2intInput = '00e1f505';
const hex2intExpected = 100000000;

const hex2intResult = o3dapi.utils.hex2int(hex2intInput);

console.log('hex2int', hex2intExpected === hex2intResult);
```

## int2hex

Converts an integer to a hex string.

example:

```typescript
const int2hexInput = 100000000;
const int2hexExpected = '00e1f505';

const int2hexResult = o3dapi.utils.int2hex(int2hexInput);

console.log('int2hex', int2hexExpected === int2hexResult);
```

## reverseHex

Converts the endian of a hex string, big to little, or little to big.

example:

```typescript
const reverseHexInput = 'bc99b2a477e28581b2fd04249ba27599ebd736d3';
const reverseHexExpected = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';
const reverseHexResult = o3dapi.utils.reverseHex(reverseHexInput);

console.log('reverseHex', reverseHexExpected === reverseHexResult);
```

## address2scriptHash

Converts an address to a script hash.

example:

```typescript
const address2scriptHashInput = 'Ab2fvZdmnM4HwDgVbdBrbTLz1wK5TcEyhU';
const address2scriptHashExpected = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';

const address2scriptHashResult = o3dapi.utils.address2scriptHash(address2scriptHashInput);

console.log('address2scriptHash', address2scriptHashExpected === address2scriptHashResult);
```

## scriptHash2address

Converts a script hash to an address.

example:

```typescript
const scriptHash2addressInput = 'd336d7eb9975a29b2404fdb28185e277a4b299bc';
const scriptHash2addressExpected = 'Ab2fvZdmnM4HwDgVbdBrbTLz1wK5TcEyhU';

const scriptHash2addressResult = o3dapi.utils.scriptHash2address(scriptHash2addressInput);

console.log('scriptHash2address', scriptHash2addressExpected === scriptHash2addressResult);
```
