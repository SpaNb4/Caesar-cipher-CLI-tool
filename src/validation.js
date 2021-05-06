const process = require('process');
const fs = require('fs');
const readline = require('readline');

const errorColor = require('./utils');
const caesarCipher = require('./caesar');
const files = require('./files');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function readLineRecurs(isFile, options, outFile) {
    rl.question('Enter your text: ', (str) => {
        if (str === 'exit') {
            return rl.close();
        }

        if (isFile) {
            outFile.write(caesarCipher(str, options.shift, options.action));
        } else {
            process.stdout.write(`Encoded text: ${caesarCipher(str, options.shift, options.action)}\n`);
        }
        readLineRecurs(isFile, options, outFile);
    });
}

function checkArguments(options) {
    if (!options.action || !options.shift) {
        process.stderr.write(errorColor('Action (encode/decode) and the shift are required!'));
        process.exit(1);
    } else {
        if (options.input && options.output) {
            files.readAndWrite(options);
        } else {
            if (!options.input && options.output) {
                files.checkOutputFile(options.output, () => {
                    let outFile = fs.createWriteStream(options.output, { flags: 'a' });

                    process.stdout.write(`Type 'exit' or use Ctrl+C combination to stop input\n`);

                    readLineRecurs(true, options, outFile);
                });
            } else if (options.input && !options.output) {
                let inFile = fs.createReadStream(options.input);

                let str = '';
                inFile.on('data', (chunk) => {
                    str += chunk;
                });
                inFile.on('end', () => {
                    process.stdout.write(`Encoded text: ${caesarCipher(str, options.shift, options.action)}\n`);
                });
            } else if (!options.input && !options.output) {
                process.stdout.write(`Type 'exit' or use Ctrl+C combination to stop input\n`);

                readLineRecurs(false, options);
            }
        }
    }
}

module.exports = checkArguments;
