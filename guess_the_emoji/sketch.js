// Guess the Emoji
// Guess the Emoji is an interactive game designed to stimulate logical thinking and agility through an entertaining interface.
// Created by KJ Ha
// Please visit https://guess-the-emoji.glitch.me/ to try it for yourself.

let video;
let poseNet;
let poses = [];
let noseX = 0;
let noseY = 0;
let pg;

let emojis = [];
let bgs = [];
let quiz;
let emoK, emoV;
let nums;
let stage;
let currentStage = 0;
let timer;
let counter = 0;
let interval;
let shuffleBg;
let newNewBg;

let arrx, arry;
let mode = 0;

function preload() {
  quiz = loadJSON("quiz.json");
  emoK = Object.keys(quiz);
  emoV = Object.values(quiz);
}

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);

  timer = createP("timer");

  startGame();
  resetSketch(nums[0]);

  shuffleBg = shuffle(bg);

  for (var i = 0; i < 30; i++) {
    var bx = random(width);
    var by = random(height);
    var br = random(60, 125);
    var newBg = new Bubble(bx, by, br, shuffleBg[i], "", 0);
    bgs.push(newBg);
  }
}

function mousePressed() {
  if (mode == 0) {
    if (mouseX > 200 && mouseX < 400 && mouseY > 360 && mouseY < 415) {
      mode = 1;
    }
  }
}

function draw() {
  background(255);
  if (mode == 0) {
    mainPage();
  } else if (mode == 1) {
    gamePage();
    for (let i = emojis.length - 1; i >= 0; i--) {
      if (emojis[i].contains(width - noseX, noseY)) {
        emojis.splice(i, 1);
      }
    }
  }
}

class Bubble {
  constructor(x, y, r, txt, n, alpha) {
    this.x = x;
    this.y = y;
    this.r = r;
    // this.n = randomN;
    this.emoji = txt;
    this.name = `Find: ${n}`;
    this.a = alpha;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r / 2) {
      return true;
    } else {
      return false;
    }
  }

  move() {
    this.x = this.x + random(-2, 2);
    this.y = this.y + random(-2, 2);
  }

  show() {
    textSize(this.r);
    fill(0);
    text(this.emoji, this.x, this.y);
    textSize(25);
    push();

    textAlign(CENTER);
    rectMode(CENTER);
    fill(55, 100, 100, this.a);
    rect(width / 2, height - 60, textWidth(this.name) * 1.1, 40);
    fill(0, this.a);
    text(this.name, width / 2, height - 50);

    // text(this.name, width / 2, height - 100);
    pop();
  }
}

function resetSketch(num) {
  MAX = 545;
  MIN = 85;

  // Create two random points within the screen
  arrx = addLeaves(randomBetween((width * 1) / 5, (width * 4) / 5));
  arry = addLeaves(randomBetween((height * 1) / 5, (height * 4) / 5));

  for (var i = 0; i < 2; i++) {
    let x = arrx[i];
    let y = arry[i];
    let r = random(60, 125);
    let emoji = [];
    emoji[i] = Object.values(quiz)[num][i];
    var name = Object.keys(quiz)[num];
    var b = new Bubble(x, y, r, emoji[i], name, 255);
    emojis.push(b);
  }
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

function mainPage() {
  background("MediumSlateBlue");
  let startButtonColor = 75;

  textFont("Verdana");
  textAlign(CENTER);
  if (mouseX > 200 && mouseX < 400 && mouseY > 360 && mouseY < 415) {
    startButtonColor = 75;
  } else {
    startButtonColor += 20;
  }

  let play = "LET'S PLAY";
  let ins =
    "All you need to do is use your nose to find\nthe two emojis that make up the presented word!\nMake sure your webcam is on.";
  let cWidth = textWidth(play);
  noStroke();
  textSize(42);
  textStyle(BOLD);
  fill("Gold");
  text("GUESS THE EMOJI", width / 2, height / 2 - 60);

  push();
  fill(255);
  textAlign(CENTER);
  textStyle(NORMAL);
  textSize(14);
  textLeading(19);
  textStyle(ITALIC);
  text(ins, 125, height / 2 - 12, 360);
  pop();

  fill(338, 84, startButtonColor);

  rect(width / 2 - cWidth / 2 - 18, height / 2 + 62, cWidth + 36, 50);
  textSize(30);
  fill(255);
  text(play, width / 2, height / 2 + 98);
}

function startGame() {
  video = createCapture(VIDEO);
  video.size(width, height);
  pixelDensity(1);
  pg = createGraphics(width, height);
  video.hide();
  angleMode(DEGREES);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function(results) {
    poses = results;
  });

  stage = 9;
  textFont("Avenir");

  nums = [];

  while (nums.length < stage) {
    var r = Math.floor(Math.random() * Object.entries(quiz).length);
    if (nums.indexOf(r) === -1) nums.push(r);
  }
}

function gamePage() {
  const flippedVideo = ml5.flipImage(video);
  image(flippedVideo, 0, 0, width, height);
  image(pg, 0, 0, width, height);

  push();
  textSize(50);
  textAlign(CENTER);
  text("🔴", width - noseX, noseY + 20);
  pop();
  drawKeypoints();

  startTimer();

  // Generate random background emojis
  for (var i = 0; i < bgs.length; i++) {
    bgs[i].move();
    bgs[i].show();
  }

  // Generate random quiz
  for (var j = 0; j < emojis.length; j++) {
    emojis[j].move();
    emojis[j].show();
  }

  if (emojis.length == 0) {
    currentStage++;
    resetSketch(nums[currentStage]);
    bgs = [];
    shuffleBg = shuffle(bg);
    for (var l = 0; l < 30; l++) {
      var newbx = random(width);
      var newby = random(height);
      var newbr = random(60, 125);
      newNewBg = new Bubble(newbx, newby, newbr, shuffleBg[l], "", 0);
      bgs.push(newNewBg);
    }
  }

  // Final page design
  if (currentStage == stage - 1) {
    stopTimer();
    background("DarkTurquoise");
    let message;
    let resetButtonColor = 70;

    textStyle(NORMAL);
    textStyle(ITALIC);
    textSize(14);
    fill(100);
    text(`total time played: ${counter} seconds`, width / 2, height / 2 + 20);
    textStyle(BOLD);
    textSize(35);
    fill("yellow");
    noStroke();

    if (counter <= (stage - 1) * 10) {
      message = "Excellent performance!";
    } else if (counter <= (stage - 1) * 15) {
      message = "Good job!";
    } else {
      message = "You can do better next time!";
    }
    text(message, width / 2, height / 2 - 40);

    if (mouseX > 200 && mouseX < 400 && mouseY > 360 && mouseY < 415) {
      resetButtonColor = 70;
    } else {
      resetButtonColor += 30;
    }
    fill(254, 100, resetButtonColor);
    rect(width / 2 - 188 / 2 - 18, height / 2 + 62, 188 + 36, 50);

    fill(100);
    textSize(30);
    text("Play Again", width / 2, height / 2 + 98);
    if (
      mouseIsPressed &&
      mouseX > 200 &&
      mouseX < 400 &&
      mouseY > 360 &&
      mouseY < 415
    ) {
      mode = 0; // Go back to the main page
      currentStage = 0; // Reset stage
      counter = 0; // Reset timer
      startGame();
    }
  }
}
