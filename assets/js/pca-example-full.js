// Imports mapped in HTML panel
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
window.clearPointsOnly = clearPointsOnly;
window.addPointsAndAxes = addPointsAndAxes;

class BidirectionalAxesHelper extends THREE.LineSegments {
  constructor(aL) {
    const vertices = [aL[0][0], 0, 0, aL[1][0], 0, 0, 0, aL[0][1], 0, 0, aL[1][1], 0, 0, 0, aL[0][2], 0, 0, aL[1][2]];

    const colors = [1, 0, 0, 1, 0.6, 0, 0, 1, 0, 0.6, 1, 0, 0, 0, 1, 0, 0.6, 1];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({ vertexColors: true, toneMapped: false });

    super(geometry, material);

    this.type = "AxesHelper";
  }
}

function getAxes(bidirectionalCoords) {
  return new BidirectionalAxesHelper(bidirectionalCoords);
}
function getMinMaxArray(points) {
  var maxX = points[0][0];
  var maxY = points[0][1];
  var maxZ = points[0][2];
  var minX = points[0][0];
  var minY = points[0][1];
  var minZ = points[0][2];

  for (i = 0; i < points.length; i++) {
    maxX = points[i][0] > maxX ? points[i][0] : maxX;
    maxY = points[i][1] > maxY ? points[i][1] : maxY;
    maxZ = points[i][2] > maxZ ? points[i][2] : maxZ;
    minX = points[i][0] < minX ? points[i][0] : minX;
    minY = points[i][1] < minY ? points[i][1] : minY;
    minZ = points[i][2] < minZ ? points[i][2] : minZ;
  }
  return [
    [minX, minY, minZ],
    [maxX, maxY, maxZ],
  ];
}

function addPoints(points) {
  var vertices = [];
  for (i = 0; i < points.length; i++) {
    vertices.push(points[i][0], points[i][1], points[i][2]);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  //const material = new THREE.PointsMaterial({ size: 20, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true, color: 0x888888 });
  // var points = new THREE.Points(geometry, material);
  var points = new THREE.Points(geometry);
  points.name = "points";
  scene.add(points);
}
function drawLabel(label, vectorEndPoint) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const message = label;
  const fontSize = 60; // Adjust as needed
  context.font = `${fontSize}px Arial`;

  // Calculate text width to size the canvas correctly
  const metrics = context.measureText(message);
  canvas.width = metrics.width;
  canvas.height = fontSize; // Add some padding

  // Re-set font and fill style after resizing canvas
  context.font = `${fontSize}px Arial`;
  context.fillStyle = "white";
  context.fillText(message, 0, fontSize); // Adjust y-position for baseline

  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({ map: texture });

  const sprite = new THREE.Sprite(material);
  sprite.position.set(vectorEndPoint[0], vectorEndPoint[1], vectorEndPoint[2]);

  return sprite;
}

function drawAxes(
  lengths,
  label = [
    ["", "", ""],
    ["", "", ""],
  ]
) {
  const group = new THREE.Group();
  group.name = "axes";
  group.add(drawLabel(label[0][0], [lengths[0][0], 0, 0])); // -x
  group.add(drawLabel(label[0][1], [lengths[1][0], 0, 0])); // +x
  group.add(drawLabel(label[1][0], [0, lengths[0][1], 0])); // -y
  group.add(drawLabel(label[1][1], [0, lengths[1][1], 0])); // +y
  group.add(drawLabel(label[2][0], [0, 0, lengths[0][2]])); // -z
  group.add(drawLabel(label[2][1], [0, 0, lengths[1][2]])); // +z
  group.add(getAxes(lengths));
  scene.add(group);
}

function getLine(start, end, color) {
  const material = new THREE.LineBasicMaterial({
    color: color,
  });

  var p = [];
  p.push(new THREE.Vector3(...start));
  p.push(new THREE.Vector3(...end));

  const geometry = new THREE.BufferGeometry().setFromPoints(p);

  let line = new THREE.Line(geometry, material);
  return line;
}

function updateCameraDistance(camera, distance) {
  camera.left = camera.bottom = -distance;
  camera.right = camera.top = distance;
  camera.position.z = distance;
  camera.updateProjectionMatrix();
}

function getAverage(points) {
  var l = points.length;
  var sum = Array(3);
  sum.fill(0);
  points.map((s) => (sum = addVectors(s, sum)));
  return [sum[0] / l, sum[1] / l, sum[2] / l];
}

function addPointsAndAxes(withEigenVectors = 3) {
  //also draws eigenvectors
  var covarianceMatrix = getMatrixValues();
  var xMean = parseFloat(document.getElementById("x-mean").value);
  var yMean = parseFloat(document.getElementById("y-mean").value);
  var zMean = parseFloat(document.getElementById("z-mean").value);
  var avg = [xMean, yMean, zMean];
  var sampleSize = parseInt(document.getElementById("sample-size").value);
  clearScene(scene);

  //work

  var points = generateSamplesCholesky(covarianceMatrix, sampleSize, avg, 3);
  var newAvg = getAverage(points);
  var eigenVectors = PCA.getEigenVectors(points);
  eigenVectors = eigenVectors.map((vec) => vec.vector);

  var axesLengths = getMinMaxArray(points);
  var arrSpread = [...axesLengths[0], ...axesLengths[1]];
  var arr2 = arrSpread.map((num) => math.abs(num));
  var maxXYValue = math.max(...arr2);

  var colors = ["skyblue", "red", "yellow"];
  let eigenGroup = new THREE.Group();
  eigenGroup.name = "eigenvectors";
  var eigenVectorsEndpoints = getEigenVectorEndpoints(eigenVectors, points, newAvg);
  for (i = 0; i < withEigenVectors; i++) {
    var line = getLine(eigenVectorsEndpoints[i][0], eigenVectorsEndpoints[i][1], colors[i]);
    eigenGroup.add(line);
    eigenGroup.add(drawLabel("-v" + (i + 1), eigenVectorsEndpoints[i][0])); // - vector
    eigenGroup.add(drawLabel("v" + (i + 1), eigenVectorsEndpoints[i][1])); // - vector
  }
  scene.add(eigenGroup);
  drawAxes(axesLengths, [
    ["-x", "x"],
    ["-y", "y"],
    ["-z", "z"],
  ]);
  addPoints(points);
  updateCameraDistance(camera, maxXYValue * 2);
  return eigenVectors;
}
function getEigenVectorEndpoints(eigenvectors, points, avg) {
  // eigenvectors: array of eigenvectors (each is an array)
  // points: array of sample points
  // avg: array [xMean, yMean, zMean]

  // Standardize points by subtracting avg
  let standardizedPoints = points.map((p) => p.map((val, idx) => val - avg[idx]));

  // For each eigenvector, project all standardized points onto it
  // and find min/max projections to get endpoints
  let endpoints = [];
  for (let v = 0; v < eigenvectors.length; v++) {
    let eigenvector = eigenvectors[v];
    let projections = standardizedPoints.map((p) => p.reduce((sum, val, idx) => sum + val * eigenvector[idx], 0));
    let minProj = Math.min(...projections);
    let maxProj = Math.max(...projections);

    let start = eigenvector.map((val, idx) => avg[idx] + val * minProj);
    let end = eigenvector.map((val, idx) => avg[idx] + val * maxProj);
    endpoints.push([start, end]);
  }
  return endpoints; // Array of [start, end] for each eigenvector
}

function clearScene(scene) {
  while (scene.children.length > 0) {
    const object = scene.children[0];
    if (object.geometry) object.geometry.dispose(); // Dispose geometry
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((mat) => mat.dispose()); // Dispose materials
      } else {
        object.material.dispose();
      }
    }
    scene.remove(object); // Remove object from scene
  }
}

function clearPointsOnly() {
  var points = scene.getObjectByName("points");
  if (points != undefined) {
    scene.remove(points);
    points.geometry.dispose();
    if (Array.isArray(points.material)) {
      points.material.forEach((material) => material.dispose());
    } else {
      points.material.dispose();
    }
  }
}
function getMatrixValues() {
  // Example: get values from a 3x3 matrix with id="covariance-matrix"
  var matrix = [];
  var rows = document.querySelectorAll("#covariance-matrix tr");
  rows.forEach((row) => {
    let cells = row.querySelectorAll("input");
    let rowValues = [];
    cells.forEach((cell) => {
      rowValues.push(Number(cell.value));
    });
    matrix.push(rowValues);
  });
  return matrix;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // Render the scene
  renderer.render(scene, camera);
}
function changeCameraPosition(pos) {
  camera.position.x = pos[0];
  camera.position.y = pos[1];
  camera.position.z = pos[2];
}
//////scripty stuff starts here

//Dumb Copilot wants me to make the covariance table dynamically
// Dynamically create a 3x3 matrix
// Generate the 3x3 matrix
var initialCovarianceMatrix = [
  [10, 2, 5],
  [5, 10, 3],
  [1, 2, 10],
];
const matrixContainer = document.getElementById("covariance-matrix");
initialCovarianceMatrix.forEach((row, rowIndex) => {
  let tr = document.createElement("tr");
  row.forEach((value, colIndex) => {
    let td = document.createElement("td");
    let input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.dataset.row = rowIndex;
    input.dataset.col = colIndex;
    td.appendChild(input);
    tr.appendChild(td);
  });
  matrixContainer.appendChild(tr);
});

//camera rotation stuff
const radius = 10; // Distance from the object
const center = new THREE.Vector3(0, 0, 0); // Center of rotation (object's position)
let angle = 0; // Initial angle

//renderer container
var container = document.getElementById("sample-canvas");
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  container.clientWidth / -2,
  container.clientWidth / 2,
  container.clientWidth / 2,
  container.clientWidth / -2,
  0,
  10000
);
// [camera.position.x, camera.position.y, camera.position.z] = mean
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10; //Can't do 0 for some reason
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientWidth);
window.addEventListener("resize", () => {
  //camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientWidth);
});

document.getElementById("sample-canvas").appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
camera.updateProjectionMatrix();
addPointsAndAxes(3);

animate();
