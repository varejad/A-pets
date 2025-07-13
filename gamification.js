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

  //document.getElementById("customizacao").style.display = "none";   // esconde a div de customização
  
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
    1: "🎉 PARABÉNS! Seu A-Pet chegou ao NÍVEL 1<br><br> Você desbloqueou o botão de punição, use esse botão quando seu A-Pet fizer algo que você não quer que ele faça mais!",
    2: "🎉 PARABÉNS! Seu A-Pet chegou ao NÍVEL 2<br><br>Agora você pode escolher o nome do seu A-pet!",
    3: "🎉 PARABÉNS! Seu A-Pet chegou ao NÍVEL 3<br><br> Agora chegou a hora de customizar seu A-Pet do jeito que quiser",
    4: "🎉 PARABÉNS! Seu A-Pet chegou ao NÍVEL 4<br><br> Agora você pode dar instruções ao seu A-pet!"
  };

  const proximo = {
    1: "No próximo nível você poderá dar um nome ao seu A-pet.",
    2: "No próximo nível você poderá customizar seu A-pet do seu jeito!",
    3: "Próximo nível: desbloqueia instruções.",
    4: "Você desbloqueou tudo por enquanto! Fique de olho nas novidades 🎉"
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
  console.log(level)
  if (level >= 1) {
    document.querySelector("button[onclick='punir()']").style.display = "block";
    console.log("lvl1")
  }

  if (level >= 2) {
    // document.getElementById("APetName").style.display = "block";
    console.log("lvl2")
  }

  if (level == 3) {
    document.getElementById("customizacao").style.display = "block";
    document.getElementById("exibirIcones").style.display = "block";
    document.getElementById("iconeCustomizacao").style.display = "block";
    console.log("lvl3")
  }

  if (level >= 4) {
    document.getElementById("instrucao").style.display = "flex"
    document.getElementById("iconeInstrucao").style.display = "block"
    console.log("nivel 4")
  }
}

function bloquearTudoInicialmente() {
  document.getElementById("customizacao").style.display = "none" 
  //document.getElementById("exibirIcones").style.display = "none"  
  document.getElementById("instrucao").style.display = "none" 
  document.querySelector("button[onclick='punir()']").style.display = "none" 
  console.log("bloq")
}

function toggle(div, display){
  if (document.getElementById(`${div}`).style.display == `${display}`){
    document.getElementById(`${div}`).style.display = 'none'
  }else{document.getElementById(`${div}`).style.display = `${display}`}

  if (div === 'icones'){
    if (document.getElementById('botaoIcones').textContent == '🔼'){
      document.getElementById('botaoIcones').textContent = '🔽';
    } else{document.getElementById('botaoIcones').textContent = '🔼'}
  }
}

function alternarIdioma() {
  console.log("🔁 Alternar idioma (ainda será implementado)");
  alert("Alternar idioma será implementado em breve.");
}

function resetarAPet() {
  if (confirm("Tem certeza que deseja resetar seu A-pet?")) {
    location.reload(); // Simples por enquanto, reinicia tudo
  }
}