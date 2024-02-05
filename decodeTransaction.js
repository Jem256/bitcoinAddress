const bitcoin = require('bitcoinjs-lib');

// Replace with the actual raw transaction hex
const rawTransactionHex =
    '020000000001010ccc140e766b5dbc884ea2d780c5e91e4eb77597ae64288a42575228b79e234900000000000000000002bd37060000000000225120245091249f4f29d30820e5f36e1e5d477dc3386144220bd6f35839e94de4b9cae81c00000000000016001416d31d7632aa17b3b316b813c0a3177f5b6150200140838a1f0f1ee607b54abf0a3f55792f6f8d09c3eb7a9fa46cd4976f2137ca2e3f4a901e314e1b827c3332d7e1865ffe1d7ff5f5d7576a9000f354487a09de44cd00000000';

try {
    const transaction = bitcoin.Transaction.fromHex(rawTransactionHex);

    console.log('Version:', transaction.version);

    console.log('Inputs:');
    transaction.ins.forEach((input, index) => {
        console.log(`  - Input ${index + 1}:`);
        console.log(`    - Outpoint hash: ${input.hash.toString('hex')}`);
        console.log(`    - Outpoint index: ${input.index}`);
        console.log(`    - ScriptSig: ${input.script.toString('hex')}`);
        console.log(`    - Sequence: ${input.sequence}`);
    });

    console.log('Outputs:');
    transaction.outs.forEach((output, index) => {
        console.log(`  - Output ${index + 1}:`);
        console.log(`    - Value: ${output.value}`);
        console.log(`    - ScriptPubKey: ${output.script.toString('hex')}`);
    });

    console.log('Locktime:', transaction.locktime);
} catch (error) {
    console.error('Error decoding transaction:', error);
}

// Bonus mark: write a test that validates your script functions. 