let __randomSeed = parseInt(tokenData.hash.slice(50, 58), 16)

function rnd(mn, mx) {
  __randomSeed ^= __randomSeed << 13
  __randomSeed ^= __randomSeed >> 17
  __randomSeed ^= __randomSeed << 5
  const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

function hshrnd(h) {
  const str = tokenData.hash.slice(2 + h*2, 4 + h*2)
  return parseInt(str, 16) / 255
}

const prb = x => rnd() < x

const posOrNeg = () => prb(0.5) ? 1 : -1

const sample = (a) => a[int(rnd(a.length))]
const hfix = h => (h + 360) % 360
const noop = () => {}

function drawCircle (points, getXY) {
  beginShape()
  curveVertex(...getXY(-1))
  for (let p = 0; p <= points + 1; p++) {
    MISPRINT_LATHE_MALFUNCTION && rotate(0.1)
    curveVertex(...getXY(p))
  }
  endShape()
}


const getXYRotation = (deg, radius, cx=0, cy=0) => [
  sin(deg) * radius + cx,
  cos(deg) * radius + cy,
]


const drawShape = (points, getXY, graphic=window) => {

  graphic.beginShape()
  graphic.curveVertex(...getXY(-1))
  times(points+2, p => {
    graphic.curveVertex(...handleMalfunction(getXY(p), graphic))
  })
  graphic.endShape()
}

function times(t, fn) {
  for (let i = 0; i < t; i++) fn(i)
}



