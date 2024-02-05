const bitcoin = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').default;
const ecc = require('tiny-secp256k1');
const ECPair = ECPairFactory(ecc);

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

console.log('redeemScript : ', redeemScript.toString('hex'));

// convert the redeem script from its hexadecimal representation into a Buffer object.
const redeemScriptBuffer = Buffer.from(redeemScript, 'hex');

// Derive P2SH address
const p2shAddress = bitcoin.payments.p2sh({
    redeem: { output: redeemScriptBuffer },
}).address;

console.log('Derived P2SH Address:', p2shAddress);

// create transaction

async function createTransaction(privateKeyWIF, previousTxid, p2shAddress) {
    // Derive key pair from the private key
    const keyPair = ECPair.fromWIF(privateKeyWIF);

    // Transaction Builder
    const txb = new bitcoin.Transaction();

    txb.addInput(previousTxid, 0);
    txb.addOutput(p2shAddress, 20000); // Sending 0.0002 BTC
    txb.sign(0, keyPair);

    // Build and return the transaction hex
    const tx = txb.build();
    return tx.toHex();
}

const privateKeyWIF = 'cTGB3KFUbTkaQSddepSF5i9ai8sc5NsktnMcNJxi8fwztxAEK34d';
const previousTxid = '7310081fb73f20f886180a8fa497d4ecb74d13d13a7b4f77b4a96e5a1dc72169';

createTransaction(privateKeyWIF, previousTxid, p2shAddress)
    .then((transactionHex) => {
        console.log('Transaction Hex:', transactionHex);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });

// spending transaction
async function createSpendingTransaction(
    privateKeyWIF2,
    previousTxid2,
    lockingScript,
    p2shAddress
) {
    // Derive key pair from the private key
    const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF);

    // Transaction Builder
    const txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);

    // Add input from a previous transaction
    txb.addInput(previousTxid, 0, null, Buffer.from(lockingScript, 'hex')); // Include the locking script

    // Add output to the P2SH address
    txb.addOutput(p2shAddress, 40000); // Sending 0.0004 BTC

    // Sign the transaction with the private key
    txb.sign(0, keyPair, null, null, Buffer.from(unlockingScript, 'hex')); // Include the unlocking script

    // Build and return the transaction hex
    const tx = txb.build();
    return tx.toHex();
}

const privateKeyWIF2 = 'your_private_key_wif';
const previousTxid2 = 'your_previous_txid';
const lockingScript = 'your_locking_script_hex'; // Replace with the actual locking script
const unlockingScript = 'your_unlocking_script_hex'; // Replace with the actual unlocking script

// createSpendingTransaction(
//     privateKeyWIF2,
//     previousTxid2,
//     lockingScript,
//     p2shAddress
// )
//     .then((transactionHex) => {
//         console.log('Spending Transaction Hex:', transactionHex);
//     })
//     .catch((error) => {
//         console.error('Error:', error.message);
//     });

