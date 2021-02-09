const puppeteer = require("puppeteer");
const fs = require("fs");
const { decrypt } = require("./crypto.js");
const readline = require("readline");
const { Console } = require("console");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let getDate = () => {
  let date_ob = new Date();
  return (
    //date_ob.getFullYear() +
    ("0" + (date_ob.getMonth() + 1)).slice(-2) +
    ("0" + date_ob.getDate()).slice(-2) +
    "-" +
    ("0" + date_ob.getHours()).slice(-2) +
    ("0" + date_ob.getMinutes()).slice(-2) +
    ("0" + date_ob.getSeconds()).slice(-2)
  );
};

let conv = {
  BDE: "2783966814983840",
  "Team Kermess": "2258131307637099",
  "Team WEI": "3363123163702478",
};

let getUrlByThreadId = (id) => {
  return "https://www.messenger.com/t/" + id;
};

//let hash = encrypt("i89uFX0H?SmM>Exj", secretKey.repeat(32).slice(0, 32));
let hash = {
  iv: "1a67c7b49816c2d563839428d98b6125",
  content: "b43191ad93d7978f8a2532b410b739",
};

let password = "";
rl.question("Code : ", (answer) => {
  password = decrypt(hash, answer.repeat(32).slice(0, 32));
  console.log(`Decrypted password: ${password.slice(0, 3)}...`);
  scrapping();
  rl.close();
});

let scrapping = async function () {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let gotoPage = async (url) => {
    await page.goto(url, {
      timeout: 120000, // 2 minutes
      waitUntil: "networkidle0", // considère navigation fini quand il n'y a plus de requêtes envoyer dans un laps de temps de 500ms
    });
    console.info("New page loaded: " + page.url());
  };

  let saveHTML = async () => {
    //let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    let outbodyHTML = await page.evaluate(() => document.body.outerHTML);
    try {
      let path = "body_" + getDate() + ".html";
      // fs.writeFileSync("bodyHTML_" + date + ".html", bodyHTML);
      fs.writeFileSync(path, outbodyHTML);
      console.log("Sauvegarde HTML " + path);
    } catch (err) {
      console.error(err);
    }
  };

  await gotoPage("https://www.messenger.com/");

  // check de la page de login
  // await saveHTML();
  // await page.screenshot({ path: "page.png" });

  // accepter les cookies
  if (await page.$("#u_0_j")) {
    await page.click("#u_0_j"); // #u_0_h pour facebook
    console.log("cookies accepted");
  } else if (await page.$("#u_0_g")) {
    await page.click("#u_0_g");
    console.log("cookies accepted");
  } else {
    console.log("Error cookies: Relancer !");
    await browser.close();
    return;
  }
  await page.screenshot({ path: "loginPage.png" });

  // remplir les champs de connexion et submit le form
  await page.type("#email", "paullorgue@gmail.com");
  await page.type("#pass", password);
  console.log("fields completed");
  try {
    await Promise.all([
      page.waitForNavigation({
        timeout: 100000,
        waitUntil: "domcontentloaded",
      }),
      page.click("#loginbutton"),
    ]);
  } catch (err) {
    console.log("Timout error: relancer !");
    await browser.close();
    return;
  }

  // si mauvais code
  if ((await page.url()) === "https://www.messenger.com/login/password/") {
    console.log(
      "Mot de passe incorrect. Demander à plorgue@ensc.fr pour avoir le code"
    );
    await browser.close();
    return;
  } else {
    console.log("Code valide");
  }

  // nouvelle page censée être celle d'une conversation
  console.log("Current page after login: " + page.url());

  // pour debug
  await page.screenshot({ path: "newPage.png" });

  // changement de conversation
  await gotoPage(getUrlByThreadId(conv.BDE));

  // récupération et stockage de l'html de la nouvelle page pour debug
  await saveHTML();

  let messages = await page.evaluate(() => {
    nodes = document.querySelectorAll('div[data-testid="incoming_group"]');
    let messages = [];
    nodes.forEach((node) => {
      const regexp = '(<img height="16" width="16" alt=").';
      let contenu = node.innerText;
      //let rea = [...node.matchAll(regexp).slice(-1)];
      //messages.push({ content: contenu, react: rea });
    });
    return messages;
  });
  console.log(messages);
  console.log("finish");
  await browser.close();
  return;
};

/* 
>>>Pour récup les messages outbodyHTML_20210131-01411.html:
 document.querySelectorAll('div[data-testid="incoming_group"]')
 --> utiliser .innerText pour récup les contenus

 >>>Regex pour récup les émojies
 (<img height="16" width="16" alt=").
 --> comme c'est des carac spéciaux je sais pas trop si je pourais les gérer facilement
 
 >>>Regex intéressant pour récup le contenu des messages
 >(?!<)([^(?!(<))]+)
 */
