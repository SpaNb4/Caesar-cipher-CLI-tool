const process = require('process');
const fs = require('fs');
const readline = require('readline');

const errorColor = require('./utils');
const caesarCipher = require('./caesar');
const readAndWrite = require('./files');

function checkArguments(options) {
    if (!options.action || !options.shift) {
        process.stderr.write(errorColor('Action (encode/decode) and the shift are required!'));
        process.exit(1);
    } else {
        if (options.input && options.output) {
            readAndWrite(options);
        } else {
            if (!options.input && options.output) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                let outFile = fs.createWriteStream(options.output, { flags: 'a' });

                console.log(`Type 'exit' to stop`);

                function readLineRecurs() {
                    rl.question('Enter your text: ', (str) => {
                        if (str === 'exit') {
                            return rl.close();
                        }

                        outFile.write(caesarCipher(str, options.shift, options.action));

                        readLineRecurs();
                    });
                }

                readLineRecurs();
            } else if (options.input && !options.output) {
                let inFile = fs.createReadStream(options.input);

                let str = '';
                inFile.on('data', (chunk) => {
                    str += chunk;
                });
                inFile.on('end', () => {
                    console.log(`Encoded text: ${caesarCipher(str, options.shift, options.action)}`);
                });
            } else if (!options.input && !options.output) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                console.log(`Type 'exit' to stop`);

                function readLineRecurs() {
                    rl.question('Enter your text: ', (str) => {
                        if (str === 'exit') {
                            return rl.close();
                        }

                        console.log(`Encoded text: ${caesarCipher(str, options.shift, options.action)}`);
                        readLineRecurs();
                    });
                }

                readLineRecurs();
            }
        }
    }
}

module.exports = checkArguments;
