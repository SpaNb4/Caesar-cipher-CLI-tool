const { Transform, pipeline } = require('stream');
const fs = require('fs');

const errorColor = require('./utils');
const caesarCipher = require('./caesar');

function readAndWrite(options) {
    pipeline(
        fs.createReadStream(options.input).setEncoding('utf8'),
        new Transform({
            decodeStrings: false,
            construct(callback) {
                this.data = '';

                if (fs.existsSync(options.input)) {
                    callback();
                } else {
					process.stderr.write(errorColor('Input file not found'));
                    process.exit(1);
                }
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

module.exports = readAndWrite;
