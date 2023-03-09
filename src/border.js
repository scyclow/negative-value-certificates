



function randomBorder() {
  const borderSeed = rnd()
  if (borderSeed < 0.02) return denominationBorder()

  const vintageBorderProb = IS_VINTAGE ? 0.5 : 0.25
  drawBorderGraphic(() => {
    if (borderSeed < vintageBorderProb) {
      const vintageBorderSeed = rnd()
      const degAdj = posOrNeg() * (vintageBorderSeed < 0.75 ? 2 : 3)
      const params = vintageBorderParams({ degAdj })
      const padding = 8 + params.radius

      vintageBorder(padding, params)
      prb(0.25) && vintageBorder(padding, vintageBorderParams({ degAdj: degAdj * -1 }))
    }

    else if (borderSeed < 0.55) {
      curveCornerBorders(60)
    }

    else if (borderSeed < 0.8) {
      darkRosetteBorder(-10, prb(0.7))
    }


    else if (borderSeed < 0.85) {
      border1(10, int(rnd(20, 200)))
    }

    else if (borderSeed < 0.9) {
      dottedBorder(20)
    }

    else {
      border7(20, int(rnd(1, 7)), posOrNeg())
    }

  })
}



const getXYBorder = (p, points, padding) => {
  const wPoints = int( points * W_H_RATIO / (2 * (W_H_RATIO+1)) )
  const hPoints = int(points/2 - wPoints)
  const xSize = (W - 2*padding) / wPoints
  const ySize = (H - 2*padding) / hPoints

  const top = -H/2 + padding
  const bottom = H/2 - padding
  const left = -W/2 + padding
  const right = W/2 - padding

  const c1 = wPoints
  const c2 = wPoints + hPoints
  const c3 = wPoints*2 + hPoints
  const c4 = wPoints*2 + hPoints*2

  if (p < c1) {
    return [
      left + p*xSize,
      top
    ]
  } else if (p < c2) {
    return [
      right,
      top + (p - c1)*ySize
    ]
  } else if (p < c3) {
    return [
      right - (p - c2)*xSize,
      bottom
    ]
  } else if (p < c4) {
    return [
      left,
      bottom - (p - c3)*ySize
    ]
  } else {
    return [
      left + (p-c4)*xSize,
      top
    ]
  }
}

function drawBorderGraphic(borderFn) {
  push()

  __borderGraphic.translate(W/2, H/2)
  __borderGraphic.noFill()
  __borderGraphic.stroke(DARK_C)
  borderFn()
  image(__borderGraphic,-W / 2,-H / 2)
  pop()
}

function border1(padding, points) {
  for (let off=0; off<2; off+=0.5) {
    drawShape(points, p => {
      const [ox, oy] = getXYBorder(p + off, points, padding)
      const [ix, iy] = getXYBorder(p + off, points, padding+20)

      return p % 2 === 0 ? [ix, iy] : [ox, oy]
    }, __borderGraphic)
  }
}


function dottedBorder(padding=10) {
  __borderGraphic.strokeWeight(1*STROKE_MOD)
  const cRad = 3
  const adjW = W - 2*padding
  const adjH = H - 2*padding
  const adjPrm = (adjW + adjH) * 2
  const points = adjPrm/cRad

  times(points, p => {
    const [x,y] = getXYBorder(p, points, padding+cRad)
    __borderGraphic.circle(x, y, cRad*2)
  })
  drawShape(points, p => getXYBorder(p, points, padding), __borderGraphic)
  drawShape(points, p => getXYBorder(p, points, padding+(cRad*2)), __borderGraphic)
}


function vintageBorderParams(o) {
  const radius = rnd(15, 31)
  const offsetAmt = (
    abs(o.degAdj) === 2 ? rnd(3, 26) : rnd(1, 13)
  )

  return {
    radius,
    degAdj: o.degAdj,
    offsetAmt,
  }
}

function vintageBorder(padding, params) {
  const points = 66

  const radius = params.radius // 15-30
  const degAdj = params.degAdj //1,2,3,4,-1,-2,-3,-4
  const offsetAmt = 1/params.offsetAmt //3 - 25
  __borderGraphic.strokeWeight(0.6*STROKE_MOD)
  for (let off=0; off<2; off+=offsetAmt) {
    drawShape(points+1, p => {
      const [ox, oy] = getXYBorder(p +off, points, padding)
      return getXYRotation(
        ((p+off)/degAdj) * TWO_PI,
        radius,
        ox, oy
      )
    }, __borderGraphic)
  }
}



// direction 0.5/-0.5 looks cool
function getCurvedXYBorder(p, points, padding, direction=1) {
  // const points = W/5
  // 2 - 10 * posOrNeg() == normal looking
  // 20 strange
  // 50 whacky
  const radius = 5
  // 10,15 == realistic
  //


  const [ox, oy] = getXYBorder(p, points, padding)
  return getXYRotation(
    (p/radius*direction) * TWO_PI,
    radius,
    ox, oy
  )
}

function border7(padding=20, compression=4, d=1) {
  const points = compression*50

  if (IS_DECO) {
    __borderGraphic.fill(ROSETTE_FILL_C)
    __borderGraphic.stroke(ROSETTE_STROKE_C)
  }

  if (['NUMISMATIC', 'VINTAGE', 'DECO'].includes(ROSETTE_STYLE))
  for (let off=0; off<2; off+=0.3333) {
    drawShape(points, p => {
      const [ox, oy] = getCurvedXYBorder(p + off, points, padding, d)
      const [ix, iy] = getCurvedXYBorder(p + off, points, padding+22, d)

      return p % 2 === 0 ? [ix, iy] : [ox, oy]
    }, __borderGraphic)
  }

  if (['ECHO', 'DIGITAL'].includes(ROSETTE_STYLE))
  for (let off=0; off<25; off+=5) {
    drawShape(points, p => getCurvedXYBorder(p, points, padding+off), __borderGraphic, d)
  }

  if (['LINE', 'DIGITAL'].includes(ROSETTE_STYLE))
  for (let p=0; p < points; p += 0.2) {
    const [ox, oy] = getCurvedXYBorder(p, points, padding, d)
    const [ix, iy] = getCurvedXYBorder(p, points, padding+22, d)
    __borderGraphic.line(ox, oy, ix, iy)
  }

  if (IS_DECO) {
    const innerBoarder = i => drawShape(points, p => getCurvedXYBorder(p, points, padding+i, d), __borderGraphic)
    innerBoarder(19)
    __borderGraphic.erase()
    innerBoarder(20)
    __borderGraphic.noErase()
  }

}


function darkRosetteBorder(padding=-10, sides=true) {
  const compression = int(rnd(1, 7))

  if (HIGHLIGHT) {
    __borderGraphic.push()
    times(100, i => {
      __borderGraphic.stroke(lerpColor(ROSETTE_STROKE_C, ROSETTE_FILL_C, (i+75)/150))
      __borderGraphic.rectMode(CENTER)
      __borderGraphic.rect(0, 0, W-i, H-i)
    })
    __borderGraphic.pop()
  } else __borderGraphic.background(ROSETTE_FILL_C)

  __borderGraphic.stroke(ROSETTE_STROKE_C)
  __borderGraphic.strokeWeight(1.1*STROKE_MOD - compression/12)
  const direction = posOrNeg()

  const d = IS_DECO ? 5 : 0
  const extraPadding = ['ECHO', 'DIGITAL'].includes(ROSETTE_STYLE) ? 6 : 0
  border7(padding+2+d, compression, direction)
  border7(padding+19+extraPadding+d, compression, direction)
  border7(padding+36+extraPadding*2+d, compression, direction)

  const p = padding+(sides ? 35 : 55)

  __borderGraphic.stroke(DARK_C)
  __borderGraphic.erase()
  __borderGraphic.fill(0)
  sides
    ? __borderGraphic.rect(p-W/2, p-H/2, W-2*p, H-2*p)
    : __borderGraphic.rect(-W/2, p-H/2, W, H-2*p)


  __borderGraphic.noErase()
  __borderGraphic.noFill()

  if (sides) {
    __borderGraphic.rect(p-W/2, p-H/2, W-2*p, H-2*p)
    dottedBorder(p + 5)
  } else {
    __borderGraphic.rect(-W/2, p-H/2, W, H-2*p)
  }
}




function denominationBorder(padding=10) {
  const adjW = W - 2*padding
  const adjH = H - 2*padding
  const adjPrm = (adjW + adjH) * 2
  const points = 80
  const denomination = getDenominationDisplay()
  times(points, p => {
    const [x,y] = getXYBorder(p, points, padding)
    drawStrAdj(denomination, x, y, 0.1, DARK_C)
  })

}



function curveCornerBorders(weight) {
  const top = -H/2
  const bottom = H/2
  const left = -W/2
  const right = W/2
  const rad = weight/1.5

  const weightAdj = rnd(1,5)
  const lines = int(rnd(4, 11))


  __borderGraphic.stroke(DARK_C)
  for (let i = 0; i < lines; i++) {
    if (i % 2 !== 0 || i === lines-1) __borderGraphic.erase()
    __borderGraphic.fill(DARK_C)
    __borderGraphic.strokeWeight(weight*STROKE_MOD -(i* weightAdj))
    __borderGraphic.line(left, top, right, top)
    __borderGraphic.line(right, top, right, bottom)
    __borderGraphic.line(right, bottom, left, bottom)
    __borderGraphic.line(left, bottom, left, top)

    __borderGraphic.circle(left+rad, top+rad, rad)
    __borderGraphic.circle(left+rad, bottom-rad, rad)
    __borderGraphic.circle(right-rad, top+rad, rad)
    __borderGraphic.circle(right-rad, bottom-rad, rad)
    if (i % 2 !== 0 || i === lines-1) __borderGraphic.noErase()
  }

}







