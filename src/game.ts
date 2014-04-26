var WIDTH = 400
var HEIGHT = 400
var DELTA = 4

var canvas: any = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var bounds = canvas.getBoundingClientRect()

interface Entity {
  x: Number;
  y: Number;

  dx: Number;
  dy: Number;

  compute(): void;
  draw(): void;
}

var you = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  draw: function() {
    ctx.arc(0, 0, 2, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
  },
  compute: function() {}
}

class Rock{
  x: Number;
  y: Number;
  constructor(xx: Number, yy: Number) {
    this.x = xx;
    this.y = yy;
  }
  dx = 0;
  dy= 0;
  draw = function() {
    ctx.arc(0, 0, 2, 0, 2 * Math.PI)
    ctx.fillStyle = "rgb(100,100,150)"
    ctx.fill()
  };
  compute = function() {};
}

var makeRock = function() {
  return new Rock(
    Math.random() * WIDTH - WIDTH / 2,
    Math.random() * HEIGHT - HEIGHT / 2) }


var x: any = 0
var y: any = 0

var computeOne = function(one: any) {
  one.compute()

  one.x += one.dx * DELTA;
  one.y += one.dy * DELTA;

  one.dx *= 0.9;
  one.dy *= 0.9;
}

var drawOne = function (one: any) {
  ctx.save()
  ctx.translate(one.x, one.y)
  ctx.beginPath()
  one.draw()
  ctx.restore()
}

var all: Array<Entity> = [you, makeRock(), makeRock(), makeRock(), makeRock(), makeRock(), makeRock()]

var render = function() {
  ctx.beginPath()
  var r = 0
  if (HEIGHT > WIDTH) {
    r = WIDTH / 2
  } else {
    r = HEIGHT / 2
  }
  ctx.arc(WIDTH / 2, HEIGHT / 2, r, 0, 2 * Math.PI)
  ctx.clip()

  ctx.beginPath()
  ctx.rect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = "rgb(50, 50, 50)"
  ctx.fill()

  ctx.save()
  ctx.translate(WIDTH / 2 - x, HEIGHT / 2 - y)
  for(var i = 0; i < all.length; i++) {
    var e: Entity = all[i]
    drawOne(e)
  }
  ctx.restore()
}

var compute = function(timeDelta: Number) {
  for(var i = 0; i < all.length; i++) {
    var e: Entity = all[i]
    computeOne(e)
  }

  x = you.x
  y = you.y
}

var handleKeypress = function(evt: any) {
  if (evt.keyCode === 38) {
    console.log("UP")
    you.dy = -1
  } else if (evt.keyCode === 40) {
    console.log("DOWN")
    you.dy = 1
  } else if (evt.keyCode === 37) {
    console.log("LEFT")
    you.dx = -1
  } else if (evt.keyCode === 39) {
    console.log("RIGHT")
    you.dx = 1
  }
}

document.addEventListener('keydown', handleKeypress)

var step = function(timeDelta: Number) {
  compute(timeDelta)
  render()
  requestAnimationFrame(step)
}

requestAnimationFrame(step)
