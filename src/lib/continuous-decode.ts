const decodableCharacter = /[\p{L}\p{N}]/u;

export function countDecodableCharacters(text: string) {
  return Array.from(text).filter((character) => decodableCharacter.test(character)).length;
}

export function decodeText(text: string, decodedCharacters: number) {
  let seenCharacters = 0;

  return Array.from(text)
    .map((character) => {
      if (!decodableCharacter.test(character)) return character;

      seenCharacters += 1;
      return seenCharacters <= decodedCharacters ? character : "X";
    })
    .join("");
}
