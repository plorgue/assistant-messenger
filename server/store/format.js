const fs = require("fs");

let path = "./20-04-2021_02-04-26__8225";

let data = JSON.parse(fs.readFileSync(path + ".json", "utf8"));
console.log(data.length);
let data_r = [];
let a = 0;
let b = 0;
let c = 0;
data.forEach((element) => {
  if (
    element.whatType === "Texte" &&
    (element.what.includes("http") ||
      element.what.includes("GIPHY") ||
      element.what.includes("Tenor GIF Keyboard") ||
      element.what.includes("Écouter 0 :00 /"))
  ) {
    element.whatType = "Non Texte";
    c++;
  }
  if (!isValid(element.when)) {
    let tmp = formatWhen(element);
    if (isValid(tmp)) {
      element.when = tmp;
      data_r.push(randomSecond(element));
      b++;
    } else {
      console.log(element);
      a++;
    }
  } else {
    data_r.push(randomSecond(element));
  }
});
console.log(
  `Messages formattés: ${b}, messages toujours invalide: ${a}, autre formatage: ${c}`
);
console.log(`${a} messages non valides`);
console.log(`Avant: ${data.length}. Après: ${data_r.length}`);
fs.writeFileSync(path + "_r.json", JSON.stringify(data_r));
console.log("Changements sauvés");

function randomSecond(element) {
  let d = new Date(element.when);
  d.setSeconds(Math.floor(Math.random() * 60)).toString();
  element.when = d.toString();
  return element;
}

function isValid(whenStr) {
  if (new Date(whenStr).toLocaleString() === "Invalid Date") return false;
  if (new Date(whenStr).getFullYear() === 2001) return false;
  return true;
}

function formatWhen(element) {
  let when = element.when;
  let l = when.length;
  let heure = when.substring(l - 5, l - 3);
  let min = when.substring(l - 2);
  let whenFormat = new Date(Date.now());
  if (!isNaN(heure) && !isNaN(min)) {
    whenFormat.setHours(heure, min);
    if (when.includes("Hier, à ")) {
      whenFormat.setDate(whenFormat.getDate() - 1);
    } else if (!when.includes("Aujourd’hui, à")) {
      //mois
      let month = getMonth(when);
      if (month !== -1) whenFormat.setMonth(month);
      //jour
      let da = when.match("[0-9].");
      if (da !== null) {
        whenFormat.setDate(parseInt(da[0]));
      }
    }
  } else {
    //mois
    let month = getMonth(when);
    if (month !== -1) whenFormat.setMonth(month);

    //jour
    let da = when.match("[0-9].");
    if (da !== null) {
      whenFormat.setDate(parseInt(da[0]));
    }
  }

  return whenFormat.toString();
}

function getMonth(when) {
  if (when.includes("janvier")) return 0;
  else if (when.includes("février")) return 1;
  else if (when.includes("mars")) return 2;
  else if (when.includes("avril")) return 3;
  else if (when.includes("mai")) return 4;
  else if (when.includes("juin")) return 5;
  else if (when.includes("juillet")) return 6;
  else if (when.includes("aout")) return 7;
  else if (when.includes("septembre")) return 8;
  else if (when.includes("octobre")) return 9;
  else if (when.includes("novembre")) return 10;
  else if (when.includes("décembre")) return 11;
}
