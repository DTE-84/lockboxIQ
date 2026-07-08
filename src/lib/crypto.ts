import CryptoJS from 'crypto-js';

/**
 * Encrypts a plaintext string using AES-256 with the provided PIN/Key.
 * @param text The plaintext to encrypt
 * @param pin The user's Master PIN
 * @returns The encrypted ciphertext string
 */
export const encryptAES = (text: string, pin: string): string => {
  if (!text) return '';
  return CryptoJS.AES.encrypt(text, pin).toString();
};

/**
 * Decrypts an AES-256 ciphertext string using the provided PIN/Key.
 * @param ciphertext The encrypted string
 * @param pin The user's Master PIN
 * @returns The decrypted plaintext string, or empty string if decryption fails
 */
export const decryptAES = (ciphertext: string, pin: string): string => {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, pin);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption failed. Invalid PIN or corrupted data.', error);
    return '';
  }
};
