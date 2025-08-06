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

var standardNormal = standardNormalVector(3); // compute the correlated dsitribution based on the covariance

function generateSamplesCholesky(covarianceMatrix, samples, mean) {
  var uniformPoints = [];
  for (i = 0; i < samples; i++) {
    uniformPoints.push(standardNormalVector(3));
  }
  var points = [];
  var cholesky = choleskyDecomposition(covarianceMatrix);
  for (i = 0; i < samples; i++) {
    var multivariateVector = multiplyMatrixVector(cholesky, uniformPoints[i]);
    multivariateVector = addVectors(multivariateVector, mean);
    points.push(multivariateVector);
  }
  return points;
}

function generateSamplesICDF(covarianceMatrix, samples, mean) {
  var points = [];
  for (i = 0; i < samples; i++) {
    var vector = [icdf(Math.Random) * mean[0], icdf(Math.Random) * mean[1], icdf(Math.Random) * mean[2]];
    var multivariateVector = multiplyMatrixVector(covarianceMatrix, vector);
    points.push(multivariateVector);
  }
  return points;
}
