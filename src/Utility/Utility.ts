
export const normalizePhoneNumber = (phoneNumber: string) => {
  // Remove all non-digit characters
  let cleanedNumber = phoneNumber.replace(/\D/g, '');
  // Remove leading '1' if present and number is 11 digits
  if (cleanedNumber.length === 11 && cleanedNumber.startsWith('1')) {
    cleanedNumber = cleanedNumber.substring(1);
  }
  // Ensure the number is now 10 digits
  if (cleanedNumber.length !== 10) {
    throw new Error('Invalid phone number length');
  }
  return cleanedNumber;
};