const process = require('process');
const commander = require('commander');
const checkArguments = require('./validation');
const program = new commander.Command();

program
    .option('-s, --shift <type>', 'a shift')
    .option('-i, --input <type>', 'an input file')
    .option('-o, --output <type>', 'an output file')
    .addOption(new commander.Option('-a, --action <type>', 'an action encode/decode').choices(['encode', 'decode']));

program.parse(process.argv);

const options = program.opts();

checkArguments(options);

module.exports = options;
