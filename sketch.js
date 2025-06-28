let skinsData;
let agent;
let canvaWidth;
let canvaHeight;

/*function preload() {
  skinsData = loadJSON("data/skins.json", () => {
    preloadAccessories(skinsData);
  });
}*/

function reforcar(){
  Reflect.get(agent, 'reforcar')(5);
  
}

function punir(){
  //Reflect.get(agent, 'reforcar')(-3);
  
  pyodide.runPython(`
agentAPet.reforcar(-3)
agentAPet.mouthType = "sad"
`);
}

function enviarInstrucao() {
  const instrucao = document.getElementById("inputInstrucao").value;
  pyodide.runPython(`agentAPet.antecedente_atual = ("${instrucao}",)`);

  document.getElementById("labelInputInstrucao").textContent = `Instrução atual: ${instrucao}`
}

function criarAPet() {
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
                       name="js_name", 
                       shape = "${formaCorpo}", 
                       eyeColor="${corOlhos}", 
                       mouthColor="${corBoca}")`);
      
  agent = pyodide.globals.get("agentAPet")
  //document.getElementById("customizacao").style.display = "none";   // esconde a div de customização
  document.getElementById("controls").style.display = "block";

  loopAPet();
}

function loopAPet() {
  const start = performance.now();
  pyodide.runPython("simular_em_loop()")
  
  const end = performance.now();
  //console.log(`Execução do passo: ${Math.round(end - start)} ms`);

  setTimeout(loopAPet, 20);
}

async function updateAgentsFromPyodide() {
  //const start = performance.now();

  if (typeof pyodide !== "undefined") {
    try {
      await pyodide.runPythonAsync("simular_em_loop()")

      // Pega a variável Python "agents" e transforma em array JavaScript (virou um array onde cada item é um array de chaves e valores)
      let pyAgents = pyodide.globals.get("agents").toJs({dict_converter: Object});

      // transformar o array de arrays recebido acima em um objeto JS
      agents = pyAgents.map(arrayOfPairs => {
      // Verificação opcional, mas boa prática, caso algum item não seja um array de pares
      if (Array.isArray(arrayOfPairs)) {
        return Object.fromEntries(arrayOfPairs);
      }
      return arrayOfPairs; // Retorna como está se não for um array (segurança)
      });
    } catch (e) {
      console.error("Erro ao acessar agents do Pyodide:", e);
    }
  } else {console.log("pyodide ainda não iniciado")}
  //const end = performance.now();
  //console.log(`Execução do passo: ${Math.round(end - start)} ms`);

  //setTimeout(updateAgentsFromPyodide, 20);
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