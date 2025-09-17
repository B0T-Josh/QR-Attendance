export default function encryptPassword(password: string) {
  let asciiArray = password.split("").map((char: string) => char.charCodeAt(0));
  let hashedPass = 0; 
  asciiArray.forEach(element => {
    hashedPass += element
  });
  return hashedPass;
}