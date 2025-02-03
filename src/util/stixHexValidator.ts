// Per the STIX specs:
// "The [hex] string MUST consist of an even number of hexadecimal characters, 
// which are the digits '0' through '9' 
// and the lower-case letters 'a' through 'f'"
export function stixHexValidator(hex: string) {
  // Empty/blank hexes are fine:
  if (!hex) {
    return true;
  }
  // Check that the hex contains an even number of characters:
  if(hex.length % 2 !== 0) {
    return false;
  }
  // Check that the hex is only made up of the 
  // characters 0-9 and a-f:
  if (hex.match(/^[0-9a-f]+$/)) {
    return true;
  } else {
    return false;
  }
}