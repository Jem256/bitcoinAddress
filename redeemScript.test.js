import { assert } from 'chai';
const bitcoin = require('bitcoinjs-lib');

// Function to generate the redeem script
function generateRedeemScript(preimage) {
    const sha256Hash = bitcoin.crypto
        .sha256(Buffer.from(preimage))
        .toString('hex');
    return bitcoin.script
        .compile([
            bitcoin.opcodes.OP_SHA256,
            Buffer.from(sha256Hash, 'hex'),
            bitcoin.opcodes.OP_EQUAL,
        ])
        .toString('hex');
}

// Test cases
describe('Redeem Script Generation', function () {
    it('should generate the correct redeem script for "Btrust Builders"', function () {
        const preimage = 'Btrust Builders';
        const expectedRedeemScript = generateRedeemScript(preimage);

        // Expected redeem script: OP_SHA256 <hash> OP_EQUAL
        assert.strictEqual(
            expectedRedeemScript,
            'a820e5d5d3b982ee7ee2bdcff942866aa980ec8f497c6db245f1efb0e94e2060e5c387'
        );
    });

    // Add more test cases if needed
});

// Compute SHA-256 hash of the byte encoding (hex) of "Btrust Builders"
// const preimageHex = '427472757374204275696c64657273';
// const preimageBuffer = Buffer.from(preimageHex, 'hex');
// const sha256HashHex = bitcoin.crypto.sha256(preimageBuffer).toString('hex');

// console.log('SHA-256 hash of the byte encoding:', sha256HashHex);

// const redeemScript2 = bitcoin.script.compile([
//     bitcoin.opcodes.OP_SHA256,
//     Buffer.from(sha256HashHex, 'hex'),
//     bitcoin.opcodes.OP_EQUAL,
// ]);

// console.log('redeemScript2 : ', redeemScript2.toString('hex'));
