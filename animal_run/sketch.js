// Animal Run
// Animal Run is a voice-controlled game designed to help players to refresh their vocabulary.
// Created by KJ Ha
// Please visit https://animal-run.glitch.me/ to try it for yourself.

let animalList = {
  fox: "🦊",
  cat: "🐱",
  dog: "🐶",
  mouse: "🐭",
  hamster: "🐹",
  rabbit: "🐰",
  unicorn: "🦄",
  pig: "🐷",
  lion: "🦁",
  tiger: "🐯"
};

let colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"]; // background colors
let bg;
let myfont;
let speechRec;
let textAr = [];
let firstWord = []; // for word display

// spoken word display
let duration = 1650;
let wordTime;
let alpha;

let r = []; // for randomizing animals
let animal = []; // animal array
let animalN, animalF; // animal name and face
let rAnimal; // random animal for main page

// playtime counting
let timer;
let counter = 0;
var interval;

let player = 3; // default player num
let mode = 0; // starting with main page

function preload() {
  myfont = loadFont('fonts/MagicMushroom pu.otf');
  // myfont = loadFont("https://cdn.glitch.com/354faff7-6997-4a2c-b455-e100b40b4e5e%2FMagicMushroom%20pu.otf?v=1607415663136");
}

function setup() {
  createCanvas(425, 625);
  textAlign(CENTER);
  animalN = Object.keys(animalList);
  animalF = Object.values(animalList);
  rAnimal = random(animalF);
  timer = createP("timer");

  startGame();
}

function draw() {
  if (mode == 0) {
    mainPage();
  } else if (mode == 1) {
    playerPage();
  } else if (mode == 2) {
    gamePage();
  }
}

function mainPage() {
  background(255);
  fill(0);
  textFont("Helvetica");
  textSize(90);
  text(rAnimal, width / 2, (height * 2) / 7 + 160);

  textSize(60);
  var ins =
    "Say any words with the first letter of the animal. Don't repeat words and click anywhere to start!";
  push();
  textFont(myfont);
  textSize(60);
  text("Animal Run!", width / 2, (height * 2) / 7);
  fill(0);

  textSize(14);
  textLeading(20);
  text(ins, width / 2 - 110, (height * 2) / 7 + 260, 218);
  pop();
}

function playerPage() {
  background(255);
  fill(0);

  textFont("Helvetica");
  textSize(90);
  text(rAnimal, width / 2, (height * 2) / 7 + 160);

  push();
  textFont(myfont);
  textSize(40);
  text("How many players?", width / 2, 195);
  py = 427;

  pButton(120, py, "1");
  pButton(width / 2, py, "2");
  pButton(305, py, "3");
  pop();
}

var findDuplicates = arr =>
  arr.filter((item, index) => arr.indexOf(item) != index);

function startGame() {
  bg = colors[int(random(colors.length))];
  var limit = player;

  while (r.length < limit) {
    var random_number = Math.floor(Math.random() * 10);
    if (r.indexOf(random_number) == -1) {
      r.push(random_number);
    }
  }

  var s = new p5.Speech();
  speechRec = new p5.SpeechRec(gotSpeech);

  let continuous = false;
  let interimResults = false;
  speechRec.start(continuous, interimResults);
  speechRec.onEnd = restart;

  function gotSpeech(speech) {
    speech.text = speech.text.toLowerCase();
    var sp = speech.text.split(" ");
    var len = sp.length;
    wordTime = millis();

    for (var i = 0; i < len; i++) {
      textAr.push(sp[i]);

      var newTextAr = [...new Set(findDuplicates(textAr))];

      for (var j = 0; j < player; j++) {
        if (
          mode == 2 &&
          sp[i][0] != animalN[r[j]][0] &&
          newTextAr.includes(sp[i]) == false
        ) {
          animal[j].moveUp(sp[i].split(animalN[r[j]][0]).length - 1);
        }
      }
      // console.log(newTextAr, textAr);
      firstWord.push(sp[i]);
    }
  }

  animal[0] = new Animal(80, r[0]);
  animal[1] = new Animal(width / 2, r[1]);
  animal[2] = new Animal(width - 80, r[2]);
}

function gamePage() {
  startTimer();
  push();
  background(bg);
  if (player == 1) {
    translate(width / 2 - 80, 0);
  } else if (player == 2) {
    translate(70, 0);
  }

  for (var i = 0; i < player; i++) {
    animal[i].show();
  }
  pop();

  push();
  if (firstWord.length > 0) {
    var a = firstWord[firstWord.length - 1];
    var repeating = [...new Set(findDuplicates(firstWord))];
    textFont(myfont);
    // console.log(firstWord[firstWord.length-1]);
    var repeat = "(repeated!)";
    if (millis() > wordTime + duration) {
      a = "";
      repeat = "";
    }
    textSize(50);
    text(a, width / 2, height / 2 - 100);
    textSize(32);
    if (repeating.includes(firstWord[firstWord.length - 1])) {
      text(repeat, width / 2, height / 2 - 50);
    }
  }
  pop();
}

class Animal {
  constructor(x, r) {
    this.x = x;
    this.y = height - 45;
    // this.y = height - 500; // for testing
    this.r = r;
  }

  show() {
    alpha = 255;
    fill(0, alpha);
    textSize(78);
    text(animalF[this.r], this.x, this.y);

    push();
    if (this.y <= 10) {
      stopTimer();
      alpha = 0;
      firstWord;
      textAr = null;
      fill(0);
      textFont("Verdana");
      textSize(18);
      var message;

      if (player == 1) {
        translate(-132, 0);
        message = `${animalF[this.r]} total time played: ${counter} sec ${
          animalF[this.r]
        }`;
      } else if (player == 2) {
        translate(-70, 0);
        message = `winner is ${
          animalF[this.r]
        }! total time played: ${counter} sec`;
      } else {
        message = `winner is ${
          animalF[this.r]
        }! total time played: ${counter} sec`;
      }

      fill(255);
      rectMode(CENTER);
      rect(width / 2, height / 2 - 6, 410, 28);
      rect(width / 2, height / 2 + 80, 170, 50, 10);

      fill(0);
      push();
      textFont(myfont);
      textSize(24);

      text("START AGAIN", width / 2, height / 2 + 90);
      pop();

      text(message, width / 2, height / 2);

      if (
        mouseIsPressed &&
        mouseX > 130 &&
        mouseX < 300 &&
        mouseY > 350 &&
        mouseY < 400
      ) {
        mode = 0;
        textAr = [];
        firstWord = [];
        r = [];
        player = 3;
        counter = 0;
        startGame();
      }
    }
    pop();
  }

  moveUp(step) {
    this.y -= step * 50;
  }
}

function mousePressed() {
  if (mode == 0 && mouseY < 390) {
    mode = 1;
  }

  if (mode == 1 && mouseY > 400 && mouseY < 452) {
    if (mouseX > 90 && mouseX < 150) {
      player = 1;
      mode = 2;
    } else if (mouseX > 195 && mouseX < 255) {
      player = 2;
      mode = 2;
    } else if (mouseX > 295 && mouseX < 355) {
      player = 3;
      mode = 2;
    }
    console.log("game started!");
  }
}

function pButton(x, y, txt) {
  fill(255);
  rectMode(CENTER);
  rect(x, y, 60, 50, 10);
  fill(0);
  textSize(40);
  text(txt, x, y + 15);
}

function startTimer() {
  if (!interval) {
    interval = setInterval(timeIt, 1000);
  }
}

function stopTimer() {
  clearInterval(interval);
  interval = false;
}

function timeIt() {
  timer.html(counter);
  counter++;
}

function restart() {
  speechRec.start();
}