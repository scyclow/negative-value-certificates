function drawBgPattern() {
  switch (BG_PATTERN) {
    case 0: byteBg(); break
    case 1: chainLinkBg(); break
    case 2: labrynthBg(); break
    case 3: pennyPincherBg(); break
    case 4: fabricBg(); break
    case 5: cyclesBg(); break
    case 6: mainframeBg(); break
    case 7: arrowBg(); break
    case 8: denominationTexture(); break
  }
}

function getBG() {
  const r = rnd()

  if (prb(IS_CRYPTO ? 0.125 : 0.01)) return 0
  else if (r < 0.125) return 1
  else if (r < 0.25) return 2
  else if (r < 0.375) return 3
  else if (r < 0.5) return 4
  else if (r < 0.625) return 5
  else if (r < 0.75) return 6
  else if (r < 0.875) return 7
  else return 8
}

function squigTexture() {
  push()
  noFill()

  strokeWeight(rnd(0.1, 0.5))
  const squigs = 40

  for (let i=0; i<squigs; i++) {
    stroke(
      IS_BULLION
      ? BRIGHT_LIGHT_C
      : prb(0.75) ? DARK_C : ACCENT_C
    )
    const x = rnd(-W/2, W/2)
    const y = rnd(-H/2, H/2)

    const x1 = x + rnd(-25, 25)
    const x2 = x1 + rnd(-25, 25)
    const x3 = x2 + rnd(-25, 25)
    const y1 = y + rnd(-25, 25)
    const y2 = y1 + rnd(-25, 25)
    const y3 = y2 + rnd(-25, 25)

    beginShape()
    curveVertex(
      x + rnd(-20, 20),
      y + rnd(-20, 20),
    )
    curveVertex(x, y)
    curveVertex(
      x1,
      y1,
    )
    curveVertex(
      x2,
      y2,
    )
    curveVertex(
      x3,
      y3,
    )
    endShape()
  }
  pop()
}

function pointTexture() {
  push()
  for (let x = -W/2; x < W/2; x += 5)
  for (let y = -H/2; y < H/2; y += 5) {
    strokeWeight(rnd(1,2))
    stroke(color(HUE, 26, 25, rnd(0,40)))
    point(x + rnd(-5, 5), y + rnd(-5, 5))
  }
  pop()
}

function stippleTexture() {
  push()
  for (let x = -W/2; x < W/2; x += 5)
  for (let y = -H/2; y < H/2; y += 5) {
    strokeWeight(1)
    stroke(STIPLE_C)
    point(x+2, y+2)
  }
  pop()
}

function denominationTexture() {
  push()
  strokeWeight(1)
  for (let x = -W/2; x < W/2; x += 20)
  for (let y = -H/2; y < H/2; y += 20) {
    const s = rnd(0.01, 0.15)

    const straight = prb(0.3)
    const xOffset = straight ? 0 : rnd(-10, 10)
    const yOffset = straight ? 0 : rnd(-10, 10)

    drawStr(getDenominationDisplay(), x + xOffset+10, y + yOffset+10, s, DARK_C)
  }
  pop()
}


function labrynthBg() {
  push()
  stroke(DARK_C)
  strokeWeight(0.5)
  const size = 10

  for (let x = -W/2; x < W/2; x += size)
  for (let y = -H/2; y < H/2; y += size) {
    if (prb(0.5)) {
      line(x, y, x + size, y + size)
    } else {
      line(x+size, y, x, y + size)
    }
  }
  pop()
}


function pennyPincherBg() {
  push()
  const size = 100
  noFill()
  strokeWeight(0.5)

  const w = 30
  const h = 15

  const showCircle = HIGHLIGHT || prb(0.5)

  for (let y = 0, i = 0; y <= H+5; y += h, i++) {
    const y_ = y - H/2
    beginShape()
    curveVertex(-w-W/2, y_-h/2)
    for (let x = 0; x < W/w + 2; x++) {
      const yAdj = i % 2 === 0
        ? (x % 2 === 0 ? h/2 : -h/2)
        : (x % 2 === 0 ? -h/2 : h/2)

      curveVertex(x*w - W/2, y_ + yAdj)
      if (showCircle) {
        fill(BRIGHT_LIGHT_C)
        circle(x*w - W/2, y_ + yAdj, 4)
        noFill()
      }
    }
    endShape()

  }
  pop()
}

function fabricBg() {
  push()
  const size = 100
  noFill()
  strokeWeight(0.5)

  for (let x = 0; x < W; x += size)
  for (let y = 0; y < H; y += size) {
    if (
      (y/size % 2 === 0) && (x/size % 2 === 0) ||
      (y/size % 2 === 1) && (x/size % 2 === 1)
    ) {
      for (let y_ = 0; y_ < size; y_+=4) {
        line(
          x - W/2,
          y_ + y + 2 - H/2,
          x + size - W/2,
          y_ + y + 2 - H/2
        )
      }
    } else {
      for (let x_ = 0; x_ < size; x_+=4) {
        line(
          x_ + x + 2 - W/2,
          y - H/2,
          x_ + x + 2 - W/2,
          y + size - H/2
        )
      }
    }
  }
  pop()
}


function cyclesBg() {
  push()
  const size = 100
  noFill()
  strokeWeight(0.5)

  const w = 30
  const h = 15
  const n = 100

  for (let y = -5; y < H+8; y += H/n) {
    const y_ = y - H/2
    beginShape()
    curveVertex(-w-W/2, y_-h/2)
    for (let x = 0; x < W/w + 2; x++) {
      const yAdj = x % 2 === 0 ? h/2 : -h/2
      curveVertex(x*w - W/2, y_ + yAdj)
    }
    endShape()

  }
  pop()
}

// function bg15() {
//   push()
//   noFill()
//   stroke(DARK_C)
//   strokeWeight(0.5)
//   for (let i = 0; i < 100; i++) {
//     rect(rnd(-W/2, W/2), rnd(-H/2, H/2), W/2, H/2)
//   }
//   pop()
// }

function mainframeBg() {
  push()
  strokeWeight(0.35)
  HIGHLIGHT && fill(LIGHT_ACCENT_C)
  stroke(LIGHTENED_DARK_C)

  const size = 10

  for (let x = 0; x < W; x += size)
  for (let y = 0; y < H; y += size) {
    const x_ = x - W/2
    const y_ = y - H/2
    if (prb(0.5)) {
      line(x_, y_, x_ + size, y_ + size)
      const c = rnd()
      if (c < 0.15) circle(x_, y_, 4)
      else if (c < 0.3) circle(x_ + size, y_ + size, 4)
    } else {
      line(x_+size*2, y_, x_, y_ + size*2)
      const c = rnd()
      if (c < 0.15) circle(x_+size*2, y_, 4)
      else if (c < 0.3) circle(x_, y_ + size*2, 4)
    }
  }
  pop()
}

function arrowBg() {
  push()
  strokeWeight(1)
  stroke(LIGHTENED_DARK_C)
  for (
    let x = -W/2 - H/2;
    x < H/2 + W/2;
    x += 5
  ) {
    line(x, -H/2, H/2 + x, 0)
    line(H/2+x, 0, x, H/2)
  }
  pop()
}

function chainLinkBg() {
  push()
  const size = 10
  strokeWeight(0.35)
  stroke(LIGHTENED_DARK_C)

  for (let x = -W/2; x < W/2+1; x += size)
  for (let y = -H/2; y < H/2+1; y += size) {
    circle(x, y, size+4)
  }
  pop()
}

function byteBg() {
  push()
  const px = int(rnd(2, 5))
  for (let x = 0; x < W; x+=px)
  for (let y = 0; y < H; y+=px) {
    fill (lerpColor(LIGHT_C, DARK_C, rnd(0.75)))
    noStroke()
    rect(W/2-x-px, H/2-y-px, px, px)
  }
  pop()
}



function rosetteCornerBg(corners=[2, 4]) {
  push()
  const rFn = IS_VINTAGE ? dollarRosette : getRosetteStyleFn()
  const p = genRosetteParams({ strokeC: DARK_C, strokeW: 0.35 })
  const r = rnd(0, W/4)
  corners.forEach(c => rFn(CORNERS[c][0], CORNERS[c][1], W/2, r, p))
  pop()
}

// function bg10() {
//   const compression = int(rnd(1, 11))
//   drawBorderGraphic(() => {
//     times(12, (i) => {
//       __borderGraphic.strokeWeight(1 - i/12)
//       border7(i*17 - 5, compression)
//     })
//   })
// }

function bg11() {
  rosetteWithBackground(0,0, W, 0)
}


