let skinsData;
let agent;
let canvaWidth;
let canvaHeight;
let tempoUltimoPasso = performance.now();
let passoIntervalo;

// function preload() {
//   skinsData = loadJSON("data/skins.json", () => {
//     preloadAccessories(skinsData); 
//   });
// }

function reforcar(magnitudeDeReforco=5){
  if (Reflect.get(user, "moedas")>=magnitudeDeReforco){
    pyodide.runPython(`
magnitude_de_reforco = ${magnitudeDeReforco}
agentAPet.consequence += magnitude_de_reforco * 4
agentAPet.pontucao_xp(magnitude_de_reforco)
agentAPet.mouthType = "smile"
user.moedas -= magnitude_de_reforco
print(agentAPet._antecedentes_e_respostas)
`)
    //esconderAvisoReforco();
  } else{
    toggle("avisoReforcoOverlay", "flex")
    //mostrarAvisoReforco();
  }
  atualizarInfos();
}

async function punir(magnitudeDePunicao=3){
  if (Reflect.get(user, "moedas")>= magnitudeDePunicao){
    pyodide.runPythonAsync(`
magnitude_de_punicao = ${magnitudeDePunicao}
if agentAPet.respostas_atuais[agentAPet._acao_atual][1] - magnitude_de_punicao*4 > agentAPet.respostas_atuais[agentAPet._acao_atual][0]:
  agentAPet.reforcar(-magnitude_de_punicao * 5)
agentAPet.mouthType = "sad"
agentAPet.xp += magnitude_de_punicao
user.moedas -= magnitude_de_punicao
  `);
    //esconderAvisoReforco();
    //toggle("avisoReforcoOverlay", "flex")
  } else{
    //mostrarAvisoReforco();
    toggle("avisoReforcoOverlay", "flex")
  }
  atualizarInfos();

}

// VER O TRATAMENTO DO INPUT DE INSTRUÇÃO (TIRAR ESPAÇOS)
function enviarInstrucao() {
  const instrucao = document.getElementById("inputInstrucao").value;
  pyodide.runPython(`
agentAPet.instrucao_atual = "${instrucao}"
  `);

  if (Reflect.get(agent, 'instrucoes').toJs().indexOf(`${instrucao}`) == -1){ //verifica se a instrução dada já foi dada antes, caso n, adiciona na lista
    console.log("não tem na lista")
    const novoBotao = document.createElement('button');
    novoBotao.textContent = `${instrucao}`;
    document.getElementById('instrucoesConhecidas').appendChild(novoBotao);
    novoBotao.onclick = function() {
                    document.getElementById('inputInstrucao').value = novoBotao.textContent
                };
    pyodide.runPython(`agentAPet.instrucoes.append("${instrucao}")`)
  } else{console.log("já tem na lista")}

  document.getElementById("labelInputInstrucao").textContent = `Instrução atual: ${instrucao}`
  document.getElementById('instrucoesConhecidas').style.display = 'none';
  document.getElementById("inputInstrucao").style.display = 'none';
  document.getElementById("botaoInstrucao").style.display = 'none';
}

function criarAPetEUser() {
  const corCorpo = document.getElementById('cor-corpo').value;
  const formaCorpo = document.getElementById('forma-corpo').value;
  const corOlhos = document.getElementById('cor-olhos').value;
  const corBoca = document.getElementById('cor-boca').value;

  pyodide.globals.set("WIDTH", canvaWidth); // atualiza variáveis python
  pyodide.globals.set("HEIGHT", canvaHeight);

  // Tenta carregar dados salvos
  const savedAPetData = localStorage.getItem("aPetData");
  const savedUserData = localStorage.getItem("userData");

  let initialAgentPythonCode = "";
  let initialUserPythonCode = "";

  if (savedAPetData && savedUserData) {
      console.log("Carregando estado do jogo salvo...");
      const agentData = JSON.parse(savedAPetData);
      const userData = JSON.parse(savedUserData);

      // Constrói o código Python para inicializar o A-pet com os dados salvos
      initialAgentPythonCode = `
        agentAPet = Agents(responses,
                           prob_variacao=0.0,
                           positionX= WIDTH/2,
                           positionY= HEIGHT - (HEIGHT/3),
                           color="${agentData.color}",
                           name="${agentData.name}",
                           shape = "${agentData.shape}",
                           eyeColor="${agentData.eyeColor}",
                           mouthColor="${agentData.mouthColor}")
        agentAPet.xp = ${agentData.xp}
        agentAPet.level = ${agentData.level}
        agentAPet.instrucoes = ${JSON.stringify(agentData.instrucoes).replace(/"/g, "'")} # Converta array JS para lista Python
        # agentAPet._antecedentes_e_respostas = ${JSON.stringify(agentData.aprendizado).replace(/"/g, "'")}
        agentAPet._antecedentes_e_respostas = ${agentData.aprendizado}
      `;
      // Inicializa o usuário com os dados salvos
      initialUserPythonCode = `user = User()\nuser.moedas = ${userData.moedas}`;

      // Define o nome na UI imediatamente se existir
      document.getElementById("nomeAPet").innerHTML = `<b>${agentData.name || "A-pet sem nome"} </b><span id="spanNomeAPet"></span>`;

  } else {
      console.log("Nenhum estado salvo encontrado. Iniciando novo jogo.");
      initialAgentPythonCode = `
    agentAPet = Agents(responses, 
                       prob_variacao=0.0, 
                       positionX= WIDTH/2, 
                       positionY= HEIGHT - (HEIGHT/3), 
                       color="${corCorpo}", 
                       name="", 
                       shape = "${formaCorpo}", 
                       eyeColor="${corOlhos}", 
                       mouthColor="${corBoca}")
    `
    initialUserPythonCode = `user = User()`
  }

  pyodide.runPython(initialAgentPythonCode);
  pyodide.runPython(initialUserPythonCode);

      
  agent = pyodide.globals.get("agentAPet")
  user = pyodide.globals.get("user")
  atualizarDesbloqueios(Reflect.get(agent,"level"))
  atualizarInfos();
  // CRIA OS BOTÕES COM INSTRUÇÕES JA ENSINADAS
  Reflect.get(agent, 'instrucoes').toJs().forEach(function(element) {
    const novoBotao = document.createElement('button');
    novoBotao.textContent = `${element}`;
    document.getElementById('instrucoesConhecidas').appendChild(novoBotao);
    novoBotao.onclick = function() {
                    document.getElementById('inputInstrucao').value = novoBotao.textContent
                };
    });

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

  requestAnimationFrame(loopAPet); // TALVEZ MELHORE A PERFORMANCE
  //setTimeout(loopAPet, 5);
}

function setup() {
  canvaWidth = Math.min(windowWidth - 50, 580);
  canvaHeight = Math.min(windowHeight/2, 800);
  let canvas = createCanvas(canvaWidth, canvaHeight);
  canvas.parent("simContainer");
  document.getElementById('simContainer').style.maxWidth = `${canvaWidth + 20}px`
  document.getElementById('simContainer').style.width = `${canvaWidth + 20}px`
}

function draw() {
  background(255);

   // Se não tiver agentes ainda, espere
  if (!agent || agent.length === 0) {
    return;
  }

  if (gameState === "default") {
    drawCenario();
  } else if (gameState === "faixa") {
    if (!gameIniciado) {
      setupFaixa();
      gameIniciado = true;
    }
    drawFaixaAmbiente();
  }else if(gameState === "obstaculo"){
    if (!gameIniciado) {
      setupObstaculo();
      gameIniciado = true;
    }
    drawObstaculo();
  }

  

drawAPet(agent);
}