const etapasTutorial = [
  "Este é seu A-pet! Ele aprende com você.",
  "Você pode recompensar ações clicando no botão 'Recompensa'.",
  "Tente clicar em 'Recompensa' para ensinar algo.",
  "Ótimo! O A-pet está aprendendo com você.",
  "Você também pode dar instruções clicando em 'Enviar'.",
  "Agora você está pronto para começar sua jornada!"
];

let etapaAtual = 0;

function iniciarTutorial() {
  etapaAtual = 0;
  document.getElementById("tutorialOverlay").style.display = "flex";
  document.getElementById("tutorialText").innerText = etapasTutorial[etapaAtual];
  document.getElementById("botaoTutorial").innerText = "Avançar";
}

function avancarTutorial() {
  etapaAtual++;
  if (etapaAtual < etapasTutorial.length) {
    document.getElementById("tutorialText").innerText = etapasTutorial[etapaAtual];
    if (etapaAtual === etapasTutorial.length - 1) {
      document.getElementById("botaoTutorial").innerText = "Começar";
    }
  } else {
    document.getElementById("tutorialOverlay").style.display = "none";
    localStorage.setItem("tutorialVisto", "true");
  }
}

