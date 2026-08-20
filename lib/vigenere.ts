export const PLAINTEXT_MESSAGE = `I LOVE YOUR BIRTHDAY. Because if you wouldn't have been born, we wouldn't have met so you understand how special your birthday is to me right?
And I really, really, REALLY like your personality, you know? I genuinely admire the way you are. Sometimes I'm a little envious because I wish I could be as carefree and open with people as you are. But I think that's one of the things that makes you, you. You have this way of making people feel comfortable around you without even trying, and I don't think you realise how special that is.
ALSO I'M SO SO SO PROUD OF YOU. YOU'VE BECOME A BIG MAN. IT literally feels so lucky to flaunt you. I mean the fact that you're my friend. 
I, uhm, want to write so much, I wrote so much but I had to backspace a little more than a paragraph because you don't like reading. But that's fine, you know everything that I feel about you. Happy Birthday, Avin. 
Didn’t know a city could feel so alive because of one person. I’ve been to Mumbai more times than I can remember, but this is the first time I’ve ever felt like I could call it home.
Please come down from cloud nine.`;

const DEFAULT_KEY = "BLUE";

export function encryptVigenere(text: string, key: string = DEFAULT_KEY): string {
  let keyIndex = 0;
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '') || "BLUE";
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;
      const charCode = char.charCodeAt(0) - base;
      const shift = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
      const encryptedChar = String.fromCharCode(((charCode + shift) % 26) + base);
      result += encryptedChar;
      keyIndex++;
    } else {
      result += char;
    }
  }
  return result;
}

export const CIPHERTEXT_MESSAGE = encryptVigenere(PLAINTEXT_MESSAGE);
