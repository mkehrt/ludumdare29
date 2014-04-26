var WIDTH = 400
var HEIGHT = 400

var canvas: any = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var bounds = canvas.getBoundingClientRect()

interface Entity {
  x: Number;
  y: Number;

  draw(): void;
}

var you = {
  x: 0,
  y: 0,
  draw: function() {
    ctx.arc(0, 0, 1, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
  }
}

var x: any = 0
var y: any = 0

var drawOne = function (one: any) {
  ctx.save()
  ctx.translate(one.x - x, one.y - y)
  ctx.beginPath()
  one.draw()
  ctx.restore()
}

var all: Array<Entity> = [you]

var render = function() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  for(var i = 0; i < all.length; i++) {
    var e: Entity = all[i]
    drawOne(e)
  }
}

var handleKeypress = function(evt: any) {
  console.log(evt)
  if (evt.keyCode === 38) {
    you.y--
  } else if (evt.keyCode === 40) {
    you.y++
  } else if (evt.keyCode === 37) {
    you.x--
  } else if (evt.keyCode === 39) {
    you.x++
  }
}

console.log("foo")
document.addEventListener('keydown', handleKeypress)


ctx.translate(200, 200)
setInterval(render, 1000 / 60)
