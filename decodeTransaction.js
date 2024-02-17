const bitcoin = require('bitcoinjs-lib');

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

// get a transation id from hex 
const transactionHex =
    '02000000016921c71d5a6ea9b4774f7b3ad1134db7ecd497a48f0a1886f8203fb71f081073000000006a473044022049738d17c664c72f408122b8019e4c740a6556edaa4bcc569b0ad3b86cdb37b702200589afbd7d7dc1354a9b3a87fda9169ffc08c4121010656797361b657da4e68e01210356d50d81f331cab8bb08922521295a503687cb75240979eb50a4ae908b200d76ffffffff01204e000000000000e4020000000001018648ccb56d37884b28fcbc1a76daebb9a42669030fa422d812b7f12499e966c30100000000fdffffff02cc4e0100000000001976a91482a160c68bb79d930024e73cd8571a296206c5e188ac3f6c4ff7000000001976a914fec401d0af0f45f1c1c27dfe5c7dd4ecdc887dd388ac0247304402207575940d2ce4c2e82a123820425213eb779e5ac2e22c0bea0f2b2f2e4421137202201180b7d423770d06d1ca50ddd7ed7f40cda29b19fdb5f8439d6f4a69162b0cb50121029ba21bfee4d17ee4ae33a84003b2c2e53e484dad594a2f3d835985642c6271f9604e270000000000';

// Decode the transaction hex
const transaction = bitcoin.Transaction.fromHex(transactionHex);

// Get the transaction hash
const transactionHash = transaction.getHash();

// Reverse byte order to match Bitcoin's endianness
const transactionId = bitcoin.crypto
    .sha256(transactionHash)
    .reverse()
    .toString('hex');

console.log('Transaction ID:', transactionId);

// Bonus mark: write a test that validates your script functions.
// Define the test case
describe('Transaction parsing and property extraction', () => {
    it('should correctly parse the transaction and extract properties', () => {
        try {
            const transaction = bitcoin.Transaction.fromHex(rawTransactionHex);

            // Validate expected properties
            assert.strictEqual(transaction.version, 2);
            assert.strictEqual(transaction.ins.length, 1);
            assert.strictEqual(transaction.outs.length, 2);
            assert.strictEqual(transaction.locktime, 495405);

            // Validate input properties
            const input = transaction.ins[0];
            assert.strictEqual(
                input.hash.toString('hex'),
                '0ccc140e766b5dbc884ea2d780c5e91e4eb77597ae64288a42575228b79e2349'
            );
            assert.strictEqual(input.index, 0);
            assert.strictEqual(
                input.script.toString('hex'),
                '225120245091249f4f29d30820e5f36e1e5d477dc3386144220bd6f35839e94de4b9cae81c'
            );
            assert.strictEqual(input.sequence, 4294967295);

            // Validate output properties
            const output1 = transaction.outs[0];
            assert.strictEqual(output1.value, 25468);
            assert.strictEqual(
                output1.script.toString('hex'),
                '16001416d31d7632aa17b3b316b813c0a3177f5b61502'
            );
            const output2 = transaction.outs[1];
            assert.strictEqual(output2.value, 43154);
            assert.strictEqual(
                output2.script.toString('hex'),
                '140838a1f0f1ee607b54abf0a3f55792f6f8d09c3eb'
            );
        } catch (error) {
            assert.fail('Transaction parsing failed:', error);
        }
    });
});
