/**
 * Cryptography helper.
 * @module "helpers.cryptoHelper"
 */

// Import core node modules
import crypto from "node:crypto";

// Import modules from this component
import { InvalidParametersError } from "../errors/errors.js";

const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt text using AES encryption. The output will be URL safe.
 * @param {string} text The text to encrypt.
 * @param {string} key The key to use to encrypt the text. Must be 256 bits (32 characters).
 * @returns {string} The encrypted text, URL-encoded.
 */
export function encrypt(text, key) {

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Combine IV and encrypted text, then convert to a hex string
    const result = Buffer.concat([iv, encrypted]).toString('hex');

    // URL-encode the result
    return encodeURIComponent(result);
}

/**
 * Decrypt text using AES encryption.
 * @param {string} text The text to decrypt, URL-encoded.
 * @param {string} key The key to use to encrypt the text. Must be 256 bits (32 characters).
 * @returns {string} The decrypted text.
 */
export function decrypt(text, key) {
    // Decode the URL-encoded format
    const decodedText = decodeURIComponent(text);

    // Convert the hex string back to a buffer
    const data = Buffer.from(decodedText, 'hex');

    // Extract IV and encrypted text
    const iv = data.slice(0, IV_LENGTH);
    const encryptedText = data.slice(IV_LENGTH);

    let decipher;
    try {
        decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    } catch (error) {
        throw new InvalidParametersError("There was an error decrypting the supplied value", error);
    }

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

/**
 * Generate a random string of specified length.
 * @param {number} length The length of the random string.
 * @returns {string} The generated random string.
 */
export function generateRandomString(length) {
    const bytes = Math.ceil(length / 2);
    const randomBytesBuffer = crypto.randomBytes(bytes);
    return randomBytesBuffer.toString('hex').slice(0, length);
}

/**
 * Generate a random UUID using node:crypto.
 * @returns {string} A UUID.
 */
export function generateUuid(){
    return crypto.randomUUID();
}