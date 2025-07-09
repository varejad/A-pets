let skinsData;
let agent;
let canvaWidth;
let canvaHeight;
let tempoUltimoPasso = performance.now();
let passoIntervalo;

/*function preload() {
  skinsData = loadJSON("data/skins.json", () => {
    preloadAccessories(skinsData); 
  });
}*/

function reforcar(magnitudeDeReforco=5){
  if (Reflect.get(user, "moedas")>=magnitudeDeReforco){
    pyodide.runPython(`
magnitude_de_reforco = ${magnitudeDeReforco}
agentAPet.consequence += magnitude_de_reforco
agentAPet.pontucao_xp(magnitude_de_reforco)
agentAPet.mouthType = "smile"
user.moedas -= magnitude_de_reforco
`)
    esconderAvisoReforco();
  } else{
    mostrarAvisoReforco();
  }
  atualizarInfos();

  // CRIAR FORMULA PARA CONVERTER XP EM LEVEL
}

async function punir(magnitudeDePunicao=3){
  if (Reflect.get(user, "moedas")>= magnitudeDePunicao){
    pyodide.runPythonAsync(`
magnitude_de_punicao = ${magnitudeDePunicao}
if agentAPet.respostas_atuais[agentAPet._acao_atual][1] - magnitude_de_punicao > agentAPet.respostas_atuais[agentAPet._acao_atual][0]:
  agentAPet.reforcar(-3)
agentAPet.mouthType = "sad"
agentAPet.xp += 3
user.moedas -= magnitude_de_punicao
  `);
  // CRIAR FORMULA PARA CONVERTER XP EM LEVEL
    esconderAvisoReforco();
  } else{
    mostrarAvisoReforco();
  }
  atualizarInfos();

}

function enviarInstrucao() {
  const instrucao = document.getElementById("inputInstrucao").value;
  pyodide.runPython(`agentAPet.antecedente_atual = ("${instrucao}",)`);
  document.getElementById("labelInputInstrucao").textContent = `Instrução atual: ${instrucao}`

  // PARAR DE EXIBIR O ELEMENTO DA INSTRUÇÃO E MOSTRAR A INSTRUÇÃO ATUAL E UM BOTÃO PARA FAZER REAPARECER OS ELEMENTOS DE INSTRUÇÃO
}

// function customizar(){
//   const corCorpo = document.getElementById('cor-corpo').value;
//   const formaCorpo = document.getElementById('forma-corpo').value;
//   const corOlhos = document.getElementById('cor-olhos').value;
//   const corBoca = document.getElementById('cor-boca').value;
  
//   pyodide.runPython(`
//     agentAPet.color="${corCorpo}"
//     agentAPet.shape = "${formaCorpo}"
//     agentAPet.eyeColor="${corOlhos}"
//     agentAPet.mouthColor="${corBoca}"
//     `);

//   document.getElementById("customizacao").style.display = "none";   // esconde a div de customização
  
//   atualizarInfos();
// }

function criarAPeteUser() {
  //FUNÇÃO PARA RECUPERAR MEMÓRIA

  const corCorpo = document.getElementById('cor-corpo').value;
  const formaCorpo = document.getElementById('forma-corpo').value;
  const corOlhos = document.getElementById('cor-olhos').value;
  const corBoca = document.getElementById('cor-boca').value;
  //const APetName = document.getElementById('APetName').value;

  pyodide.globals.set("WIDTH", canvaWidth); // atualiza variáveis python
  pyodide.globals.set("HEIGHT", canvaHeight);

  pyodide.runPython(`
    agentAPet = Agents(responses, 
                       prob_variacao=0.0, 
                       positionX= WIDTH/2, 
                       positionY= HEIGHT - (HEIGHT/3), 
                       color="${corCorpo}", 
                       name="", 
                       shape = "${formaCorpo}", 
                       eyeColor="${corOlhos}", 
                       mouthColor="${corBoca}")
    user = User()`);
      
  agent = pyodide.globals.get("agentAPet")
  user = pyodide.globals.get("user")
  //document.getElementById("customizacao").style.display = "none";   // esconde a div de customização
  //document.getElementById("controls").style.display = "block";
  atualizarDesbloqueios(Reflect.get(agent,"level"))
  atualizarInfos();

  passoIntervalo = 1000 / pyodide.globals.get("PASSOS_POR_SEGUNDO"); // 20 passos por segundo = 50ms por passo
  loopAPet();
}

function loopAPet() {
  const agora = performance.now();
  const delta = agora - tempoUltimoPasso;
  if (delta >= passoIntervalo) {
    pyodide.runPython("simular_em_loop()");
    tempoUltimoPasso = agora;
  }
  //const start = performance.now();
  //const end = performance.now();
  //console.log(`Execução do passo: ${Math.round(end - start)} ms`);

  //requestAnimationFrame(loopAPet);
  setTimeout(loopAPet, 5);
}

function setup() {
  canvaWidth = Math.min(windowWidth - 10, 600);
  canvaHeight = Math.min(windowHeight/2, 800);
  let canvas = createCanvas(canvaWidth, canvaHeight);
  canvas.parent("simContainer");
}

function draw() {
  background(255);

   // Se não tiver agentes ainda, espere
  if (!agent || agent.length === 0) {
    return;
  }
drawAPet(agent, canvaWidth/2, canvaHeight/2);
}

// function mostrarAvisoReforco() {
//   document.getElementById("avisoReforcoOverlay").style.display = "flex";
// }

// function esconderAvisoReforco() {
//   document.getElementById("avisoReforcoOverlay").style.display = "none";
// }

// function ganharReforcadores() {
//   //RODAR ANUNCIO AQUI
//   pyodide.runPython(`user.moedas += 100`);
//   esconderAvisoReforco();
//   atualizarInfos();
// }

// function atualizarInfos(){ 
//   document.getElementById("spanMoedas").textContent = `${Reflect.get(user, "moedas")}`
//   document.getElementById("spanXp").textContent = `${Reflect.get(agent, "xp")}`
//   document.getElementById("spanNivel").textContent = `${Reflect.get(agent, "level")}`

// }

// function mostrarAvisoLevel() {
//   const mensagem = {
//     1: "🎉 Nível 1: Você pode personalizar as cores do seu A-pet!",
//     2: "🎉 Nível 2: Agora você pode escolher o nome do seu A-pet!",
//     3: "🎉 Nível 3: A opção de punição está desbloqueada!",
//     4: "🎉 Nível 4: Agora você pode dar instruções ao seu A-pet!"
//   };

//   const proximo = {
//     1: "Próximo nível: dar nome ao A-pet.",
//     2: "Próximo nível: desbloqueia punição.",
//     3: "Próximo nível: desbloqueia instruções.",
//     4: "Você desbloqueou tudo! 🎉"
//   };

//   document.getElementById("mensagemNivel").innerHTML = `
//     ${mensagem[Reflect.get(agent, "level")] || "Subiu de nível!"}<br><br>
//     ${proximo[Reflect.get(agent, "level")] || ""}
//   `;

//   // mostra input apenas no nível 2
//   const inputNome = document.getElementById("inputNome");
//   if (Reflect.get(agent,"level") === 2) {
//     inputNome.style.display = "block";
//     inputNome.value = ""; // limpa o campo
//   } else {
//     inputNome.style.display = "none";
//   }

//   document.getElementById("avisoNivelOverlay").style.display = "flex";
// }

// function esconderAvisoLevel(){
  
//   const nivel = Reflect.get(agent, "level");

//   // se nível 2, pegar nome do input
//   if (nivel === 2) {
//     const nome = document.getElementById("inputNome").value.trim();
//     if (nome) {
//       Reflect.set(agent, "name", nome); // atualiza no Pyodide
//       console.log("Nome do A-pet definido como:", nome);
//       document.getElementById("nomeAPet").innerHTML = `<b>${nome}</b>`

//     } else{return}
//   }

//   // fecha o modal
//   document.getElementById("avisoNivelOverlay").style.display = "none";
// }

// function atualizarDesbloqueios(level) {
//   if (level >= 1) {
//     document.getElementById("customizacao").style.display = "block";
//     document.getElementById("cor-corpo").style.display = "block";
//     document.getElementById("cor-olhos").style.display = "block";
//     document.getElementById("cor-boca").style.display = "block";
//     document.getElementById("forma-corpo").style.display = "block";
//   }

//   if (level >= 2) {
//     // document.getElementById("APetName").style.display = "block";
//   }

//   if (level >= 3) {
//     document.querySelector("button[onclick='punir()']").style.display = "block";
//   }

//   if (level >= 4) {
//     document.getElementById("inputInstrucao").style.display = "block";
//     document.querySelector("button[onclick='enviarInstrucao()']").style.display = "block";
//     console.log("nivel 4")
//   }
// }

// function bloquearTudoInicialmente() {
//   document.getElementById("customizacao").style.display = "none" 
//   document.getElementById("cor-corpo").style.display = "none" 
//   document.getElementById("cor-olhos").style.display = "none" 
//   document.getElementById("cor-boca").style.display = "none" 
//   document.getElementById("forma-corpo").style.display = "none" 
//   //document.getElementById("APetName").style.display = "none" 
//   document.getElementById("inputInstrucao").style.display = "none" 
//   document.querySelector("button[onclick='punir()']").style.display = "none" 
//   document.querySelector("button[onclick='enviarInstrucao()']").style.display = "none" 
// }