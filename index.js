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

function caesarCipher(str, k, isDecode) {
    let encode = '';
    let charPos = 0;

    for (let i = 0; i < str.length; i++) {
        if (alphabet.indexOf(str[i].toLowerCase()) !== -1) {
            if (isDecode) {
                charPos = (alphabet.indexOf(str[i].toLowerCase()) + k) % 26;
            } else {
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

console.log(caesarCipher('This is secret. Message about "_" symbol!', 7, true));
