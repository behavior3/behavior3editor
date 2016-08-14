
export function createId() {
  var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var ID_LENGTH = 20
  var ALPHABET_LENGTH = ALPHABET.length

  var result = ''
  for (let i=0; i<ID_LENGTH; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET_LENGTH))
  }
  return result.toUpperCase()
}
