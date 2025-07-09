function customizar(){
  const corCorpo = document.getElementById('cor-corpo').value;
  const formaCorpo = document.getElementById('forma-corpo').value;
  const corOlhos = document.getElementById('cor-olhos').value;
  const corBoca = document.getElementById('cor-boca').value;
  
  pyodide.runPython(`
    agentAPet.color="${corCorpo}"
    agentAPet.shape = "${formaCorpo}"
    agentAPet.eyeColor="${corOlhos}"
    agentAPet.mouthColor="${corBoca}"
    `);

  document.getElementById("customizacao").style.display = "none";   // esconde a div de customização
  
  atualizarInfos();
}

function mostrarAvisoReforco() {
  document.getElementById("avisoReforcoOverlay").style.display = "flex";
}

function esconderAvisoReforco() {
  document.getElementById("avisoReforcoOverlay").style.display = "none";
}

function ganharReforcadores() {
  //RODAR ANUNCIO AQUI
  pyodide.runPython(`user.moedas += 100`);
  esconderAvisoReforco();
  atualizarInfos();
}

function atualizarInfos(){ 
  document.getElementById("spanMoedas").textContent = `${Reflect.get(user, "moedas")}`
  document.getElementById("spanXp").textContent = `${Reflect.get(agent, "xp")}`
  document.getElementById("spanNivel").textContent = `${Reflect.get(agent, "level")}`

}

function mostrarAvisoLevel() {
  const mensagem = {
    1: "🎉 Nível 1: Você pode personalizar as cores do seu A-pet!",
    2: "🎉 Nível 2: Agora você pode escolher o nome do seu A-pet!",
    3: "🎉 Nível 3: A opção de punição está desbloqueada!",
    4: "🎉 Nível 4: Agora você pode dar instruções ao seu A-pet!"
  };

  const proximo = {
    1: "Próximo nível: dar nome ao A-pet.",
    2: "Próximo nível: desbloqueia punição.",
    3: "Próximo nível: desbloqueia instruções.",
    4: "Você desbloqueou tudo! 🎉"
  };

  document.getElementById("mensagemNivel").innerHTML = `
    ${mensagem[Reflect.get(agent, "level")] || "Subiu de nível!"}<br><br>
    ${proximo[Reflect.get(agent, "level")] || ""}
  `;

  // mostra input apenas no nível 2
  const inputNome = document.getElementById("inputNome");
  if (Reflect.get(agent,"level") === 2) {
    inputNome.style.display = "block";
    inputNome.value = ""; // limpa o campo
  } else {
    inputNome.style.display = "none";
  }

  document.getElementById("avisoNivelOverlay").style.display = "flex";
}

function esconderAvisoLevel(){
  
  const nivel = Reflect.get(agent, "level");

  // se nível 2, pegar nome do input
  if (nivel === 2) {
    const nome = document.getElementById("inputNome").value.trim();
    if (nome) {
      Reflect.set(agent, "name", nome); // atualiza no Pyodide
      console.log("Nome do A-pet definido como:", nome);
      document.getElementById("nomeAPet").innerHTML = `<b>${nome}</b>`

    } else{return}
  }

  // fecha o modal
  document.getElementById("avisoNivelOverlay").style.display = "none";
}

function atualizarDesbloqueios(level) {
  if (level >= 1) {
    document.getElementById("customizacao").style.display = "block";
    document.getElementById("cor-corpo").style.display = "block";
    document.getElementById("cor-olhos").style.display = "block";
    document.getElementById("cor-boca").style.display = "block";
    document.getElementById("forma-corpo").style.display = "block";
  }

  if (level >= 2) {
    // document.getElementById("APetName").style.display = "block";
  }

  if (level >= 3) {
    document.querySelector("button[onclick='punir()']").style.display = "block";
  }

  if (level >= 4) {
    document.getElementById("inputInstrucao").style.display = "block";
    document.querySelector("button[onclick='enviarInstrucao()']").style.display = "block";
    console.log("nivel 4")
  }
}

function bloquearTudoInicialmente() {
  document.getElementById("customizacao").style.display = "none" 
  document.getElementById("cor-corpo").style.display = "none" 
  document.getElementById("cor-olhos").style.display = "none" 
  document.getElementById("cor-boca").style.display = "none" 
  document.getElementById("forma-corpo").style.display = "none" 
  //document.getElementById("APetName").style.display = "none" 
  document.getElementById("inputInstrucao").style.display = "none" 
  document.querySelector("button[onclick='punir()']").style.display = "none" 
  document.querySelector("button[onclick='enviarInstrucao()']").style.display = "none" 
}