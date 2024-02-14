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
    const keyPair = ECPair.fromWIF(privateKeyWIF, network);

    // Transaction Builder
    const txb = new bitcoin.Psbt({ network });
    txb.setVersion(2);
    txb.setLocktime(0);

    txb.addInput({
        hash: previousTxid,
        index: 0,
        nonWitnessUtxo: Buffer.from(previousHex, 'hex'),
    });
    txb.addOutput({
        script: Buffer.from(p2shAddress, 'hex'),
        value: 20000,
    }); // Sending 0.0002 BTC
    txb.signInput(0, keyPair);
    // txb.validateSignaturesOfInput(0);
    txb.finalizeAllInputs();

    // Build and return the transaction hex
    const tx = txb.extractTransaction();
    return tx.toHex();
}

const privateKeyWIF = 'cTGB3KFUbTkaQSddepSF5i9ai8sc5NsktnMcNJxi8fwztxAEK34d';
const previousTxid =
    '7310081fb73f20f886180a8fa497d4ecb74d13d13a7b4f77b4a96e5a1dc72169';
const previousHex =
    '020000000001018648ccb56d37884b28fcbc1a76daebb9a42669030fa422d812b7f12499e966c30100000000fdffffff02cc4e0100000000001976a91482a160c68bb79d930024e73cd8571a296206c5e188ac3f6c4ff7000000001976a914fec401d0af0f45f1c1c27dfe5c7dd4ecdc887dd388ac0247304402207575940d2ce4c2e82a123820425213eb779e5ac2e22c0bea0f2b2f2e4421137202201180b7d423770d06d1ca50ddd7ed7f40cda29b19fdb5f8439d6f4a69162b0cb50121029ba21bfee4d17ee4ae33a84003b2c2e53e484dad594a2f3d835985642c6271f9604e2700';

createTransaction(privateKeyWIF, previousTxid, previousHex, p2shAddress)
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

