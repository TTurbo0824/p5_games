// Modified from Nature of Code's repository, Steering Behavior Examples https://editor.p5js.org/codingtrain/collections/S4nJEexPF
// KJ Ha
// Please visit https://editor.p5js.org/kh1785/present/_YHzwobV8  to try it for yourself.

let vehicle;
let target
let protector;
var posx;
var posy;
let counter = 5;
let timer;
let timeCounter = 0;
let interval;

function setup() {
  createCanvas(500, 500);
  timer = createP('timer');

  vehicle = new Vehicle(100, 100);
  posx = width / 2;
  posy = height / 2;
}

function draw() {
  background(0);
  noStroke();

  textAlign(CENTER);
  textSize(15);
  fill(255);
  text(counter + " Lives Left", width - 60, 30);

  fill("red");
  target = createVector(posx, posy);
  circle(posx, posy, 25);

  fill("blue");
  protector = createVector(mouseX, mouseY);
  circle(protector.x, protector.y, 25);

  if (counter > 0) {
    startTimer();
    if (dist(target.x, target.y, vehicle.pos.x, vehicle.pos.y) < 10) {
      posx = random(width);
      posy = random(height);
      counter--;
    } else if (dist(protector.x, protector.y, target.x, target.y) < 50) {
      posx = random(width);
      posy = random(height);
    }

    vehicle.seek(target);
    vehicle.edges();
    vehicle.update();
    vehicle.show();
  }

  if (counter == 0) {
    stopTimer();
    push();
    noStroke();
    fill("yellow");
    textSize(45);
    textStyle(BOLD);
    text("Game Over!", width / 2, height / 2 - 30);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 80, 100, 45);

    textSize(20);
    text("Total time played: " + timeCounter + " sec", width / 2, height / 2 + 20);

    fill("red");
    textSize(20);
    text("Restart", width / 2, height / 2 + 85);
    pop();
  }
}

function mousePressed() {
  if (counter == 0) {
    counter = 5;
    timeCounter = 0;
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
  timer.html(timeCounter);
  timeCounter++;
}
