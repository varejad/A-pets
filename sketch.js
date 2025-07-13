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
  document.getElementById("inputInstrucao").style.display = 'none';
  document.getElementById("botaoInstrucao").style.display = 'none';
}

function criarAPeteUser() {
  //FUNÇÃO PARA RECUPERAR MEMÓRIA

  const corCorpo = document.getElementById('cor-corpo').value;
  const formaCorpo = document.getElementById('forma-corpo').value;
  const corOlhos = document.getElementById('cor-olhos').value;
  const corBoca = document.getElementById('cor-boca').value;

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

  //requestAnimationFrame(loopAPet); TALVEZ MELHORE A PERFORMANCE
  setTimeout(loopAPet, 5);
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
drawCenario();
drawAPet(agent);
}