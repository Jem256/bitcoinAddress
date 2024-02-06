const bitcoin = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').default;
const ecc = require('tiny-secp256k1');
const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.testnet;

// Step 1: Compute SHA-256 hash of the string "Btrust Builders"
const preimageString = 'Btrust Builders';
const sha256HashString = bitcoin.crypto
    .sha256(Buffer.from(preimageString))
    .toString('hex');

console.log('SHA-256 hash of the string:', sha256HashString);

// Step 2: Format the redeem script to hexadecimal representation
const redeemScript = bitcoin.script.compile([
    bitcoin.opcodes.OP_SHA256,
    Buffer.from(sha256HashString, 'hex'),
    bitcoin.opcodes.OP_EQUAL,
]);

console.log('redeemScript Hex: ', redeemScript.toString('hex'));
console.log('redeemScript ASM:', bitcoin.script.toASM(redeemScript));

// convert the redeem script from its hexadecimal representation into a Buffer object.
const redeemScriptBuffer = Buffer.from(redeemScript, 'hex');

// Derive P2SH address
const p2shAddress = bitcoin.payments.p2sh({
    redeem: { output: redeemScriptBuffer },
}).address;

console.log('Derived P2SH Address:', p2shAddress);

// create transaction
async function createTransaction(privateKeyWIF, previousTxid, p2shAddress) {
    const keyPair = ECPair.fromWIF(privateKeyWIF);

    // Transaction Builder
    const txb = new bitcoin.Psbt({ network });
    txb.setVersion(2);
    txb.setLocktime(0);

    txb.addInput(previousTxid, 0);
    txb.addOutput(p2shAddress, 20000); // Sending 0.0002 BTC
    txb.sign(0, keyPair);

    // Build and return the transaction hex
    const tx = txb.extractTransaction();
    return tx.toHex();
}

const privateKeyWIF = 'cTGB3KFUbTkaQSddepSF5i9ai8sc5NsktnMcNJxi8fwztxAEK34d';
const previousTxid =
    '7310081fb73f20f886180a8fa497d4ecb74d13d13a7b4f77b4a96e5a1dc72169';

createTransaction(privateKeyWIF, previousTxid, p2shAddress)
    .then((transactionHex) => {
        console.log('Transaction Hex:', transactionHex);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

// spending transaction
async function spendingTransaction(
    previousTxid2,
    lockingScript,
    unlockingScript,
    p2shAddress
) {
    // Transaction Builder
    const txb = new bitcoin.Psbt({ network });

    txb.addInput(previousTxid2, 0, null, Buffer.from(lockingScript, 'hex'));
    txb.addOutput(p2shAddress, 40000); // Sending 0.0004 BTC
    txb.sign(0, null, Buffer.from(unlockingScript, 'hex'));

    // Build and return the transaction hex
    const tx = txb.extractTransaction();
    return tx.toHex();
}

const previousTxid2 = 'my_previous_txid';
const lockingScript = redeemScript;
// Unlocking Script (ScriptSig): use preimage of redeem script
const unlockingScript = bitcoin.script.compile([Buffer.from(preimageString)]);

console.log(
    'Unlocking Script (ScriptSig):',
    bitcoin.script.toASM(unlockingScript)
);

spendingTransaction(previousTxid2, lockingScript, unlockingScript, p2shAddress)
    .then((transactionHex) => {
        console.log('Spending Transaction Hex:', transactionHex);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

