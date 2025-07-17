let tempoTotalObs = 0
let geradorDeObstaculos;
let larguraInicial;
let alturaInicial = 15
let listaObstaculos = [];
let probGerarObstaculo = 0.01;
let velocidadeObstaculo = 1;
let dificuldade = 1;
let quatidadeMaxObs = 4;
let tamanhoMaxObs;
let gameOverObs = false;


function setupObstaculo(){
  console.log("setupObs")
  listaObstaculos = [];
  larguraInicial = width/6
  tamanhoMaxObs = width/2
  gameOverObs = false;
  tempoTotalObs = 0;
  //BOTAR VARIÁVEIS INICIAIS AQUI
  
    geradorDeObstaculos = {
    y: -20,
    x: width / 2,
    largura: larguraInicial,
    altura: alturaInicial,
  }

  pyodide.runPython(`
  agentAPet.positionX = ${width / 2}
  agentAPet.positionY = ${height - height/5}
  `)
}

function drawObstaculo(){
  if (gameOverObs) {
    fill("#c00");
    textAlign(CENTER, CENTER);
    textSize(24);
    text(`Fim de Jogo!\nSeu tempo foi ${tempoTotalObs.toFixed(1)} segundos\nVocê ganhou ${tempoTotalObs.toFixed(0)*2} moedas\ne seu a-pet ganhou ${tempoTotalObs.toFixed(0)*2} de experiência!!`, width / 2, height / 2);  
    return;
  }
  
  background("#eef");
  tempoTotalObs += deltaTime / 1000;

  // atualiza gerador
  geradorDeObstaculos.x = random(0, width)

  //gerar obstaculos
  if (random(0,1) < probGerarObstaculo && listaObstaculos.length < quatidadeMaxObs){
    listaObstaculos.push({
      x: geradorDeObstaculos.x,
      y: geradorDeObstaculos.y,
      largura: geradorDeObstaculos.largura,
      altura: geradorDeObstaculos.altura,
    })
  }

  // atualizar obstaculos
  for (let obs of listaObstaculos){
    obs.y += velocidadeObstaculo
  }

  // atualiza dificuldade

  // colisão
  let petX = Reflect.get(agent, "positionX");
  let petY = Reflect.get(agent, "positionY");
  let petSize = Reflect.get(agent, "size"); // Assumindo que o A-pet tem um tamanho

  for (let obs of listaObstaculos) {
    // Lógica de colisão simples (retângulo com retângulo)
    // Você precisará ajustar os offsets se o A-pet for desenhado pelo centro
    let petLeft = petX - petSize / 2;
    let petRight = petX + petSize / 2;
    let petTop = petY - petSize / 2;
    let petBottom = petY + petSize / 2;

    let obsLeft = obs.x;
    let obsRight = obs.x + obs.largura;
    let obsTop = obs.y;
    let obsBottom = obs.y + obs.altura;

    if (
      petRight > obsLeft &&
      petLeft < obsRight &&
      petBottom > obsTop &&
      petTop < obsBottom
      ) {
      gameOverObs = true;
      pyodide.runPython(`
      agentAPet.xp += ${tempoTotalObs.toFixed(0)*2}
      user.moedas += ${tempoTotalObs.toFixed(0)*2}
      `)
      atualizarInfos();
      break; // Sai do loop assim que uma colisão é detectada
    }
  }

  //desenhar obstaculo
  noStroke();
  fill("#ccc");
  for (let obs of listaObstaculos){
    rect(obs.x, obs.y, obs.largura, obs.altura)
  }

  // apagar obstaculos fora da tela
  if(listaObstaculos.length){
    if (listaObstaculos[0].y > height){
      listaObstaculos.shift();
      console.log(listaObstaculos.length)
    }
  }
}