export default function encryptPassword(password: string) {
  let asciiArray = password.split("").map((char: string) => char.charCodeAt(0));
  let hashedPass = asciiArray.join("");
  return hashedPass;
}