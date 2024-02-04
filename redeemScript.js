const bitcoin = require('bitcoinjs-lib');

// Step 1: Compute SHA-256 hash of the preimage
const preimage = 'Btrust Builders';
const sha256Hash = bitcoin.crypto.sha256(Buffer.from(preimage)).toString('hex');

// Step 2: Format the redeem script
const redeemScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_SHA256,
    Buffer.from(sha256Hash, 'hex'),
    bitcoin.opcodes.OP_EQUAL,
]);

console.log(
    'redeemScript : ',
    `OP_SHA256 ${redeemScript.toString('hex')} OP_EQUAL`
);
