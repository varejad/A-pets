let skinsData;
let agent;
let canvaWidth;
let canvaHeight;

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
agentAPet.xp += magnitude_de_reforco
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
}

function criarAPeteUser() {
  const corCorpo = document.getElementById('cor-corpo').value;
  const formaCorpo = document.getElementById('forma-corpo').value;
  const corOlhos = document.getElementById('cor-olhos').value;
  const corBoca = document.getElementById('cor-boca').value;
  const APetName = document.getElementById('APetName').value;

  pyodide.globals.set("WIDTH", canvaWidth); // atualiza variáveis python
  pyodide.globals.set("HEIGHT", canvaHeight);

  pyodide.runPython(`
    agentAPet = Agents(responses, 
                       prob_variacao=0.0, 
                       positionX= WIDTH/2, 
                       positionY= HEIGHT - (HEIGHT/3), 
                       color="${corCorpo}", 
                       name="${APetName}", 
                       shape = "${formaCorpo}", 
                       eyeColor="${corOlhos}", 
                       mouthColor="${corBoca}")
    user = User()`);
      
  agent = pyodide.globals.get("agentAPet")
  user = pyodide.globals.get("user")
  document.getElementById("customizacao").style.display = "none";   // esconde a div de customização
  document.getElementById("controls").style.display = "block";
  document.getElementById("nomeApet").textContent = `${APetName}`
  atualizarInfos();

  loopAPet();
}

function loopAPet() {
  const start = performance.now();
  pyodide.runPython("simular_em_loop()")
  
  const end = performance.now();
  //console.log(`Execução do passo: ${Math.round(end - start)} ms`);

  setTimeout(loopAPet, 20);
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

function mostrarAvisoReforco() {
  document.getElementById("avisoReforcoOverlay").style.display = "flex";
}

function esconderAvisoReforco() {
  document.getElementById("avisoReforcoOverlay").style.display = "none";
}

function ganharReforcadores() {
  pyodide.runPython(`user.moedas += 50`);
  esconderAvisoReforco();
  atualizarInfos();

}
function atualizarInfos(){
  document.getElementById("moedas").textContent = `Moedas: ${Reflect.get(user, "moedas")}`
  document.getElementById("xp").textContent = `Experiencia: ${Reflect.get(agent, "xp")}`
}
