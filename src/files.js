const { Transform, pipeline } = require('stream');
const fs = require('fs');

const errorColor = require('./utils');
const caesarCipher = require('./caesar');

function checkOutputFile(file, callback) {
    if (fs.existsSync(file)) {
        if (fs.lstatSync(file).isFile()) {
            fs.access(file, fs.constants.W_OK, (err) => {
                if (err) {
                    process.stderr.write(errorColor("Can't write to output file"));
                    process.exit(1);
                }
                callback();
            });
        } else {
            process.stderr.write(errorColor('Output is not a file'));
            process.exit(1);
        }
    } else {
        callback();
    }
}

function readAndWrite(options) {
    pipeline(
        fs.createReadStream(options.input).setEncoding('utf8'),
        new Transform({
            decodeStrings: false,
            construct(callback) {
                this.data = '';

                checkOutputFile(options.output, () => {
                    if (fs.existsSync(options.input) && fs.lstatSync(options.input).isFile()) {
                        callback();
                    } else {
                        process.stderr.write(errorColor('Input file not found'));
                        process.exit(1);
                    }
                });
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

module.exports = { readAndWrite, checkOutputFile };
