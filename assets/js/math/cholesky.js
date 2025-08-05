// JavaScript program to find decompose of a
// matrix using Cholesky Decomposition

function choleskyDecomposition(matrix) {
  let n = matrix.length;

  // to store the lower triangular matrix
  let lower = Array.from({ length: n }, () => Array(n).fill(0));

  // Decomposing a matrix into Lower Triangular
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;

      // summation for diagonals
      if (j === i) {
        for (let k = 0; k < j; k++) sum += Math.pow(lower[j][k], 2);
        lower[j][j] = Math.sqrt(matrix[j][j] - sum) | 0;
      } else {
        // Evaluating L(i, j) using L(j, j)
        for (let k = 0; k < j; k++) sum += lower[i][k] * lower[j][k];
        lower[i][j] = ((matrix[i][j] - sum) / lower[j][j]) | 0;
      }
    }
  }

  //Displaying Lower Triangular Matrix
  for (let i = 0; i < n; i++) {
    console.log(lower[i].join(" "));
  }

  // console.log(lower);

  // Displaying Transpose of Lower Triangular Matrix
  // for (let i = 0; i < n; i++) {
  //     let row = [];
  //     for (let j = 0; j < n; j++) {
  //         row.push(lower[j][i]);
  //     }
  //     console.log(row.join(" "));
  // }
  return lower;
}

// let matrix = [
//     [4, 12, -16],
//     [12, 37, -43],
//     [-16, -43, 98]
// ];
// choleskyDecomposition(matrix);
