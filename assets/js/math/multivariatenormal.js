// JavaScript program to find decompose of a
// 3D matrix using Cholesky Decomposition

function choleskyDecomposition(covarianceMatrix) {
  let n = covarianceMatrix.length;

  // to store the lower triangular matrix
  let lower = Array.from({ length: n }, () => Array(n).fill(0));

  // Decomposing a matrix into Lower Triangular
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;

      // summation for diagonals
      if (j === i) {
        for (let k = 0; k < j; k++) sum += Math.pow(lower[j][k], 2);
        lower[j][j] = Math.sqrt(covarianceMatrix[j][j] - sum) | 0;
      } else {
        // Evaluating L(i, j) using L(j, j)
        for (let k = 0; k < j; k++) sum += lower[i][k] * lower[j][k];
        lower[i][j] = ((covarianceMatrix[i][j] - sum) / lower[j][j]) | 0;
      }
    }
  }
  //Displaying Lower Triangular Matrix
  for (let i = 0; i < n; i++) {
    //console.log(lower[i].join(" "));
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

function multiplyMatrices(matrixA, matrixB) {
  // Get dimensions of the matrices
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  // Check if matrices can be multiplied
  if (colsA !== rowsB) {
    throw new Error("Matrices cannot be multiplied: Number of columns in the first matrix must equal the number of rows in the second matrix.");
  }

  // Initialize the result matrix with zeros
  const resultMatrix = Array(rowsA)
    .fill(0)
    .map(() => Array(colsB).fill(0));

  // Perform matrix multiplication
  for (let i = 0; i < rowsA; i++) {
    // Iterate through rows of matrixA
    for (let j = 0; j < colsB; j++) {
      // Iterate through columns of matrixB
      for (let k = 0; k < colsA; k++) {
        // Iterate through columns of matrixA (or rows of matrixB)
        resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  return resultMatrix;
}
function multiplyMatrices(matrixA, matrixB) {
  // If matrixB is a 1D array (vector), treat as matrix-vector multiplication
  const isBVector = !Array.isArray(matrixB[0]);
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;

  if (isBVector) {
    if (matrixB.length !== colsA) {
      throw new Error("Matrix columns must match vector length.");
    }
    const result = [];
    for (let i = 0; i < rowsA; i++) {
      let sum = 0;
      for (let j = 0; j < colsA; j++) {
        sum += matrixA[i][j] * matrixB[j];
      }
      result.push(sum);
    }
    return result;
  } else {
    // Matrix-matrix multiplication
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;
    if (colsA !== rowsB) {
      throw new Error("Matrix dimensions are not compatible for multiplication.");
    }
    const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          result[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }
    return result;
  }
}

function multiplyMatrixVector(matrix, vector) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const vectorLength = vector.length;

  // Check for compatibility
  if (numCols !== vectorLength) {
    throw new Error("Matrix columns must match vector length for multiplication.");
  }

  const resultVector = new Array(numRows).fill(0);

  for (let i = 0; i < numRows; i++) {
    let sum = 0;
    for (let j = 0; j < numCols; j++) {
      sum += matrix[i][j] * vector[j];
    }
    resultVector[i] = sum;
  }

  return resultVector;
}

function divideVectors(vectorA, vectorB) {
  // Ensure both inputs are arrays and have the same length
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB) || vectorA.length !== vectorB.length) {
    throw new Error("Both inputs must be arrays of the same length.");
  }

  const resultVector = [];
  for (let i = 0; i < vectorA.length; i++) {
    // Handle division by zero
    if (vectorB[i] === 0) {
      throw new Error("Division by zero encountered at index " + i);
    }
    resultVector.push(vectorA[i] / vectorB[i]);
  }
  return resultVector;
}

function icdf(x) {
  var w = -Math.log((1 - x) * (1 + x));
  var p;
  if (w < 5) {
    w = w - 2.5;
    p = 2.81022636e-8;
    p = 3.43273939e-7 + p * w;
    p = -3.5233877e-6 + p * w;
    p = -4.39150654e-6 + p * w;
    p = 0.00021858087 + p * w;
    p = -0.00125372503 + p * w;
    p = -0.00417768164 + p * w;
    p = 0.246640727 + p * w;
    p = 1.50140941 + p * w;
  } else {
    w = math.sqrt(w) - 3;
    p = -0.000200214257;
    p = 0.000100950558 + p * w;
    p = 0.00134934322 + p * w;
    p = -0.00367342844 + p * w;
    p = 0.00573950773 + p * w;
    p = -0.0076224613 + p * w;
    p = 0.00943887047 + p * w;
    p = 1.00167406 + p * w;
    p = 2.83297682 + p * w;
  }
  return p * x;
}

function standardNormalVector(length) {
  var ary = [];

  for (var i = 0; i < length; i++) {
    ary.push(icdf(2 * Math.random() - 1));
  }

  return ary;
}
function subtractVectors(vec1, vec2) {
  // Ensure both vectors have the same dimension
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same dimension to be added.");
  }

  const result = [];
  for (let i = 0; i < vec1.length; i++) {
    result[i] = vec1[i] - vec2[i];
  }
  return result;
}

function addVectors(vec1, vec2) {
  // Ensure both vectors have the same dimension
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same dimension to be added.");
  }

  const result = [];
  for (let i = 0; i < vec1.length; i++) {
    result[i] = vec1[i] + vec2[i];
  }
  return result;
}
function generateSamplesCholesky(covariance, samples, means, dimensions) {
  var normalPoints = [];
  for (i = 0; i < samples; i++) {
    normalPoints.push(standardNormalVector(dimensions));
  }
  var points = [];
  for (i = 0; i < samples; i++) {
    var multivariateVector = multiplyMatrixVector(covariance, normalPoints[i]);
    multivariateVector = addVectors(multivariateVector, means);
    points.push(multivariateVector);
  }
  return points;
}

function isOrthogonal(vectors, epsilon = 1e-10) {
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      let dot = 0;
      for (let k = 0; k < vectors[i].length; k++) {
        dot += vectors[i][k] * vectors[j][k];
      }
      if (Math.abs(dot) > epsilon) {
        return false;
      }
    }
  }
  return true;
}
