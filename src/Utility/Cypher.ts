import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';

export const encryptData = (data: string, base64Key: string, base64IV: string) => {
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const iv = CryptoJS.enc.Base64.parse(base64IV);

  const encrypted = AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Convert to Base64 and then make it URL-safe
  let base64Ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

  // Make the Base64 string URL-safe
  return base64Ciphertext
    .replace(/\+/g, '-')  // Replace '+' with '-'
    .replace(/\//g, '_')  // Replace '/' with '_'
    .replace(/=+$/, '');
};
