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

  return encodeURIComponent(encrypted.toString());
}