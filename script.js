const metadataUrl =
  "https://raw.githubusercontent.com/xsalazar/emoji-kitchen-backend/main/app/metadata.json";

let emojiCodes = [];
let emojiChars = [];
let metadata = {};

const slider1 = document.getElementById("slider1");
const slider2 = document.getElementById("slider2");
const display1 = document.getElementById("emoji1-display");
const display2 = document.getElementById("emoji2-display");
const resultImg = document.getElementById("result-img");
const message = document.getElementById("message");

function codeToEmoji(code) {
  return String.fromCodePoint(...code.split("-").map((u) => parseInt(u, 16)));
}

function getComboUrl(codeA, codeB) {
  const comboA = metadata[codeA]?.find(
    (c) => c.rightEmoji === codeB && c.isLatest,
  );
  if (comboA) return comboA.gStaticUrl;
  const comboB = metadata[codeB]?.find(
    (c) => c.rightEmoji === codeA && c.isLatest,
  );
  if (comboB) return comboB.gStaticUrl;
  return null;
}

function updateResult() {
  const codeA = emojiCodes[Number(slider1.value)];
  const codeB = emojiCodes[Number(slider2.value)];
  const url = getComboUrl(codeA, codeB);
  if (url) {
    resultImg.src = url;
    resultImg.style.display = "block";
    message.textContent = "";
  } else {
    resultImg.style.display = "none";
    message.textContent = "No existe combinación disponible.";
  }
}

async function init() {
  const response = await fetch(metadataUrl);
  const data = await response.json();
  emojiCodes = data.knownSupportedEmoji;
  metadata = data;
  delete metadata.knownSupportedEmoji;

  emojiChars = emojiCodes.map(codeToEmoji);

  slider1.max = emojiCodes.length - 1;
  slider2.max = emojiCodes.length - 1;

  slider1.value = 0;
  slider2.value = 1;

  display1.textContent = emojiChars[0];
  display2.textContent = emojiChars[1];

  slider1.addEventListener("input", () => {
    display1.textContent = emojiChars[Number(slider1.value)];
    updateResult();
  });
  slider2.addEventListener("input", () => {
    display2.textContent = emojiChars[Number(slider2.value)];
    updateResult();
  });

  updateResult();
}

document.addEventListener("DOMContentLoaded", init);
