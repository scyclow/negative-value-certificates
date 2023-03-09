
function signature(x, y, charSize, invert) {
  if (COUNTERFEIT) return
  push()
  noFill()
  strokeWeight(1.5)
  const chars = 8
  const xVar = 0.1
  const yVar = 0.75
  const xstart = x - charSize*chars
  const ystart = y + charSize/2
  let x0 = xstart
  let y0 = ystart

  const points = [
    [x0 - rnd(charSize), y0 - rnd(charSize)],
    [x0, y0]
  ]


  times(chars, letter => {
    const up = prb(0.75)
    const x1 = x0 + charSize*(1+xVar*(up ? -7 : 7))/2
    const y1 = y0 + (up
      ? prb(0.85) ? charSize*rnd(0, 0.3) : charSize*rnd(1, 1.5)
      : -1*(prb(0.5) ? charSize*rnd(0, 0.3) : charSize*rnd(1, 1.5))
    )

    const x2 = x0 + charSize*rnd(1-xVar, 1+xVar)
    const y2 = y0 + charSize*rnd(-0.1, 0.1)
    points.push([x1, y1])
    points.push([x2, y2])
    x0 = x2
    y0 = y2
  })

  points.push([x0 + rnd(charSize), y0 + rnd(charSize)])

  invert ? stroke(DARK_C) : stroke(LIGHT_C)
  beginShape()
  points.forEach(([x, y]) => curveVertex(x+1, y+1))
  endShape()


  invert ? stroke(ACCENT_C) : stroke(DARK_C)
  beginShape()
  points.forEach(([x, y]) => curveVertex(x, y))
  endShape()

  pop()
}

let uniqNum = (n) => {
  let r = rnd()+''
  return r[2] !== n ? r[2] : uniqNum(n)
}
let numStr = (n=2) => rnd().toFixed(3).slice(2,2+n)

function genSerialNumber() {
  let num = ""
  const digits = n => times(n, _ => num += numStr())
  // REPEATER
  if (COOL_SERIAL_NUM === 0) {
    digits(2)
    num = num + num
  }
  // RADAR
  else if (COOL_SERIAL_NUM === 1) {
    digits(2)
    num = num + num.split('').reverse().join('')
  }
  // INCREASING
  else if (COOL_SERIAL_NUM === 2) {
    digits(4)
    num = num.split('').sort().join('')
  }
  // DECREASING
  else if (COOL_SERIAL_NUM === 3) {
    digits(4)
    num = num.split('').sort().reverse().join('')
  }
  // LOW
  else if (COOL_SERIAL_NUM === 4) {
    num = "00000" + numStr(3)
  }
  // HIGH
  else if (COOL_SERIAL_NUM === 5) {
    num = "99999" + numStr(3)
  }
  // BINARY
  else if (COOL_SERIAL_NUM === 6) {
    const n1 = uniqNum('0')
    times(8, _ => num += sample(['0', n1]))
  }
  else
    digits(4)

  return num
}

function serialNumber(x, y) {
  if (COUNTERFEIT) return
  push()
  const sNumber = genSerialNumber()
  fill(LIGHT_C)
  stroke(DARK_C)
  rect(x, y, STAR_NOTE ? 72 : 60, 20)
  drawStr(sNumber, x+30,y+10, 0.125, DARK_C, ACCENT_C)
  if (STAR_NOTE) {
    fill(ACCENT_C)
    stroke(ACCENT_C)
    drawShape(10, i =>  getXYRotation(i*TWO_PI/10, i % 2 === 0 ? 2.5 : 6, x+63, y+ 10))
  }
  pop()
}


const __onlyRotate = prb(0.5)
function handleMalfunction([x, y], g=window) {
  if (MISPRINT_LATHE_MALFUNCTION) {
    g.rotate(0.1)
    return [
      x + (__onlyRotate ? 0 : rnd(-10, 10)),
      y + (__onlyRotate ? 0 : rnd(-10, 10)),
    ]
  } else return [x,y]
}

const holoWidth = 20
function drawHolo(x) {
  push()
  strokeWeight(2)
  const dashed = prb(0.3)
  const w = holoWidth/2
  for (let y = 0; y < H; y++) {
    stroke(
      lerpColor(
        color(hue(ACCENT_C), saturation(ACCENT_C), lightness(ACCENT_C), 50),
        color(hue(BRIGHT_DARK_C), saturation(BRIGHT_DARK_C), lightness(BRIGHT_DARK_C), 50),
        y/H
      )
    )

    dashed && int(y/50) % 3 === 0 ? noop() : line(x-w, y+T,x+w, y+T)
  }
  pop()
}