let skinsData;

let agents = []
let agent;
let canvaWidth;
let canvaHeight;

/*function preload() {
  skinsData = loadJSON("data/skins.json", () => {
    preloadAccessories(skinsData);
  });
}*/

function criarAPet() {
  const corCorpo = document.getElementById('cor-corpo').value;
  const formaCorpo = document.getElementById('forma-corpo').value;
  const corOlhos = document.getElementById('cor-olhos').value;
  const corBoca = document.getElementById('cor-boca').value;

  pyodide.runPython(`
    agentAPet = Agents(responses, 
                       prob_variacao=0.0, 
                       positionX=200, 
                       positionY=200, 
                       color="${corCorpo}", 
                       name="js_name", 
                       shape = "${formaCorpo}", 
                       eyeColor="${corOlhos}", 
                       mouthColor="${corBoca}")`);
      
  agent = pyodide.globals.get("agentAPet")
  console.log(agent.color + "\n-----------\n" + Reflect.get(agent))
  drawAPet(agent, canvaWidth/2, canvaHeight/2);
}


async function setInitialConditionsAndStart() {
  const selectedColor = document.getElementById("agentColor").value;
  const agentName = document.getElementById("agentName").value || "Sem nome";
  // Passa os valores do JS para variáveis globais no Python
  pyodide.globals.set("js_color", selectedColor);
  pyodide.globals.set("js_name", agentName);

  // Agora usa essas variáveis no código Python
  await pyodide.runPythonAsync(`
    agents = [
      Agents(responses, prob_variacao=0.0, positionX=50, positionY=50, color=js_color, name=js_name),
    ]
  `);
  agent = pyodide.globals.get("agents").get(0);
  pyodide.globals.set("WIDTH", canvaWidth);
  pyodide.globals.set("HEIGHT", canvaHeight);
  document.getElementById("main").style.display = "block"; // mostra a div
  document.getElementById("setAgent").style.display = "none";   // esconde o botão
  document.getElementById("titulo").textContent = `Treine ${agentName}`

  updateAgentsFromPyodide();
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

  setTimeout(updateAgentsFromPyodide, 20);
}

function setup() {
  canvaWidth = Math.min(windowWidth - 10, 600);
  canvaHeight = Math.min(windowHeight/2, 800);
  let canvas = createCanvas(canvaWidth, canvaHeight);
  canvas.parent("simContainer");

  //setInitialConditions();
}


function draw() {
  background(255);

   // Se não tiver agentes ainda, espere
  if (!agent || agent.length === 0) {
    return;
  }
drawAPet(agent, canvaWidth/2, canvaHeight/2);

  // drawAPet({
  //   shape: "circle",
  //   color: "#6ec1e4",
  //   eyes: "round",
  //   mouth: "smile",
  //   accessories: []
  //   }, canvaWidth/2, canvaHeight/2);
}