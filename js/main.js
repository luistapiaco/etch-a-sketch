"use strict";

const sketchpad = document.querySelector("#sketchpad");
const sketchpadStyles = getComputedStyle(sketchpad);

const btnClear = document.querySelector("#clear-btn");
const btnResizePixels = document.querySelector("#pixels-btn");

const inputRows = document.querySelector("#rows");
const inputColumns = document.querySelector("#columns");

const gridInputs = document.querySelectorAll(".grid");
const colorButtons = document.querySelectorAll(".color-btn");

const inputSelectColor = document.querySelector("#select-color");
const btnCustomColor = document.querySelector("#custom-color");
const btnBlackColor = document.querySelector("#black-color");
const btnRandomColor = document.querySelector("#random-color");
const btnRainbowColor = document.querySelector("#rainbow-color");
const btnGrayscaleColor = document.querySelector("#grayscale-color");
const btnEraser = document.querySelector("#eraser");

let sketchpadRows = 16;
let sketchpadColumns = 16;

let totalSquares = getTotalSquares(sketchpadRows, sketchpadColumns);

let sketchpadWidth = sketchpadStyles.width;
let sketchpadHeight = sketchpadStyles.height;

const sketchpadBorder = sketchpadStyles.border;
const sketchpadBorderPxStr = findPxValue(sketchpadBorder);
const sketchpadBorderPxNum = getPxNum(sketchpadBorderPxStr);

const grayscaleColors = [
  "#ebebeb",
  "#d6d8dc",
  "#bdbdbd",
  "#ababab",
  "#8c8c8c",
  "#707070",
  "#575757",
  "#424242",
  "#2e2e2e",
  "#121212",
];

let lineColor = getRGB(0, 0, 0);
let rainbowColor = false;
let grayscaleColor = false;

let squareDivWidth =
  (getPxNum(sketchpadWidth) - sketchpadBorderPxNum * 2) / sketchpadColumns;
let squareDivHeight =
  (getPxNum(sketchpadWidth) - sketchpadBorderPxNum * 2) / sketchpadRows;

gridInputs.forEach((input) => {
  input.addEventListener("input", () => {
    const maxValue = +input.max;
    const minValue = +input.min;
    if (+input.value > maxValue) {
      input.value = maxValue;
    }
    if (+input.value < minValue) {
      input.value = minValue;
    }
  });
});

fillWithSquares(
  sketchpad,
  totalSquares,
  getUnitStr(squareDivWidth, "px"),
  getUnitStr(squareDivHeight, "px")
);

const squareDivs = document.querySelectorAll(".square-div");

squareDivs.forEach((square) => {
  square.addEventListener("mouseover", () => {
    fillColorWithMousover(square);
  });
});
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rainbowColor = button === btnRainbowColor ? true : false;
    grayscaleColor = button === btnGrayscaleColor ? true : false;
  });
});
btnCustomColor.addEventListener("click", () => {
  lineColor = inputSelectColor.value;
});
btnBlackColor.addEventListener("click", () => {
  lineColor = getRGB(0, 0, 0);
});
btnRandomColor.addEventListener("click", () => {
  lineColor = getRandomRBG();
});

btnEraser.addEventListener("click", () => {
  lineColor = "none";
});

btnClear.addEventListener("click", clearAllSquareDivs);

btnResizePixels.addEventListener("click", () => {
  const rows = +inputRows.value;
  const columns = +inputColumns.value;
  updateRowsAndColumns(rows, columns);
});

function createSquareDiv(node, height, width) {
  const squareDiv = document.createElement("div");
  squareDiv.classList.add("square-div");
  squareDiv.style.cssText = `height: ${height}; width: ${width}`;
  node.appendChild(squareDiv);
}

function getTotalSquares(rows, columns) {
  return rows * columns;
}

function getPxNum(str) {
  return +str.slice(0, -2);
}

function getUnitStr(num, unit) {
  return `${num}${unit}`;
}

function getRGB(num1, num2, num3) {
  return `rgb(${num1}, ${num2}, ${num3})`;
}

function findPxValue(cssRule) {
  const items = cssRule.split(" ");
  for (let i = 0; i < items.length; i++) {
    const lastTwoChars = items[i].slice(-2);
    const firstChars = items[i].slice(0, -2);
    if (lastTwoChars === "px" && items[i].length > 2 && +firstChars !== NaN) {
      return items[i];
    }
  }
}

function clearAllSquareDivs() {
  changeBackground(".square-div", "none");
}

function fillColorWithMousover(square) {
  if (rainbowColor) {
    lineColor = getRandomRBG();
  }
  if (!grayscaleColor) {
    square.grayscaleLevel = undefined;
  } else {
    if (square.grayscaleLevel === undefined) {
      square.grayscaleLevel = 0;
    } else if (square.grayscaleLevel < grayscaleColors.length) {
      square.grayscaleLevel += 1;
    }
    lineColor = grayscaleColors[square.grayscaleLevel];
  }
  square.style.background = lineColor;
}

function changeBackground(cls, bgColor) {
  const items = document.querySelectorAll(cls);
  for (let i = 0; i < items.length; i++) {
    items[i].style.background = bgColor;
  }
}

function updateRowsAndColumns(rows, columns) {
  sketchpadRows = rows;
  sketchpadColumns = columns;
  const squareQuantity = rows * columns;
  const width = getSquareDivsLength(rows);
  const height = getSquareDivsLength(columns);

  removeAllFromParent(sketchpad, ".square-div");
  fillWithSquares(sketchpad, squareQuantity, width, height);
  const squareDivs = document.querySelectorAll(".square-div");
  squareDivs.forEach((square) => {
    square.addEventListener("mouseover", () => {
      fillColorWithMousover(square);
    });
  });
}

function updateWidth(cls, width) {
  const items = document.querySelectorAll(cls);
  for (let i = 0; i < items.length; i++) {
    items[i].style.width = width;
  }
}

function updateHeight(cls, height) {
  const items = document.querySelectorAll(cls);
  for (let i = 0; i < items.length; i++) {
    items[i].style.height = height;
  }
}

function removeAllFromParent(parentNode, cls) {
  const items = parentNode.querySelectorAll(cls);
  for (let i = 0; i < items.length; i++) {
    parentNode.removeChild(items[i]);
  }
}

function fillWithSquares(node, squares, height, width) {
  for (let i = 0; i < squares; i++) {
    createSquareDiv(node, height, width);
  }
}

function getSquareDivsLength(rowsOrColumns) {
  return getUnitStr(
    (getPxNum(sketchpadWidth) - sketchpadBorderPxNum * 2) / rowsOrColumns,
    "px"
  );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomRBG() {
  const arg1 = getRandomInt(256);
  const arg2 = getRandomInt(256);
  const arg3 = getRandomInt(256);
  return getRGB(arg1, arg2, arg3);
}
