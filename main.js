const puppeteer = require("puppeteer");
const fs = require("fs");
const { decrypt } = require("./crypto.js");
const readline = require("readline");
const { type } = require("os");
const { fork } = require("child_process");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getDate = () => {
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

const conv = {
  BDE: "2783966814983840",
  Kermess: "2258131307637099",
  WEI: "3363123163702478",
  MOI: "100010357567647",
};

const getUrlByThreadId = (id) => {
  return "https://www.messenger.com/t/" + id;
};

const hash = {
  iv: "1a67c7b49816c2d563839428d98b6125",
  content: "b43191ad93d7978f8a2532b410b739",
};

let password = "";
rl.question("Code : ", (answer) => {
  password = decrypt(hash, answer.repeat(32).slice(0, 32));
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

  const saveHTML = async () => {
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

  const filledFields = async () => {
    // remplir les champs de connexion et submit le form
    await page.type("#email", "paullorgue@gmail.com");
    await page.type("#pass", password);
    await page.screenshot({ path: "filling_fields.png" });
    console.log("Completed fields");
    try {
      await Promise.all([
        page.waitForNavigation({
          timeout: 60000,
          waitUntil: "networkidle0",
        }),
        page.click("#loginbutton"),
      ]);
    } catch (err) {
      console.log("Timeout error: relancer !");
      await page.screenshot({ path: "error_login.png" });
      // await browser.close();
      // return;
    }

    // si mauvais code
    if ((await page.url()) === "https://www.messenger.com/login/password/") {
      console.log(
        "Mot de passe incorrect. Demander à plorgue@ensc.fr pour avoir le code"
      );
      await browser.close();
      return;
    }
  };

  const retrieveMessages = async () => {
    return await page.evaluate(() => {
      let nodes = document.querySelectorAll(
        'div[data-testid="incoming_group"]'
      );
      let messages = [];
      let opt = [];
      let length = nodes.length;
      nodes.forEach((node) => {
        let line = node.innerText.split("\n");
        let who = line[0];
        let when = line[1];
        let what = line.slice(2).join(" ");
        // opt.push({ len: line.length, what: what });

        let indx = what.indexOf(when.slice(0, -5));
        if (indx != -1) {
          what = what
            .substring(0, indx)
            .concat(what.substring(indx + when.length + 1));
        }
        when = when
          .replace(who + ", date d’envoi : ", "")
          .replace(". Message original :", "");
        indx = who.indexOf(" replied to ");
        if (indx !== -1) {
          who = who.substring(0, indx);
        }

        indx = what.indexOf(` … Réponse par ${who} : `);
        if (indx != -1) {
          what = what.substring(indx + who.length + 18);
        }
        indx = what.indexOf(`Réponse par ${who} : `);
        if (indx != -1) {
          what = what.substring(indx + who.length + 15);
        }

        let emojiNode = node.querySelector(
          'div[class="ggysqto6 exrn9cbp ojkyduve abpf7j7b ftzlm3b6 hybvsw6c fni8adji hgaippwi fykbt5ly ns4ygwem tlilfck6 j83agx80 bp9cbjyn taijpn5t"]'
        );
        let nfeed = 0;
        let feedbacks = [];
        if (emojiNode) {
          nfeed = emojiNode.innerText;
          let emojies = [
            ...node.innerHTML.matchAll(
              "(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*"
            ),
          ];
          emojies.forEach((element) => {
            feedbacks.push(element[0]);
          });

          what = what.slice(0, -2);
        }

        // let feedback = "";
        // const regexp = '(<img height="16" width="16" alt=").';
        // let rea = [...node.innerHTML.matchAll(regexp)][0];
        // if (rea) {
        //   feedback = rea[0].slice(-1);
        //   nfeed = what.slice(-1);
        //   what = what.slice(0, -2);
        // }

        if (what.length !== 0) {
          whatType = "Texte";
        } else {
          whatType = "Non Texte";
        }

        messages.push({
          who: who,
          when: when,
          whatType: whatType,
          what: what,
          feedback: feedbacks,
          nbOfFeedback: nfeed,
        });
      });
      return [messages, length];
    });
  };

  const scrollConv = async function () {
    return await page.evaluate(() => {
      document
        .querySelector(
          'div[class="buofh1pr j83agx80 eg9m0zos ni8dbmo4 cbu4d94t gok29vw1"]'
        )
        .scroll(0, -2000);
    });
  };

  /*
  START 
  */

  await gotoPage("https://www.messenger.com/");

  // check de la page de login
  // await saveHTML();
  // await page.screenshot({ path: "page.png" });

  // accepter les cookies
  await page.click('button[title="Tout accepter"]'); // #u_0_j #u_0_g

  //await page.screenshot({ path: "loginPage.png" });

  await filledFields();

  // nouvelle page censée être celle d'une conversation
  console.log(`Current page after login: ${page.url()}`);

  // pour debug
  // await page.screenshot({ path: "newPage.png" });

  // changement de conversation
  await gotoPage(getUrlByThreadId(conv.BDE));

  if (
    (await page.url().indexOf("https://www.messenger.com/login.php?next")) !==
    -1
  ) {
    console.log("Error lors de la connexion, nouvelle tentative ...");
    await filledFields();
    await page.screenshot({ path: "second_tentative.png" });
    console.log(`Current page after second try login: ${page.url()}`);
  }

  // récupération et stockage de l'html de la nouvelle page pour debug
  //await saveHTML();

  // [messages, length] = await retrieveMessages();

  // await page.screenshot({ path: "scroll.png" });

  // console.log(`Nombre de message chargé: ${length}`);
  // try {
  //   let path = "messages_" + getDate() + ".json";
  //   // fs.writeFileSync("bodyHTML_" + date + ".html", bodyHTML);
  //   fs.writeFileSync(path, JSON.stringify(messages));
  // } catch (err) {
  //   console.error(err);
  // }

  let i = 0;
  while (i < 4) {
    await scrollConv();
    await page
      .waitForTimeout(4000)
      .then(() => console.log(`(${i++}) Scroll in progress ...`));
  }

  await page.screenshot({ path: "afterScroll_andwait.png" });
  await saveHTML();

  [messages, length] = await retrieveMessages();

  console.log(`Nombre de message chargé: ${length}`);
  try {
    let path = "messages_" + getDate() + ".json";
    // fs.writeFileSync("bodyHTML_" + date + ".html", bodyHTML);
    fs.writeFileSync(path, JSON.stringify(messages));
  } catch (err) {
    console.error(err);
  }

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
