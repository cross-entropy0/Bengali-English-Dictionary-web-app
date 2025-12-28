/**
 * XOR Decryption utility for encrypted BLOB fields
 * Key is loaded from environment variable
 */

// Read encryption key from environment variable
const ENCRYPTION_KEY = process.env.XOR_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error('XOR_ENCRYPTION_KEY environment variable is required');
}

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
