// Imports mapped in HTML panel
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

var data = [
  [40, 50, 60],
  [50, 70, 60],
  [80, 70, 90],
  [50, 60, 80],
];
var test = { length: n };
console.log(test);
let matrix = [
  [4, 12, -16],
  [12, 37, -43],
  [-16, -43, 98],
];
let maxtrix2 = Array;

console.log(choleskyDecomposition(matrix));
var vectors = PCA.getEigenVectors(data);
var foo = math.round(math.e, 3);
console.log(foo);
console.log(vectors);

const depth = 20,
  size = 70;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 1.5;
camera.position.y = 1.5;
camera.position.z = 1.5;

function drawLabeledAxes(font, sampleSpread) {
  function createAxes(sampleSpread) {
    return new THREE.AxesHelper(sampleSpread);
  }
  function createAxisLabel(font, label, sampleSpread, axisVector) {
    var scaledAxes = axisVector.multiplyScalar(sampleSpread);

    var textGeo = new TextGeometry(label, {
      font: font,
      size: size,
      depth: depth,
    });

    var textMesh = new THREE.Mesh(textGeo);
    textMesh.geometry.translate(scaledAxes.x, scaledAxes.y, scaledAxes.z);
    return textMesh;
  }
  var axesGroup = new THREE.Group();
  var xVec = new THREE.Vector3(1, 0, 0);
  var yVec = new THREE.Vector3(0, 1, 0);
  var zVec = new THREE.Vector3(0, 0, 1);

  axesGroup.add(createAxisLabel(font, "x-axis", sampleSpread, xVec));
  axesGroup.add(createAxisLabel(font, "y-axis", sampleSpread, yVec));
  axesGroup.add(createAxisLabel(font, "z-axis", sampleSpread, zVec));
  axesGroup.add(createAxes(sampleSpread));
  scene.add(axesGroup);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

function createPoints() {}

function addPoints(sampleSize, spread, covarianceMatrix, meanVector) {
  const vertices = [];
  for (let i = 0; i < sampleSize; i++) {
    const x = THREE.MathUtils.randFloatSpread(spread) + spread / 2;
    const y = THREE.MathUtils.randFloatSpread(spread) + spread / 2;
    const z = THREE.MathUtils.randFloatSpread(spread) + spread / 2;

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

var sampleSize = 1000;
var sampleSpread = 100;
//add3DBox(1,1,1);
const loader = new FontLoader();
loader.load("/assets/fonts/Roboto_Regular.json", function (font) {
  drawLabeledAxes(font, sampleSpread);
});

// means of our three dimensions
var meanVector = [1, 2, 3];

// covariance between dimensions. This examples makes the first and third
// dimensions highly correlated, and the second dimension independent.
var covarianceMatrix = [
  [1.0, 0.0, 0.9],
  [0.0, 1.0, 0.0],
  [0.9, 0.0, 1.0],
];

addPoints(sampleSize, sampleSpread, covarianceMatrix, meanVector);

drawLine();

animate();
