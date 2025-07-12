const etapasTutorial = [
  "Bem-vindo ao A-pet! \n\n Você acaba de ganhar seu A-pet, uma criaturinha que adora ganhar recompensas e vai fazer tudo para ganhar mais!",
  "Você pode usar isso para treina-lo a fazer o que você quiser.\n\n Quando ele fizer algo legal, clique em 'Recompensa' e ele vai fazer isso mais vezes!",
  "Quanto mais você ensinar mais coisas ele poderá fazer, em breve você poderá dar um nome, mudar a aparência, ensinar instruções e muito mais"
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

