let faixa;
let faixaLarguraInicial = 200;
let faixaCurvatura = 0.5;
let faixaVelocidade = 2;
let faixaDificuldade = 0.005;
let faixaLarguraMinima = 80;
let faixaTempoTotal = 0;
let gameOver = false;

function setupFaixa() {
  faixa = {
    y: 0,
    segmentos: [],
    largura: faixaLarguraInicial,
    centroX: width / 2
  };

  for (let i = 0; i < height; i += 10) {
    faixa.segmentos.push({
      y: i,
      centroX: faixa.centroX,
      largura: faixa.largura
    });
  }

  gameOver = false;
  faixaTempoTotal = 0;

  pyodide.runPython(`agentAPet.positionX = ${faixa.centroX}`)
}

function drawFaixaAmbiente() {
  if (gameOver) {
    fill("#c00");
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Fim de Jogo!", width / 2, height / 2);
    return;
  }

  background("#eef");

  faixaTempoTotal += deltaTime / 1000;
  faixa.largura = max(
    faixaLarguraMinima,
    faixaLarguraInicial - faixaTempoTotal * faixaDificuldade * 100
  );

  // Atualiza segmentos
  for (let i = 0; i < faixa.segmentos.length; i++) {
    let seg = faixa.segmentos[i];
    seg.y += faixaVelocidade;
    seg.centroX += random(-faixaCurvatura, faixaCurvatura);
  }

  // Remove segmentos fora da tela e adiciona novos
  if (faixa.segmentos[faixa.segmentos.length - 1].y > height) {
    faixa.segmentos.shift();
    faixa.segmentos.unshift({
      y: 0,
      centroX:
        faixa.segmentos[faixa.segmentos.length - 1].centroX +
        random(-faixaCurvatura, faixaCurvatura),
      largura: faixa.largura
    });
  }

  // Desenha faixa
  noStroke();
  fill("#ccc");
  for (let seg of faixa.segmentos) {
    rect(seg.centroX - seg.largura / 2, seg.y, seg.largura, 10);
  }

  // Atualiza posição do A-pet
//   pyodide.runPython("agentAPet.to_respond(agentAPet.antecedente_atual)");
//   pyodide.runPython("agentAPet.passos_restantes -= 1")

  // Desenha A-pet
//   drawAPet(agent, agent.positionX, height - 60);

  // Verifica colisão com a faixa
  // let pos = faixa.segmentos.find((s) =>
  //   Math.abs(s.y - (height - 60)) < 10
  // );
  // if (
  //   !pos ||
  //   agent.positionX < pos.centroX - pos.largura / 2 ||
  //   agent.positionX > pos.centroX + pos.largura / 2
  // ) {
  //   gameOver = true;
  // }
  console.log("segmento 0.y: "+faixa.segmentos[0].y + "  altura da tela: " + height + " quantidade faixas: "+faixa.segmentos.length)
}
