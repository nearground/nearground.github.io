function prefillMatrixInputs(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  document.getElementById("matrix-rows").value = m;
  document.getElementById("matrix-cols").value = n;
  // Resize matrix if needed
  createMatrix(m, n);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const input = document.querySelector(`input[data-row='${i}'][data-col='${j}']`);
      if (input) {
        input.value = matrix[i][j];
      }
    }
  }
}
function createMatrix(m, n) {
  const container = document.getElementById("matrix-container");
  container.innerHTML = "";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.border = "2px solid #333";
  for (let i = 0; i < m; i++) {
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
  const m = parseInt(document.getElementById("matrix-rows").value, 10);
  const n = parseInt(document.getElementById("matrix-cols").value, 10);
  const matrix = [];
  for (let i = 0; i < m; i++) {
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
  const m = parseInt(document.getElementById("matrix-rows").value, 10);
  const n = parseInt(document.getElementById("matrix-cols").value, 10);
  if (m > 0 && n > 0) {
    createMatrix(m, n);
  }
});

document.getElementById("solve-matrix").addEventListener("click", function () {
  const matrix = getMatrixInputs();
  console.log("matrix:", matrix);
  updateEigenvectors(matrix);
});
function updateEigenvectors(matrix) {
  var eigenArr = PCA.getEigenVectors(matrix);
  console.log("test");
  console.log("eigenarray: ", eigenArr);
  const container = document.getElementById("eigenvectors");
  container.innerHTML = "";
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.border = "2px solid #333";
  //add eigenvalue label
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  cell.textContent = "eigenvalue:";
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
    cell.textContent = eigenArr[i].eigenvalue + ":";
    cell.style.border = "1px solid #333";
    row.appendChild(cell);
    var teest = eigenArr[i].vector;
    for (let j = 0; j < teest.length; j++) {
      const cell = document.createElement("td");
      cell.textContent = teest[j];
      cell.style.border = "1px solid #333";
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.appendChild(table);
}
// Initial matrix
const mInit = parseInt(document.getElementById("matrix-rows").value, 10);
const nInit = parseInt(document.getElementById("matrix-cols").value, 10);
var test = [
  [40, 50, 60],
  [50, 70, 60],
  [80, 70, 90],
  [50, 60, 80],
];
prefillMatrixInputs(test);
updateEigenvectors(test);
//createMatrix(mInit, nInit);
