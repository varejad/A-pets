//let t = translations[currentLanguage];

const translations = {
  pt: {
    carregando: "Carregando... por favor aguarde",
    nomeAPet: "Nome do seu A-pet:",
    experiencia: "Experiência:",
    moedas: "Moedas:",
    reforcar: "Recompensa!",
    punir: "Punição!",
    criar: "Criar",
    semMoedas: "⚠️ Você não tem reforçadores suficientes!",
    ganhar: "Ganhar mais",
    fechar: "Fechar",
    instrucao: "Instrução:",
    enviar: "Enviar"
  },
  en: {
    carregando: "Loading... wait, please",
    nomeAPet: "Your A-pet's name:",
    experiencia: "Experience:",
    moedas: "Coins:",
    reforcar: "Reward!",
    punir: "Punish!",
    criar: "Create",
    semMoedas: "⚠️ You don't have enough reinforcers!",
    ganhar: "Get more",
    fechar: "Close",
    instrucao: "Instruction:",
    enviar: "Send"
  }
};

let currentLang = "pt";

function setLanguage(lang) {
  currentLang = lang;
  translateUI();
}

function t(key) {
  return translations[currentLang][key] || key;
}

function translateUI() {
  const loadingText = document.getElementById("loadingText");
  const xpLabel = document.getElementById("xpLabel");
  const moedasLabel = document.getElementById("moedasLabel");

  if (loadingText) loadingText.textContent = t("loading");
  if (xpLabel) xpLabel.textContent = t("experiencia");
  if (moedasLabel) moedasLabel.textContent = t("moedas");
}