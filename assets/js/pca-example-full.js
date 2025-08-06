// Imports mapped in HTML panel
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
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

function createAxisLabel(font, label, sampleSpread, axisVector) {
  var scaledAxes = axisVector.multiplyScalar(sampleSpread);
  const depth = 20,
    size = 70;
  var textGeo = new TextGeometry(label, {
    font: font,
    size: size,
    depth: depth,
  });

  var textMesh = new THREE.Mesh(textGeo);
  textMesh.name = label;
  textMesh.geometry.translate(scaledAxes.x, scaledAxes.y, scaledAxes.z);
  return textMesh;
}
function createAxes(minMaxArray) {
  return new BidirectionalAxesHelper(minMaxArray);
}

var data = [
  [40, 50, 60],
  [50, 70, 60],
  [80, 70, 90],
  [50, 60, 80],
];
let matrix = [
  [4, 12, -16],
  [12, 37, -43],
  [-16, -43, 98],
];

function addCholeskyPoints(covarianceMatrix, samples, mean) {
  const sampled = generateSamplesCholesky(covarianceMatrix, samples, mean);
  const vertices = [];
  var maxX = 5;
  var maxY = 5;
  var maxZ = 5;
  var minX = 0;
  var minY = 0;
  var minZ = 0;
  for (i = 0; i < sampled.length; i++) {
    //console.log("pushing cholesky point",sampled[i][0],sampled[i][1],sampled[i][2]);
    maxX = sampled[i][0] > maxX ? sampled[i][0] : maxX;
    maxY = sampled[i][1] > maxY ? sampled[i][1] : maxY;
    maxZ = sampled[i][2] > maxZ ? sampled[i][2] : maxZ;
    minX = sampled[i][0] < minX ? sampled[i][0] : minX;
    minY = sampled[i][1] < minY ? sampled[i][1] : minY;
    minZ = sampled[i][2] < minZ ? sampled[i][2] : minZ;
    vertices.push(sampled[i][0], sampled[i][1], sampled[i][2]);
  }
  //vertices.push (math.round(math.e, 3),math.round(math.e, 3) ,math.round(math.e, 3) )
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  const sprite = new THREE.TextureLoader().load("/assets/img/textures/sprites/disc.png");
  const material = new THREE.PointsMaterial({ size: 10, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true, color: 0x888888 });
  const points = new THREE.Points(geometry, material);
  points.name = "points";
  scene.add(points);
  return [
    [minX, minY, minZ],
    [maxX, maxY, maxZ],
  ];
}
function drawAxesWithLabels(arr) {
  function drawLabel(label, vector) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const message = label;
    const fontSize = 60; // Adjust as needed
    context.font = `${fontSize}px Arial`;
    context.fillStyle = "white";

    // Calculate text width to size the canvas correctly
    const metrics = context.measureText(message);
    canvas.width = metrics.width;
    canvas.height = fontSize * 2; // Add some padding

    // Re-set font after resizing canvas (important for some browsers)
    context.font = `${fontSize}px Arial`;
    context.fillStyle = "white";
    context.fillText(message, 0, fontSize); // Adjust y-position for baseline

    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture });

    const sprite = new THREE.Sprite(material);
    sprite.position.set(vector[0], vector[1], vector[2]); // Set your desired position

    return sprite;
  }
  const group = new THREE.Group();
  group.name = "axes";
  group.add(drawLabel("-x", [arr[0][0], 0, 0]));
  group.add(drawLabel("-y", [0, arr[0][1], 0]));
  group.add(drawLabel("-z", [0, 0, arr[0][2]]));
  group.add(drawLabel("x", [arr[1][0], 0, 0]));
  group.add(drawLabel("y", [0, arr[1][1], 0]));
  group.add(drawLabel("z", [0, 0, arr[1][2]]));
  group.add(createAxes(arr));
  scene.add(group);
}

function addUniformPoints(sampleSize, spread, covarianceMatrix, meanVector) {
  const vertices = [];
  for (let i = 0; i < sampleSize; i++) {
    const x = THREE.MathUtils.randFloatSpread(spread) + spread / 2;
    const y = THREE.MathUtils.randFloatSpread(spread) + spread / 2;
    const z = THREE.MathUtils.randFloatSpread(spread) + spread / 2;
    //console.log("pushing point",x,y,z);
    vertices.push(x, y, z);
  }
  //vertices.push (math.round(math.e, 3),math.round(math.e, 3) ,math.round(math.e, 3) )
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0x888888 });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
}
function add3DBox(x, y, z) {
  const geometry = new THREE.BoxGeometry(x, y, z);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
// Minimalist scene.

function drawLine() {
  // create geometry
  const bufferGeometry = new THREE.BufferGeometry();

  // create line end points and add to geometry
  const vertices = new Float32Array([
    0,
    0,
    0, // (0,0,0)
    20,
    10,
    0, // (20,10,0)
    40,
    -10,
    0, // (40,-10,0)
    60,
    0,
    0, // (60,0,0)
  ]);

  bufferGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  // create colors of each end point (vertex) and add to geometry
  const colors = new Float32Array([
    1.0,
    0.0,
    0.0, // red (normalized)
    1.0,
    1.0,
    0.0, // yellow (normalized)
    0.0,
    1.0,
    1.0, // purple (normalized)
    0.0,
    0.0,
    1.0, // blue (normalized)
  ]);

  bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // create material
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true, // inform material that geometry
    // will provide color info
    linewidth: 4, // lineWidth not universally supported
    // works with safari
  });

  // create line
  const line = new THREE.Line(bufferGeometry, lineMaterial);
  line.computeLineDistances();

  // add line to scene so it can be rendered
  scene.add(line);
}

function updateCameraDistance(camera, distance) {
  camera.left = camera.bottom = -distance;
  camera.right = camera.top = distance;
  camera.position.z = distance;
  camera.updateProjectionMatrix();
}
function addPointsAndAxes() {
  var covarianceMatrix = getMatrixValues();
  var xMean = parseFloat(document.getElementById("x-mean").value);
  var yMean = parseFloat(document.getElementById("y-mean").value);
  var zMean = parseFloat(document.getElementById("z-mean").value);
  var meanVector = [xMean, yMean, zMean];
  var sampleSize = parseInt(document.getElementById("sample-size").value);
  clearScene(scene);
  var minMaxArray = addCholeskyPoints(covarianceMatrix, sampleSize, meanVector);
  //drawLine();
  var arrSpread = [...minMaxArray[0], ...minMaxArray[1]];
  const arr2 = arrSpread.map((num) => math.abs(num));
  const maxXYValue = math.max(...arr2);
  drawAxesWithLabels(minMaxArray);
  updateCameraDistance(camera, maxXYValue * 1.1);
}

function clearObjectFromMemory(obj) {
  scene.remove(obj);
  obj.geometry.dispose();
  if (Array.isArray(obj.material)) {
    obj.material.forEach((material) => material.dispose());
  } else {
    obj.material.dispose();
  }
}
function clearScreen() {
  scene.traverse(function (obj) {
    clearObjectFromMemory(obj);
  });
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
  const matrix = [];
  const rows = document.querySelectorAll("#covariance-matrix tr");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("input");
    const rowValues = [];
    cells.forEach((cell) => {
      rowValues.push(Number(cell.value));
    });
    matrix.push(rowValues);
  });
  console.log("Covariance matrix values:", matrix);
  return matrix;
}

function animate() {
  //scene.add(xLabel);
  //yLabel = scene.getObjectByName( "y-axis" );
  //var zLabel = scene.getObjectByName( "x-axis" );
  // xLabel;
  // yLabel.lookAt(camera);
  // zLabel.lookAt(camera);
  requestAnimationFrame(animate);
  // Update angle for rotation
  angle -= 0.01; // Adjust speed by changing this value

  // Calculate new camera position
  camera.position.x = center.x + radius * Math.cos(angle);
  camera.position.z = center.z + radius * Math.sin(angle);

  // Make the camera look at the center
  camera.lookAt(center);
  controls.update();
  // Render the scene
  renderer.render(scene, camera);
}

//////scripty stuff starts here

//Dumb Copilot wants me to make the covariance table dynamically
// Dynamically create a 3x3 matrix
// Generate the 3x3 matrix
var initialCovarianceMatrix = [
  [40.0, 12.0, 120.9],
  [22, 30.0, 0.0],
  [18.9, 0.0, 45.0],
];
const matrixContainer = document.getElementById("covariance-matrix");
initialCovarianceMatrix.forEach((row, rowIndex) => {
  const tr = document.createElement("tr");
  row.forEach((value, colIndex) => {
    const td = document.createElement("td");
    const input = document.createElement("input");
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
console.log("cholesky works? :", choleskyDecomposition(matrix));
var vectors = PCA.getEigenVectors(data);
var foo = math.round(math.e, 3);
console.log(foo);
console.log("PCA works :", vectors);
const deviationMatrix = PCA.computeDeviationMatrix(data);
console.log("deviationMatrix ", deviationMatrix);
const svd = PCA.computeSVD(deviationMatrix);
console.log("svd", svd);
const scene = new THREE.Scene();

var sampleSize = 500;
var sampleSpread = 100;

//add3DBox(1,1,1);

// means of our three dimensions
var meanVector = [0, 0, 0];

// covariance between dimensions. This examples makes the first and third
// dimensions highly correlated, and the second dimension independent.

// //addUniformPoints(sampleSize, sampleSpread, covarianceMatrix, meanVector);

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
addPointsAndAxes();

animate();
