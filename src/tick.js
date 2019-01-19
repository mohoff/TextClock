require('dotenv').config()
const bunyan = require('bunyan')
const logger = bunyan.createLogger({ name: process.env.LOGGER_NAME })

import { chunks, hours, colors, combinations } from './constants'

// Flag to enable random positioning when page is loaded the first time
let firstLoadDone = false

let width, height, rowWidth
let rows, row1, row2, row3
let hr, min

let infoGlobal
let info = []

const rgbToCssString = (rgbArray = colors[0]) => `rgb(${rgbArray.join(',')})`

function getColor(currentDate) {
  const hr = currentDate.getHours()
  const min = currentDate.getMinutes()

  // Between 0:00 and 5:59am, immediately return grey color
  if (hr < 6) {
    return rgbToCssString(colors[0])
  }

  const colorStartIndex = Math.min(4, Math.floor(hr / 3) - 2)
  const colorStart = colors[colorStartIndex]
  const colorEnd = colors[(colorStartIndex + 1) % colors.length]

  // Determine number-based color difference between colorStart and colorEnd.
  // Also determine numeric step size of the RGB-channels in order to represent
  // a smooth color gradient between colorStart and colorEnd.
  let colorDiff = []
  let stepSize = []
  for (let i = 0; i < 3; i++) {
    colorDiff[i] = colorEnd[i] - colorStart[i]
    stepSize[i] = colorDiff[i] / 36 // 60 = 3h * 20 steps
  }
  // stepIndex resets every 3 hours (except during night)
  // 3h intervals = 3*12 = 36 5-minute-steps => startColor + endColor + 35 shades

  // Compute stepSize in interval [0...36]. Usually for 3h, except from 6pm-0am where it's for 6h
  let stepIndex
  if (hr >= 18 && hr <= 23) {
    stepIndex = (hr % 6) * 6 + min / 10
  } else {
    stepIndex = (hr % 3) * 12 + min / 5
  }

  // Compute final color
  let colorNow = []
  for (let i = 0; i < 3; i++) {
    colorNow[i] = Math.round(colorStart[i] + stepIndex * stepSize[i])
  }

  return rgbToCssString(colorNow)
}

function setPositionForRow(rowIndex, numberOfRows, rowObj, rowHeight) {
  // Reset margins and paddings
  rowObj.style.margin = '0px'
  rowObj.children[0].style.padding = '0px'

  // Get individual width of row at rowIndex
  rowWidth =
    rowObj.children[0].clientWidth ||
    rowObj.children[0].scrollWidth ||
    rowObj.children[0].offsetWidth

  // Generate two distinct random numbers
  const r1 = Math.random()
  const r2 = Math.random()

  // Calculate top and left offset
  const offsetTop =
    r1 *
    (height -
      (rowObj.getBoundingClientRect().top +
        (numberOfRows - rowIndex) * rowHeight))
  const offsetLeft = r2 * (width - rowWidth)

  if (process.env.NODE_ENV === 'development') {
    const top = rowObj.getBoundingClientRect().top
    // prettier-ignore
    info[rowIndex].innerHTML = `
      ROW${rowIndex}:
      w(${rowWidth}), h(${rowHeight}),
      LPad: [0-${width - rowWidth}]->${offsetLeft.toFixed(1)}px,
      TBCR(${top.toFixed(1)}),
      TMar: [0-${(height - (top + (numberOfRows - rowIndex) * rowHeight)).toFixed(1)}]->${offsetTop.toFixed(1)}px,
      rowAbzug${rowIndex + 1}(${((numberOfRows - rowIndex) * rowHeight).toFixed(1)})
    `
  }

  // Set top and left offset
  rowObj.style.marginTop = offsetTop + 'px'
  rowObj.children[0].style.paddingLeft = offsetLeft + 'px'
}

function setTexts(row1, row2, row3, hr, min) {
  const minIndex = Math.floor(min / 5)
  const numOfWords = combinations[minIndex].length

  // Content of 1st row
  row1.children[0].innerHTML = chunks[combinations[minIndex][0]]
  if (numOfWords == 3) {
    row1.children[0].innerHTML =
      row1.children[0].innerHTML + ' ' + chunks[combinations[minIndex][1]]
  }

  // Content of 2nd row
  row2.children[0].innerHTML = chunks[combinations[minIndex][numOfWords - 1]]

  // Content of 3rd row
  if (min < 20) {
    row3.children[0].innerHTML = hours[hr]
  } else {
    row3.children[0].innerHTML = hours[(hr + 1) % 12]
  }
  row3.children[0].innerHTML = row3.children[0].innerHTML + '....'
}

function setColors(currentDate) {
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.color = getColor(currentDate)
  }
}

const tick = () => {
  // Init relevant variables
  // Determine height and width of the browser viewport.
  height = window.innerHeight // There is no top or bottom margin anymore
  width = window.innerWidth - 50 // Substract (marginLeft+marginRight) of wrapper div (see #wrapper in style.css)

  if (!firstLoadDone) {
    // Init rows 1-3 which will contain time
    rows = document.getElementsByClassName('row')
    row1 = document.getElementById('row1')
    row2 = document.getElementById('row2')
    row3 = document.getElementById('row3')

    if (process.env.NODE_ENV === 'development') {
      infoGlobal = document.getElementById('info-global')
      info[0] = document.getElementById('info-1')
      info[1] = document.getElementById('info-2')
      info[2] = document.getElementById('info-3')
    }
  }

  if (process.env.NODE_ENV === 'development') {
    infoGlobal.innerHTML = `GLOBAL: w(${width}), h(${height}}, window.innerWidth(${
      window.innerWidth
    })`
  }

  // Get current time
  let currentDate = new Date()
  hr = currentDate.getHours() % 12 // [0 ... 11]
  min = currentDate.getMinutes() // [0 ... 59]

  setTexts(row1, row2, row3, hr, min)
  setColors(currentDate)

  // Change position of rows only once every 5 minutes (when text content needs
  // to be updated). Also compute position when the page is loaded the first time,
  // independent of the current time.
  if (min % 5 == 0 || !firstLoadDone) {
    // Determine height and widths of the 3 rows.
    const rowHeight =
      row1.clientHeight || row1.scrollHeight || row1.offsetHeight

    setPositionForRow(0, 3, row1, rowHeight)
    setPositionForRow(1, 3, row2, rowHeight)
    setPositionForRow(2, 3, row3, rowHeight)
  }

  // Remove dots from 3rd row when minute is not at XX:X4.
  // Dots indicate exact minute for XX:X1, XX:X2, XX:X3 and XX:X4.
  // For setting row position there need to be 4 dots.
  // So we remove needless dots after setPositionForRow()
  row3.children[0].innerHTML = row3.children[0].innerHTML.substr(
    0,
    row3.children[0].innerHTML.length - (4 - (min % 5))
  )

  // Set information for next function call that the page was already loaded the
  // first time.
  firstLoadDone = true

  // Call this function again after 60s.
  setTimeout(tick, 60000)
}

module.exports = {
  tick,
}
