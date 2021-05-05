const { Command } = require('commander');
const program = new Command();
const process = require('process');
const { Transform, pipeline } = require('stream');
const fs = require('fs');
const readline = require('readline');

program
    .option('-s, --shift <type>', 'a shift')
    .option('-i, --input <type>', 'an input file')
    .option('-o, --output <type>', 'an output file')
    .option('-a, --action <type>', 'an action encode/decode');

program.parse(process.argv);

function errorColor(str) {
    return `\x1b[31m${str}\x1b[0m`;
}

const options = program.opts();
if (!options.action || !options.shift) {
    process.stderr.write(errorColor('Action (encode/decode) and the shift are required!'));
    process.exit(1);
} else {
    if (options.input && options.output) {
        readAndWrite();
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

function readAndWrite() {
    pipeline(
        fs.createReadStream(options.input).setEncoding('utf8'),
        new Transform({
            decodeStrings: false,
            construct(callback) {
                this.data = '';
                callback();
            },
            transform(chunk, encoding, callback) {
                this.data += chunk;
                callback();
            },
            flush(callback) {
                try {
                    this.push(caesarCipher(this.data, Number(options.shift), options.action));
                } catch (err) {
                    callback(err);
                }
            },
        }),
        fs.createWriteStream(options.output, { flags: 'a' }),
        (err) => {
            if (err) {
                process.stderr.write(errorColor(err));
                process.exit(1);
            }
        }
    );
}

let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

function checkPos(pos) {
    if (pos < 0) {
        pos += alphabet.length;
    } else if (pos > alphabet.length - 1) {
        pos -= alphabet.length;
    }

    return pos;
}

function checkCase(char, charPos) {
    if (char == char.toUpperCase()) {
        return alphabet[charPos].toUpperCase();
    }
    return alphabet[charPos].toLowerCase();
}

function caesarCipher(str, k, action) {
    if (action === 'encode' || action === 'decode') {
        let encode = '';
        let charPos = 0;

        for (let i = 0; i < str.length; i++) {
            if (alphabet.indexOf(str[i].toLowerCase()) !== -1) {
                if (action === 'encode') {
                    charPos = (alphabet.indexOf(str[i].toLowerCase()) + k) % 26;
                } else if (action === 'decode') {
                    charPos = (alphabet.indexOf(str[i].toLowerCase()) - k) % 26;
                }
                charPos = checkPos(charPos);
                encode += checkCase(str[i], charPos);
            } else {
                encode += str[i];
            }
        }

        return encode;
    }

    return 0;
}
