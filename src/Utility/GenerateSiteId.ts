const GenerateSiteId = (name: string): string => {
  // Use Date.now() for a high-resolution timestamp in a browser environment
  const time = Date.now();

  // A simple hash function for the name, typed to accept a string and return a number
  const hashName = (s: string): number => {
    return s.split('').reduce((acc, char) => {
      // Ensure operation within 32-bit integer range
      return Math.imul(31, acc) + char.charCodeAt(0) | 0;
    }, 0);
  };

  // Combine time, a random element, and a hash of the name, all converted to base 36 strings
  const uniquePart: string = time.toString(36) + Math.random().toString(36).substring(2, 15);
  const nameHash: string = hashName(name).toString(36);

  return uniquePart + nameHash;
};

export default GenerateSiteId;