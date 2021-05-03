let Balloon;
let balloons = [];
let Button;
let buttons = [];
let helium;
let interval = 70;

let wordList = ["hamburger", "sandwich", "croissant", "ketchup", "popcorn", "noodles"];
let word;

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let target;
let colors = ["LightSalmon", "Crimson", "Coral", "OrangeRed", "DarkOrange", "OliveDrab", "ForestGreen", "Lime", "LightSeaGreen", "Teal", "Cyan", "DeepSkyBlue", "Gold", "Yellow", "Violet", "Fuchsia", "DarkViolet", "Navy"];

let life = 10;
// let life = 0;
let wordLength;

function setup() {
  createCanvas(600, 700);
  word = random(wordList);
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
}

function draw() {
  background(255, 193, 37);
  stroke(0);
  fill(255);
  rectMode(CORNER)
  rect(8, 8, width - 16, height - 16, 10);
  noFill();
  noStroke();

  push();
  var result = word.toUpperCase().split("");

  for (var k = 0; k < result.length; k++) {
    // fill(150);
    fill(0);

    textSize(20);
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
  textSize(20);
  text(life + " Lives Left", width / 2, 50);
  textStyle(ITALIC);
  text(word.length + "-letter", width - 120, 50);
  pop();
  
  push();
  if (life == 0) {
    fill(255);
    rectMode(CENTER);
    stroke(0);
    strokeWeight(5);
    rect(width / 2, height / 2 - 16, 375, 120, 15);
    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(50);
    textStyle(BOLD);
    text("GAME OVER!", width / 2, height / 2)
  }

  if (wordLength == 0) {
    fill(255);
    rectMode(CENTER);
    stroke(0);
    strokeWeight(5);
    rect(width / 2, height / 2 - 16, 375, 120, 15);
    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(50);
    textStyle(BOLD);
    text("STAGE CLEAR!", width / 2, height / 2)
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
          // life += 10;
          scoring = true;
          wordLength -= 1;
          // } else if (buttons[i].alpha != 255) {
          //   scoring = true;
          // } else {
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
  // console.log(target, scoring);

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
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.r);
    // fill(0);
    text(this.letter, this.pos.x, this.pos.y);
  }
}
