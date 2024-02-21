const hexScript = '010101029301038801027693010487';

function bitcoinScriptEvaluation(hexScript) {
    const stack = [];

    const binaryScript = Buffer.from(hexScript, 'hex');

    for (let i = 0; i < binaryScript.length; i++) {
        const opcode = binaryScript[i];

        switch (opcode) {
            case 0x01:
                stack.push(1);
                break;

            case 0x02:
                const addResult = stack.pop() + stack.pop();
                stack.push(addResult);
                break;

            case 0x03:
                const subtractResult = stack.pop() - stack.pop();
                stack.push(subtractResult);
                break;

            case 0x04:
                const equalResult = stack.pop() === stack.pop() ? 1 : 0;
                stack.push(equalResult);
                break;

            case 0x76:
                const dupValue = stack[stack.length - 1];
                stack.push(dupValue);
                break;

            default:
                console.error(`Unknown opcode: ${opcode}`);
                return false;
        }
    }

    return stack.pop() === 1;
}

const result = bitcoinScriptEvaluation(hexScript);
console.log(result); 
