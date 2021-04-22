const puppeteer = require("puppeteer");
const { decrypt } = require("./crypto.js");
const fs = require("fs");

const getUrlByThreadId = (id) => {
  return "https://www.messenger.com/t/" + id;
};

const hash = {
  iv: "2167b0dac41e99520cfd870432f02231",
  content: "19cd27ffbcc9049995f3c6866495f25b1e572b7a",
};

exports.scrapping = async function (
  idConv,
  nbScroll,
  password,
  userId = "paullorgue@gmail.com"
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let gotoPage = async (url) => {
    await page.goto(url, {
      timeout: 120000, // 2 minutes
      waitUntil: "networkidle0", // considère navigation fini quand il n'y a plus de requêtes envoyer dans un laps de temps de 500ms
    });
    console.info("New page loaded: " + page.url());
  };

  const filledFields = async () => {
    // remplir les champs de connexion et submit le form
    await page.type("#email", userId);
    await page.type(
      "#pass",
      userId === "paullorgu@gmail.com"
        ? decrypt(hash, password.repeat(32).slice(0, 32))
        : password
    );
    // await page.screenshot({ path: "filling_fields.png" });
    console.log("Completed fields");
    try {
      await Promise.all([
        page.waitForNavigation({
          timeout: 25000,
          waitUntil: "networkidle0",
        }),
        page.click("#loginbutton"),
      ]);
    } catch (err) {
      console.log("Timeout error: relancer !");
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
      let messages = [];

      // message reçu
      let nodes = document.querySelectorAll(
        'div[data-testid="incoming_group"]'
      );
      nodes.forEach((node) => {
        let line = node.innerText.split("\n");

        // stockage des réaction
        let feedbacks = [];

        // stockage du contenu
        let what = "";

        // récupération de l'auteur
        let who = line[0];
        indx = who.indexOf(" replied to ");
        if (indx !== -1) {
          who = who.substring(0, indx);
        }
        indx = who.indexOf(" a répondu à ");
        if (indx !== -1) {
          who = who.substring(0, indx);
        }
        indx = who.indexOf(" forwarded");
        if (indx !== -1) {
          who = who.substring(0, indx);
        }
        indx = who.indexOf(" vous a répondu");
        if (indx !== -1) {
          who = who.substring(0, indx);
        }

        // récupération de la date d'envoie
        let when = line[1]
          .replace(who + ", date d’envoi : ", "")
          .replace(". Message original :", "");

        // suite de plusieurs message par la même personne
        // ou réponse à un message précédent
        let rows = node.querySelectorAll('div[role="row"]');

        rows.forEach((row) => {
          let innerText = row.innerText.split("\n");

          if (!innerText[0].includes(". Message original")) {
            // quand c'est une réponse, le message sur lequel porte la réponse est attaché
            // dans ce quand on ne tient pas compte de cette ligne
            // sinon ....

            // récupération des réactions
            let nodeFeedbacks = row.querySelector(
              'div[class="ggysqto6 exrn9cbp ojkyduve abpf7j7b ftzlm3b6 hybvsw6c fni8adji hgaippwi fykbt5ly ns4ygwem tlilfck6 j83agx80 bp9cbjyn taijpn5t"]'
            );
            if (nodeFeedbacks) {
              let emojies = [
                ...nodeFeedbacks.innerHTML.matchAll(
                  "(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*"
                ),
              ];
              emojies.forEach((element) => {
                feedbacks.push(element[0]);
              });

              innerText.splice(innerText.length - 1, 1);
            }

            if (
              innerText[0].includes(", date d’envoi : ") || // c'est un nouveau msg de la mm personne
              innerText[0].includes("Réponse par") // c'est une réponse
            ) {
              innerText.splice(0, 1);
            }

            what = what.concat(what.length ? "\n" : "", innerText.join(" "));
          }
        });

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
          raw: node.innerText,
        });
      });

      //message envoyé
      nodes = document.querySelectorAll('div[data-testid="outgoing_group"]');
      nodes.forEach((node) => {
        let line = node.innerText.split("\n");

        // stockage des réaction
        let feedbacks = [];

        // stockage du contenu
        let what = "";

        // récupération de la date d'envoie

        let when = line[0].replace("Date d’envoi de votre message : ", "");
        if (
          line[0].includes("You replied to yourself") ||
          line[0].includes("Vous avez répondu")
        ) {
          when = line[1].replace(". Message original :", "");
        }

        // suite de plusieurs message par la même personne
        // ou réponse à un message précédent
        let rows = node.querySelectorAll('div[role="row"]');

        rows.forEach((row) => {
          let innerText = row.innerText.split("\n");

          if (!innerText[0].includes(". Message original")) {
            // quand c'est une réponse, le message sur lequel porte la réponse est attaché
            // dans ce quand on ne tient pas compte de cette ligne
            // sinon ....

            // récupération des réactions
            let nodeFeedbacks = row.querySelector(
              'div[class="ggysqto6 exrn9cbp ojkyduve abpf7j7b ftzlm3b6 hybvsw6c fni8adji hgaippwi fykbt5ly ns4ygwem tlilfck6 j83agx80 bp9cbjyn taijpn5t"]'
            );
            if (nodeFeedbacks) {
              let emojies = [
                ...nodeFeedbacks.innerHTML.matchAll(
                  "(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*"
                ),
              ];
              emojies.forEach((element) => {
                feedbacks.push(element[0]);
              });

              innerText.splice(innerText.length - 1, 1);
            }

            if (
              innerText[0].includes("Date d’envoi de votre message : ") || // c'est un nouveau msg de la mm personne
              innerText[0].includes("Votre réponse") // c'est une réponse
            ) {
              innerText.splice(0, 1);
            }

            what = what.concat(what.length ? "\n" : "", innerText.join(" "));
          }
        });

        if (
          what.length !== 0 ||
          what === "Tenor GIF Keyboard" ||
          what === "GIPHY" ||
          what.includes("http://") ||
          what.includes("https://")
        ) {
          whatType = "Texte";
        } else {
          whatType = "Non Texte";
        }

        messages.push({
          who: "Moi",
          when: when,
          whatType: whatType,
          what: what,
          feedback: feedbacks,
          raw: node.innerText,
        });
      });

      return messages;
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

  // accepter les cookies
  await page.click('button[title="Tout accepter"]'); // #u_0_j #u_0_g

  await filledFields();

  // nouvelle page censée être celle d'une conversation
  console.log(`Current page after login: ${page.url()}`);

  // changement de conversation
  await gotoPage(getUrlByThreadId(idConv));

  if (
    (await page.url().indexOf("https://www.messenger.com/login.php?next")) !==
    -1
  ) {
    console.log("Error lors de la connexion, nouvelle tentative ...");
    await filledFields();
    console.log(`Current page after second try login: ${page.url()}`);
  }

  let i = 1;
  while (i < parseInt(nbScroll) + 1) {
    await scrollConv();
    await page
      .waitForTimeout(3000)
      .then(() => console.log(`(${i++}/${nbScroll}) Scroll in progress ...`));
    if (i % 100 === 0 && i / 100 > 0) {
      let msg = await retrieveMessages();
      fs.writeFileSync(
        `store/${new Date(Date.now())
          .toLocaleString()
          .replace(" à ", "_")
          .replace("/", "-")
          .replace("/", "-")
          .replace(":", "-")
          .replace(":", "-")}__${msg.length}.json`,
        JSON.stringify(msg)
      );
      console.log(`${msg.length} messages saved`);
    }
  }

  let messages = await retrieveMessages();

  messages.forEach((message) => {
    let when = message.when;
    let l = when.length;
    let heure = when.substring(l - 5, l - 3);
    let min = when.substring(l - 2);
    let whenFormat = new Date(Date.now());
    if (!isNaN(heure) && !isNaN(min)) {
      whenFormat.setHours(heure, min);
      if (when.includes("Hier, à ")) {
        whenFormat.setDate(whenFormat.getDate() - 1);
      } else if (!when.includes("Aujourd’hui, à")) {
        if (when.includes("janvier")) whenFormat.setMonth(0);
        else if (when.includes("février")) whenFormat.setMonth(1);
        else if (when.includes("mars")) whenFormat.setMonth(2);
        else if (when.includes("avril")) whenFormat.setMonth(3);
        else if (when.includes("mai")) whenFormat.setMonth(4);
        else if (when.includes("juin")) whenFormat.setMonth(5);
        else if (when.includes("juillet")) whenFormat.setMonth(6);
        else if (when.includes("aout")) whenFormat.setMonth(7);
        else if (when.includes("septembre")) whenFormat.setMonth(8);
        else if (when.includes("octobre")) whenFormat.setMonth(9);
        else if (when.includes("novembre")) whenFormat.setMonth(10);
        else if (when.includes("décembre")) whenFormat.setMonth(11);
        let da = when.match("[0-9].")[0];
        if (da !== null) whenFormat.setDate(parseInt());
      }
      message.when = whenFormat.toString();
    } else {
      if (when.includes("janvier")) whenFormat.setMonth(0);
      else if (when.includes("février")) whenFormat.setMonth(1);
      else if (when.includes("mars")) whenFormat.setMonth(2);
      else if (when.includes("avril")) whenFormat.setMonth(3);
      else if (when.includes("mai")) whenFormat.setMonth(4);
      else if (when.includes("juin")) whenFormat.setMonth(5);
      else if (when.includes("juillet")) whenFormat.setMonth(6);
      else if (when.includes("aout")) whenFormat.setMonth(7);
      else if (when.includes("septembre")) whenFormat.setMonth(8);
      else if (when.includes("octobre")) whenFormat.setMonth(9);
      else if (when.includes("novembre")) whenFormat.setMonth(10);
      else if (when.includes("décembre")) whenFormat.setMonth(11);
      let da = when.match("[0-9].")[0];
      if (da !== null) whenFormat.setDate(parseInt());
      message.when = whenFormat.toString();
      // console.log(
      //   `${when} / heure: ${when.substring(
      //     l - 5,
      //     l - 3
      //   )} / min: ${when.substring(l - 2)}`
      // );
    }
  });

  console.log(`Nombre de message chargé: ${messages.length}`);
  await browser.close();
  return messages;
};
