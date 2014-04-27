var WIDTH = 400
var HEIGHT = 400

var WORLD_WIDTH = 3000;
var WORLD_HEIGHT = 3000;

var RADIUS = 5
var DELTA = 1

var canvas: any = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var bounds = canvas.getBoundingClientRect()

var dirtCanvas = document.createElement('canvas');
dirtCanvas.width  = WORLD_WIDTH;
dirtCanvas.height = WORLD_HEIGHT;
var dirtLayer: any = dirtCanvas.getContext('2d')
dirtLayer.fillStyle = "rgb(50,50,50)"
dirtLayer.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

interface Entity {
  x: Number;
  y: Number;

  compute(): void;
  draw(): void;
}

var you = {
  x:  WORLD_WIDTH / 2,
  y: 150,
  oldX: 0,
  oldY: 0,
  dx: 0,
  dy: 0,
  draw: function() {
    ctx.arc(0, 0, RADIUS, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
  },
  compute: function() {
    this.oldX = this.x
    this.oldY = this.y

    this.x += this.dx * DELTA;
    this.y += this.dy * DELTA;

    if (this.y > WORLD_HEIGHT - RADIUS) {
      this.y = WORLD_HEIGHT - RADIUS
      this.dy = -this.dy * 3
    } else if (this.y < 0) {
      this.dy += 0.1
    }

    if (this.x > WORLD_WIDTH) {
      this.x = WORLD_WIDTH - RADIUS
      this.dx = -this.dx * 3
    } else if (this.x < 0) {
      this.x = RADIUS
      this.dx = -this.dx * 3
    }

    if (this.y > 0) {
      this.dx *= 0.9;
      this.dy *= 0.9;
    }
  }
}

class Rock{
  x: Number;
  y: Number;
  constructor(xx: Number, yy: Number) {
    this.x = xx;
    this.y = yy;
  }
  draw = function() {
    ctx.arc(0, 0, 2, 0, 2 * Math.PI)
    ctx.fillStyle = "rgb(100,100,150)"
    ctx.fill()
  };
  compute = function() {};
}

var makeRock = function() {
  return new Rock(Math.random() * WORLD_WIDTH, Math.random() * WORLD_HEIGHT)
}


class Gem{
  x: Number;
  y: Number;
  color: String;

  constructor(xx: Number, yy: Number, color: String) {
    this.x = xx;
    this.y = yy;
    this.color = color;
  }
  draw = function() {
    ctx.rotate(Math.PI / 4)
    ctx.rect(-2.5, -2.5, 5, 5)
    ctx.fillStyle = this.color
    ctx.fill()
  };
  compute = function() {};
}

var makeGem = function() {
  var c = Math.floor(Math.random() * 4)
  var color = ""
  switch (c) {
    case 0: color = "red"; break;
    case 1: color = "lightgreen"; break;
    case 2: color = "blue"; break;
    default: color = "yellow"; break;
  }
  return new Gem (
    Math.random() * WORLD_WIDTH,
    Math.random() * WORLD_HEIGHT,
    color)
}

var outside = {
  x: 0,
  y: -HEIGHT,

  draw: function() {
    ctx.rect(0, 0, WORLD_WIDTH, HEIGHT)
    ctx.fillStyle = "lightblue"
    ctx.fill()

    ctx.beginPath()
    ctx.rect(0, HEIGHT - 10, WORLD_WIDTH, 10)
    ctx.fillStyle = "green"
    ctx.fill()
  },

  compute: function() {}

}

var lavaGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT)
lavaGradient.addColorStop(0, 'red')
lavaGradient.addColorStop(0.6, 'yellow')
lavaGradient.addColorStop(1, 'yellow')

var lava = {
  x: 0,
  y: WORLD_HEIGHT - 1,

  draw: function() {
    ctx.rect(0, 0, WORLD_WIDTH, HEIGHT)
    ctx.fillStyle = lavaGradient
    ctx.fill()

    if (you.y > WORLD_HEIGHT * 5 / 6) {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = "rgba(255, 50, 0, " + (you.y - (WORLD_HEIGHT * 5 / 6)) / (WORLD_HEIGHT / 6) * 2 / 3 + ")"
      ctx.fillRect(0,0,WIDTH,HEIGHT)
      ctx.restore()
    }
  },

  compute: function() {}

}


var computeOne = function(one: any) {
  one.compute()

}

var drawOne = function (one: any) {
  ctx.save()
  ctx.translate(one.x, one.y)
  ctx.beginPath()
  one.draw()
  ctx.restore()
}

var updateDirt = function() {
  dirtLayer.save()

  dirtLayer.beginPath
  dirtLayer.moveTo(you.oldX, you.oldY)
  dirtLayer.lineTo(you.x, you.y)
  
  dirtLayer.lineWidth = 12
  dirtLayer.lineCap = 'round'
  dirtLayer.strokeStyle = 'black'
  dirtLayer.stroke()

  dirtLayer.restore()
}

var all: Array<Entity> = []

for (var i = 0; i < 1500; i++) {
  var r = makeRock()
  all.push(r)
}

for (var i = 0; i < 500; i++) {
  var g = makeGem()
  all.push(g)
}

all.push(outside, you, lava)

var render = function() {
  ctx.clearRect(0,0,WIDTH, HEIGHT)

  ctx.beginPath()
  var r = 0
  if (HEIGHT > WIDTH) {
    r = WIDTH / 2
  } else {
    r = HEIGHT / 2
  }
  ctx.arc(WIDTH / 2, HEIGHT / 2, r, 0, 2 * Math.PI)
  ctx.clip()

  ctx.save()
  ctx.translate(WIDTH / 2 - you.x, HEIGHT / 2 - you.y)

  updateDirt()
  ctx.drawImage(dirtCanvas, 0, 0)

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
}

var handleKeypress = function(evt: any) {
  if (evt.keyCode === 38) {
    console.log("UP")
    if(you.y >= 0) { you.dy += -1 }
  } else if (evt.keyCode === 40) {
    console.log("DOWN")
    you.dy += 1
  } else if (evt.keyCode === 37) {
    console.log("LEFT")
    you.dx += -1
  } else if (evt.keyCode === 39) {
    console.log("RIGHT")
    you.dx += 1
  }
}


document.addEventListener('keydown', handleKeypress)

var step = function(timeDelta: Number) {
  compute(timeDelta)
  render()
  requestAnimationFrame(step)
}

requestAnimationFrame(step)
