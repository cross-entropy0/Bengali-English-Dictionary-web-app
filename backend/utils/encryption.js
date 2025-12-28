/**
 * XOR Decryption utility for encrypted BLOB fields
 * Key: ")@5D$k#*!"
 */

const ENCRYPTION_KEY = ")@5D$k#*!";

function xorDecrypt(buffer) {
    if (!buffer || buffer.length === 0) {
        return null;
    }
    
    const output = [];
    for (let i = 0; i < buffer.length; i++) {
        const inputByte = buffer[i];
        const keyByte = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        const decryptedByte = inputByte ^ keyByte;
        output.push(decryptedByte);
    }
    return Buffer.from(output).toString('utf-8');
}

module.exports = { xorDecrypt };
