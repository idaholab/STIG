// Per the STIX specs:
// "Dictionary keys...are limited to the characters a-z (lowercase ASCII), 
// A-Z (uppercase ASCII), numerals 0-9, hyphen (-), and underscore (_). 
// Dictionary keys MUST have a minimum length of 3 ASCII characters and 
// MUST be no longer than 250 ASCII characters in length"
export function stixHashKeyValidator(hashKey: string) {
  // Check that the key's length is 3-250
  if (hashKey.length < 3 || hashKey.length > 250) {
    return false;
  }
  // Check that the key is only made up of the 
  // characters a-z, A-Z, 0-9, -, and _
  return hashKey.match(/^[a-zA-Z0-9\-_]+$/) != null;
}