const hexScript = '010101029301038801027693010487';

function bitcoinScriptEvaluation(hexScript) {
    const stack = [];

    // Convert hexScript to binary
    const binaryScript = Buffer.from(hexScript, 'hex');

    for (let i = 0; i < binaryScript.length; i++) {
        const opcode = binaryScript[i];

        switch (opcode) {
            // OP_1: Push the number 1 onto the stack
            case 0x01:
                stack.push(1);
                break;

            // OP_2: Add the top two items on the stack
            case 0x02:
                const addResult = stack.pop() + stack.pop();
                stack.push(addResult);
                break;

            // OP_3: Subtract the top item on the stack from the second item on the stack
            case 0x03:
                const subtractResult = stack.pop() - stack.pop();
                stack.push(subtractResult);
                break;

            // OP_4: Check if the top two items on the stack are equal
            case 0x04:
                const equalResult = stack.pop() === stack.pop() ? 1 : 0;
                stack.push(equalResult);
                break;

            // OP_DUP: Duplicate the top item on the stack
            case 0x76:
                const dupValue = stack[stack.length - 1];
                stack.push(dupValue);
                break;

            // Unknown opcode, handle accordingly
            default:
                console.error(`Unknown opcode: ${opcode}`);
                return false;
        }
    }

    // The final result is the top item on the stack
    return stack.pop() === 1;
}

const result = bitcoinScriptEvaluation(hexScript);
console.log(result); 
