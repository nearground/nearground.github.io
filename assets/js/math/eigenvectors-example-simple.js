function prefillMatrixInputs(matrix) {
  var n = matrix.length;
  document.getElementById("matrix-size").value = n;
  // Resize matrix if needed
  createSquareMatrix(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const input = document.querySelector(`input[data-row='${i}'][data-col='${j}']`);
      if (input) {
        input.value = matrix[i][j];
      }
    }
  }
}
function createSquareMatrix(n) {
  const container = document.getElementById("matrix-container");
  container.innerHTML = "";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.border = "2px solid #333";
  for (let i = 0; i < n; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < n; j++) {
      const cell = document.createElement("td");
      cell.style.border = "1px solid #333";
      const input = document.createElement("input");
      input.type = "number";
      input.style.width = "50px";
      input.setAttribute("data-row", i);
      input.setAttribute("data-col", j);
      cell.appendChild(input);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.appendChild(table);
}

function getMatrixInputs() {
  const n = parseInt(document.getElementById("matrix-size").value, 10);
  const matrix = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      const input = document.querySelector(`input[data-row='${i}'][data-col='${j}']`);
      row.push(Number(input.value));
    }
    matrix.push(row);
  }
  return matrix;
}

document.getElementById("matrix-submit").addEventListener("click", function () {
  const n = parseInt(document.getElementById("matrix-size").value, 10);
  if (n > 0) {
    createSquareMatrix(n);
  }
});

document.getElementById("solve-matrix").addEventListener("click", function () {
  const matrix = getMatrixInputs();
  updateEigenvectors(matrix);
});

//utility func
function roundToPrecision(number, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function normalizeArray(matrix) {
  var newMatrix = Array.from(matrix);
  var size = newMatrix.length;
  console.log("normalizeArray got matrix ", newMatrix);
  for (let i = 0; i < newMatrix.length; i++) {
    //initialize min
    var absMin = Math.min(...newMatrix[i]);
    if (absMin != 0) {
      for (let j = 0; j < size; j++) {
        console.log("before ", newMatrix[i][j]);
        newMatrix[i][j] = roundToPrecision(newMatrix[i][j] / absMin, 5);
        console.log("after ", newMatrix[i][j]);
      }
    }
  }
  console.log("returning", newMatrix);
  return newMatrix;
}

function updateEigenvectors(matrix) {
  var eigenArr = math.eigs(matrix).eigenvectors;
  var size = eigenArr.length;
  var eigenvectorArray = [];

  for (let i = 0; i < size; i++) {
    var dumbVector = [];
    console.log("attempting to dumb down ", eigenArr[i].vector);
    for (let j = 0; j < size; j++) {
      dumbVector.push(Number(eigenArr[i].vector[j]));
    }
    console.log("success?", dumbVector);
    eigenvectorArray.push(dumbVector);
  }
  var normalizedEigenvectorArray = normalizeArray(eigenvectorArray);
  console.log("eigenarray: ", eigenArr);
  console.log("normalized eigenarray: ", normalizedEigenvectorArray);
  const container = document.getElementById("eigenvectors");
  container.innerHTML = "";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.border = "2px solid #333";
  //add eigenvalue label
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  cell.textContent = "eigenvalue";
  cell.style.border = "1px solid #333";
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.textContent = "eigenvector";
  // cell.style.border = '1px solid #333';
  row.appendChild(cell);
  table.appendChild(row);
  for (let i = 0; i < eigenArr.length; i++) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = roundToPrecision(eigenArr[i].value, 5);
    cell.style.border = "1px solid #333";
    row.appendChild(cell);
    for (let j = 0; j < normalizedEigenvectorArray.length; j++) {
      const cell = document.createElement("td");
      cell.textContent = normalizedEigenvectorArray[i][j];
      cell.style.border = "1px solid #333";
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.appendChild(table);
}
// Initial matrix
const nInit = parseInt(document.getElementById("matrix-size").value, 10);
var test = [
  [9, 8],
  [-6, -5],
];
prefillMatrixInputs(test);
updateEigenvectors(test);
//createMatrix(mInit, nInit);
