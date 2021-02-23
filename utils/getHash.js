const { encrypt, decrypt } = require("./crypto.js");
const readline = require("readline");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let secretText;
rl.question("Entrer du texte à chiffrer: ", (text) => {
  secretText = text;
  rl.question("Entrer la clé de chiffrement: ", (key) => {
    let hash = encrypt(secretText, key.repeat(32).slice(0, 32));
    console.log(`Hash: ${JSON.stringify(hash)}`);
    console.log(
      `Test decrypt: ${
        decrypt(hash, key.repeat(32).slice(0, 32)) === secretText
      }`
    );
    rl.close();
  });
});
