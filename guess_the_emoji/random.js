let MAX;
let MIN;
let BUFFER = 200;
let MAXCOUNT = 2;

function randomBetween(min, max) {
  return {
    val: Math.floor(Math.random() * (max - min + 1) + min)
  }
}

function addLeaves(f, min = MIN - BUFFER, max = MAX + BUFFER, arr = []) {
  if (arr.length >= MAXCOUNT) return arr
  arr.push(f.val)
  f.left = (min + BUFFER < f.val - BUFFER) && addLeaves(randomBetween(min + BUFFER, f.val - BUFFER), min, f.val, arr)
  f.right = (f.val + BUFFER < max - BUFFER) && addLeaves(randomBetween(f.val + BUFFER, max - BUFFER), f.val, max, arr)
  return arr
}