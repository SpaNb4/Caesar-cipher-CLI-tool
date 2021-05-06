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
    let res = '';
    let charPos = 0;

    for (let i = 0; i < str.length; i++) {
        if (alphabet.indexOf(str[i].toLowerCase()) !== -1) {
            if (action === 'encode') {
                charPos = (alphabet.indexOf(str[i].toLowerCase()) + k) % 26;
            } else if (action === 'decode') {
                charPos = (alphabet.indexOf(str[i].toLowerCase()) - k) % 26;
            }
            charPos = checkPos(charPos);
            res += checkCase(str[i], charPos);
        } else {
            res += str[i];
        }
    }

    return res;
}

module.exports = caesarCipher;
