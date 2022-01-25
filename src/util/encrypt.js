// @ts-check
const { createHash, createCipheriv } = require('crypto');

/**
 *
 * @param {string} data A utf8 string
 * @param {string} key key would be hashed by md5 and shorten to maximum of 192 bits,
 * @returns {string}
 */
function encryptTripleDes(data, key) {
    let md5Key = createHash('md5')
        .update(key)
        .digest('hex')
        // If you remove this substr, cipher throw Error: Invalid key length
        //     this[kHandle].initiv(cipher, credential, iv, authTagLength);
        .substr(0, 24);
    let cipher = createCipheriv('des-ede3', md5Key, '');
    let encrypted = cipher.update(data, 'utf8', 'base64');

    encrypted += cipher.final('base64');
    return encrypted;
}

module.exports = {
    encryptTripleDes,
};
