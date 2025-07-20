let accessoryImages = {}; // dicionário com as imagens carregadas

function preloadAccessories(skins) {
  for (let key in skins) {
    accessoryImages[key] = loadImage(skins[key].image);
  }
}

// Função principal que desenha um A-Pet
function drawAPet(petData) {
  push();
  translate(petData.positionX, petData.positionY);
  
  rotate(radians(petData.angle)); // Rotaciona o canvas em torno do ponto (x, y)

  // Desenhar corpo
  fill(petData.color || "#cccccc");

  const size = petData.size;

  switch (petData.shape) {
  case "circle":
    ellipse(0, 0, size, size);
    break;
  case "square":
    rectMode(CENTER);
    rect(0, 0, size, size, 10);
    break;
  case "triangle":
    smoothTriangle(0, 0, size); // aqui você desenha com base no centro local
    break;
  default:
    console.log("default")
    ellipse(0, 0, size, size);
}

  // Desenhar rosto
  drawEyes(petData);
  drawMouth(petData);

  // Acessórios
  // if (petData.accessories && accessoryImages) {
  //   for (let acc of petData.accessories) {
  //     const img = accessoryImages[acc];
  //     if (img) {
  //       imageMode(CENTER);
  //       image(img, 0, -size / 2 + 10, 40, 40); // exemplo: chapéu no topo
  //     }
  //   }
  // }

  pop();
}

// Desenha olhos simples
function drawEyes(petData) {
  noStroke();
  fill(petData.eyeColor || "#cccccc");

  type = petData.eyesType || "round";
  if (type === "round") {
    ellipse(-10, -10, 8, 8);
    ellipse(10, -10, 8, 8);
  } else if (type === "x") {
    stroke(0);
    line(-13, -13, -7, -7);
    line(-13, -7, -7, -13);
    line(7, -13, 13, -7);
    line(7, -7, 13, -13);
  } else if (type === "line") {
    rectMode(CENTER);
    rect(-10, -10, 8, 2);
    rect(10, -10, 8, 2);
  }
}

// Desenha bocas simples
function drawMouth(petData) {
  fill(petData.mouthColor || "#cccccc");
  stroke(0);
  strokeWeight(2);

  type = petData.mouthType || "smile";
  if (type === "smile") {
    arc(0, 10, 20, 10, 0, PI);
  } else if (type === "sad") {
    arc(0, 15, 20, 10, PI, 0);
  } else if (type === "o") {
    ellipse(0, 10, 5, 5);
  } else if (type === "flat") {
    noFill();
    arc(0, 10, 10, 5, 0, PI);
  }
}

// Triângulo mais suave visualmente
function smoothTriangle(x, y, size) {
  const h = (Math.sqrt(3) / 2) * size;
  const halfSize = size / 2;
  const r = 10; // raio do canto (não usado aqui diretamente, mas pode ser futuramente para suavizar)

  // Triângulo apontando para cima, centralizado em (x, y)
  beginShape();
  vertex(x, y - h / 2);         // topo
  vertex(x - halfSize, y + h / 2); // canto inferior esquerdo
  vertex(x + halfSize, y + h / 2); // canto inferior direito
  endShape(CLOSE);
}

function drawCenario() {
  // Céu
  background(135, 206, 235);

  // Chão
  fill(34, 139, 34);
  rect(0, height - height/3, width, height/3);

  // Casinha
  fill(150, 75, 0);
  rect(width - width/3, height - height/3 - 50, 70, 50);
  fill(200, 0, 0);
  triangle(width - width/3 - 20, height - height/3 - 50, width - width/3 + 70 +20, height - height/3 - 50, width - width/3 + 35, height - height/3 - 100);
}

