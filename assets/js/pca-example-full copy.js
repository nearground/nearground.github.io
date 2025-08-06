// Imports mapped in HTML panel
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

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
function createAxes(minMaxarray) {
  return new BidirectionalAxesHelper(minMaxarray);
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

function drawLabeledAxes(font, sampleSpread) {
  var xLabel;
  var yLabel;
  var zLabel;
  var xVec = new THREE.Vector3(1, 0, 0);
  var yVec = new THREE.Vector3(0, 1, 0);
  var zVec = new THREE.Vector3(0, 0, 1);
  xLabel = createAxisLabel(font, "x-axis", sampleSpread, xVec);
  yLabel = createAxisLabel(font, "y-axis", sampleSpread, yVec);
  zLabel = createAxisLabel(font, "z-axis", sampleSpread, zVec);
  scene.add(xLabel);
  scene.add(yLabel);
  scene.add(zLabel);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function faceAxesLabels() {
  xLabel = createAxisLabel(font, "x-axis", sampleSpread, xVec);
  yLabel = createAxisLabel(font, "y-axis", sampleSpread, yVec);
  zLabel = createAxisLabel(font, "z-axis", sampleSpread, zVec);
  const labels = ["x-axis", "y-axis", "z-axis"];
  for (i = 0; i < labels.length; i++) {
    var label = scene.getObjectByName("x-axis");
    label.lookAt(camera.position);
  }
}
function animate() {
  //scene.add(xLabel);
  //yLabel = scene.getObjectByName( "y-axis" );
  //var zLabel = scene.getObjectByName( "x-axis" );
  // xLabel;
  // yLabel.lookAt(camera);
  // zLabel.lookAt(camera);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function addCholeskyPoints(covarianceMatrix, samples, mean) {
  const sampled = generateSamplesCholesky(covarianceMatrix, samples, mean);
  const vertices = [];
  //console.log("cholesky points: ",sampled);
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
  console.log("vertices: ", vertices);
  //vertices.push (math.round(math.e, 3),math.round(math.e, 3) ,math.round(math.e, 3) )
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  const sprite = new THREE.TextureLoader().load("/assets/img/textures/sprites/disc.png");
  const spriteSize = 50;
  const material = new THREE.PointsMaterial({
    size: spriteSize,
    sizeAttenuation: true,
    map: sprite,
    alphaTest: 0.5,
    transparent: true,
    color: 0x888888,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return [
    [minX, minY, minZ],
    [maxX, maxY, maxZ],
  ];
}
function drawAxesLabels(arr) {
  drawLabel("-x", [arr[0][0], 0, 0]);
  drawLabel("-y", [0, arr[0][1], 0]);
  drawLabel("-z", [0, 0, arr[0][2]]);
  drawLabel("x", [arr[1][0], 0, 0]);
  drawLabel("y", [0, arr[1][1], 0]);
  drawLabel("z", [0, 0, arr[1][2]]);
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

console.log("cholesky works? :", choleskyDecomposition(matrix));
var vectors = PCA.getEigenVectors(data);
var foo = math.round(math.e, 3);
console.log(foo);
console.log("PCA works :", vectors);

const depth = 20,
  size = 70;

const scene = new THREE.Scene();

var sampleSize = 10;
var sampleSpread = 100;

//add3DBox(1,1,1);

// means of our three dimensions
var meanVector = [0, 0, 0];

// covariance between dimensions. This examples makes the first and third
// dimensions highly correlated, and the second dimension independent.
var covarianceMatrix = [
  [40.0, 12.0, 120.9],
  [22, 30.0, 0.0],
  [-18.9, 0.0, 45.0],
];
//const loader = new FontLoader();
// loader.load("/assets/fonts/Roboto_Regular.json", function (font) {
//   drawLabeledAxes(font, sampleSpread);
//   animate();
// });
//addUniformPoints(sampleSize, sampleSpread, covarianceMatrix, meanVector);
const minMaxarray = addCholeskyPoints(covarianceMatrix, sampleSize, meanVector);
console.log(minMaxarray);
drawLine();
scene.add(createAxes(minMaxarray));
drawAxesLabels(minMaxarray);
//const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 10000);
// [camera.position.x, camera.position.y, camera.position.z] = mean
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 0;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

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

  scene.add(sprite);
}
animate();
