let myFont, myFont2;
let Balloon;
let balloons = [];
let Button;
let buttons = [];
let helium;
let interval = 70;

let wordList = [
  ["Food", "hamburger"],
  ["Food", "sandwich"],
  ["Food", "croissant"],
  ["Food", "ketchup"],
  ["Food", "popcorn"],
  ["Food", "noodles"],
  ["Animal", "raccoon"],
  ["Animal", "leopard"],
  ["Animal", "rhinoceros"],
  ["Animal", "chipmunk"],
  ["Animal", "hedgehog"],
  ["Animal", "giraffe"],
  ["Animal", "flamingo"],
  ["Sport", "wrestling"],
  ["Sport", "badminton"],
  ["Sport", "basketball"],
  ["Sport", "marathon"],
  ["Object", "umbrella"],
  ["Object", "microphone"],
  ["Object", "newspaper"],
  ["Object", "toothbrush"],
  ["Object", "bandage"],
  ["Color", "purple"],
  ["Color", "mustard"],
  ["Color", "magenta"],
  ["Color", "burgundy"],
  ["Color", "turquoise"],
  ["Color", "ultramarine"]
];

let word;
let category;

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let target;
let colors = ["LightSalmon", "Crimson", "Coral", "OrangeRed", "DarkOrange", "OliveDrab", "ForestGreen", "Lime", "LightSeaGreen", "Teal", "Cyan", "DeepSkyBlue", "Gold", "Yellow", "Violet", "Fuchsia", "DarkViolet", "Navy"];

let life = 10;
// let life = 0;
let wordLength;

function preload() {
  myFont = loadFont('Brokenbrush.ttf');
  myFont2 = loadFont('MagicMushroom pu.otf');
}

function setup() {
  createCanvas(600, 700);
  resetGame();
}

function draw() {
  background(255, 193, 37);
  stroke(50);
  strokeWeight(2);
  fill(255);
  rectMode(CORNER)
  rect(12, 12, width - 25, height - 25, 10);
  noFill();
  noStroke();

  push();
  var result = word.toUpperCase().split("");

  for (var k = 0; k < result.length; k++) {
    fill(0);
    textFont(myFont2);
    textSize(24);

    if (k < 7) {
      text(result[k], 70 + k * interval, height / 2 - 70);
    } else {
      text(result[k], 70 + (k - 7) * interval, height / 2 + 30);
    }
  }
  pop();

  for (var i = 0; i < balloons.length; i++) {
    balloons[i].applyForce();
    balloons[i].update();
    balloons[i].edges();
    balloons[i].show();
  }

  for (var j = 0; j < buttons.length; j++) {
    buttons[j].show();
  }

  push();
  fill(0);
  textStyle(NORMAL);
  textSize(24);
  textFont('Helvetica');
  text("💛 ✖️", 60, 50);
  textFont(myFont);
  text(life, 105, 50);
  textSize(22);
  textAlign(LEFT);
  text(category + " " + word.length + "-letter", width - 190, 50);
  pop();
  push();
  if (life == 0) {
    background(204,134, 9, 50);

    fill(255);
    rectMode(CENTER);
    stroke(0);
    strokeWeight(3);
    rect(width / 2, height / 2 - 16, 275, 100, 15);
    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(50);
    textStyle(BOLD);
    textFont(myFont);
    text("GAME OVER!", width / 2, height / 2)
  }

  if (wordLength == 0) {
    background(204,134, 9, 50);
    noStroke();
    stroke(0);
  strokeWeight(3);
    fill(255, 193, 37);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 36, 320, 75, 50);

    textAlign(CENTER);
    textSize(45);
    textStyle(BOLD);
    fill(0);
    textFont(myFont2);
    noStroke();
    text("STAGE CLEAR!", width / 2, height / 2 - 20);
    textStyle(NORMAL);
    textSize(25);
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(width / 2, height / 2 + 67, 160, 55, 10);
    noStroke();
    fill(0);
    textFont(myFont);
    text("Next Stage", width / 2, height / 2 + 75);
  }
  pop();
}

function mousePressed() {
  var scoring = true;

  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].contain(mouseX, mouseY) && buttons[i].alpha == 255 && life > 0 && wordLength != 0) {
      target = letters[buttons[i].letter];
      for (var j = 0; j < balloons.length; j++) {
        if (target == balloons[j].letter) {
          balloons[j].force = helium;
          scoring = true;
          wordLength -= 1;
        } else if (word.includes(target) == false) {
          scoring = false;
        }
      }
      buttons[i].alpha = 75;
    }
  }
  if (scoring == false) {
    life -= 1;
  }
  if (wordLength == 0) {
    if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 && mouseY > height / 2 + 39 && mouseY < height / 2 + 95) {
      resetGame();
    }
  }
}

class Buttons {
  constructor(x, y, letter, alpha) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.alpha = alpha;
  }

  contain(px, py) {
    let d = dist(px, py, 90 + 35 * this.x, this.y);
    if (d < 10) {
      return true;
    } else {
      return false;
    }
  }
  show() {
    strokeWeight(1.5);
    stroke(10, this.alpha);
    fill(255, 193, 37, this.alpha);
    rectMode(CENTER);
    rect(90 + 35 * this.x, this.y, 30, 27, 8);
    noStroke();
    fill(0, this.alpha);
    textSize(14);
    textAlign(CENTER);
    textFont('Arial');
    text(letters[this.letter].toUpperCase(), 90 + 35 * this.x, this.y + 5);
  }
}

class Balloons {
  constructor(x, y, c, force, letter) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 65;
    this.c = c;
    this.force = force;
    this.letter = letter;
  }

  applyForce() {
    this.acc.add(this.force);
  }

  edges() {
    if (this.pos.y <= this.r) {
      this.vel.y *= -0.75;
      this.pos.y = this.r;
    }
    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
      this.pos.x = width - this.r;
    } else if (this.pos.x <= this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    noStroke();
    textStyle(NORMAL);
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.r);
    // fill(0);
    text(this.letter, this.pos.x, this.pos.y);
  }
}

function resetGame() {
  balloons = [];
  buttons = [];

  push();
  num = Math.floor(Math.random() * (wordList.length));
  word = wordList[num][1];
  // word = "a";
  category = wordList[num][0];

  wordLength = word.length;
  helium = createVector(0, random(-0.01, -0.05));
  for (var i = 0; i < word.length; i++) {
    if (i < 7) {
      Balloon = new Balloons((i + 1) * interval, height / 2 - 75, random(colors), 0, word[i]);
    } else {
      Balloon = new Balloons((i - 6) * interval, height / 2 + 25, random(colors), 0, word[i]);
    }
    balloons.push(Balloon);
  }

  for (var j = 0; j < letters.length; j++) {
    if (j < 13) {
      Button = new Buttons(j, height - 120, j, 255);
    } else {
      Button = new Buttons(j - 13, height - 85, j, 255);
    }
    buttons.push(Button);
  }
  console.log(word);
  pop();
}
