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

var vectors = PCA.getEigenVectors(data);
var foo = math.round(math.e, 3);
console.log(foo);
console.log(vectors);

console.log("testing icdf generator :", icdf(Math.random()));
// const currentTimeInMilliseconds = performance.now();
// var count = 0;
// var seconds = 1;
// while ((performance.now() - currentTimeInMilliseconds) < seconds*1000) {
//   icdf(Math.random());
//   count++;
// }
// console.log("generated ",count," samples in"," second(s)")

function reorientAxisLabels(x, y, z, xSprite) {
  // x.lookAt( camera.position );
  // y.lookAt( camera.position );
  // z.lookAt( camera.position );
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function addCholeskyPoints(covarianceMatrix, samples, mean) {
  const points = generateSamplesCholesky(covarianceMatrix, samples, mean);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.PointsMaterial({ color: 0x888888 });
  const points3D = new THREE.Points(geometry, material);
  scene.add(points3D);
}

function addPoints(sampleSize, spread) {
  const vertices = [];
  for (let i = 0; i < sampleSize; i++) {
    const x = THREE.MathUtils.randFloatSpread(spread) + spread / 2;
    const y = THREE.MathUtils.randFloatSpread(spread) + spread / 2;
    const z = THREE.MathUtils.randFloatSpread(spread) + spread / 2;

    points.push(x, y, z);
  }
  //points.push (math.round(math.e, 3),math.round(math.e, 3) ,math.round(math.e, 3) )
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.PointsMaterial({ color: 0x888888 });
  const points = new THREE.Points(geometry, material);
  //scene.add(points);
}

function add3DBox(x, y, z) {
  const geometry = new THREE.BoxGeometry(x, y, z);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);
}
// Minimalist scene.

function drawLine() {
  // create geometry
  const geometry = new THREE.BufferGeometry();
  // create line end points and add to geometry
  const vertices = new Float32Array([0, 0, 0, 50, 0, 0]);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  // create colors of each end point (vertex) and add to geometry
  const colors = new Float32Array([
    1.0,
    0.0,
    0.0, // red (normalized)
    0.0,
    1.0,
    0.0, // green (normalized)
  ]);
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  // create material
  const material = new THREE.LineBasicMaterial({
    vertexColors: true, // inform material that geometry
    // will provide color info
    linewidth: 4, // lineWidth not universally supported
    // works with safari
  });
  // create line and position it
  const line = new THREE.Line(geometry, material);
  //line.computeLineDistances();
  // add line to scene so it can be rendered
  scene.add(line);
}

//add3DBox(1,1,1);
const loader = new FontLoader();
// loader.load("/assets/fonts/Roboto_Regular.json", function (font) {
//   drawLabeledAxes(font, sampleSpread);
// });

const depth = 1,
  size = 2;

function createAxisLabel(font, label, sampleSpread, axisVector) {
  var axisEndpoint = axisVector.multiplyScalar(sampleSpread);

  var textGeo = new TextGeometry(label, {
    font: font,
    size: size,
    depth: depth,
  });

  var textMesh = new THREE.Mesh(textGeo);
  textMesh.geometry.translate(axisEndpoint.x, axisEndpoint.y, axisEndpoint.z);
  return textMesh;
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var samples = 1000;
var sampleSpread = 100;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraPosition = 10;
camera.position.x = cameraPosition;
camera.position.y = cameraPosition;
camera.position.z = cameraPosition;

const controls = new OrbitControls(camera, renderer.domElement);
//controls.target.set(sampleSpread/2,sampleSpread/2,sampleSpread/2);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

var axesLabels = new THREE.Group();
var xVec = new THREE.Vector3(1, 0, 0);
var yVec = new THREE.Vector3(0, 1, 0);
var zVec = new THREE.Vector3(0, 0, 1);
var xLabel;
var yLabel;
var zLabel;
var xSprite;
function animate() {
  requestAnimationFrame(animate);
  reorientAxisLabels(xLabel, yLabel, zLabel, xSprite);
  controls.update();
  renderer.render(scene, camera);
  //renderer.render(sceneLabels, camera);
}

loader.load("/assets/fonts/Roboto_Regular.json", function (font) {
  xLabel = createAxisLabel(font, "x-axis", sampleSpread, xVec);
  yLabel = createAxisLabel(font, "y-axis", sampleSpread, yVec);
  zLabel = createAxisLabel(font, "z-axis", sampleSpread, zVec);
  axesLabels.add(xLabel);
  axesLabels.add(yLabel);
  axesLabels.add(zLabel);
  //scene.add(axesLabels);
  animate();
});

//  var virtual_d = 10;
//   var xPoint = new THREE.Vector3(10,0,0);
//   var scale = xSprite.position.distanceTo(camera.position) / virtual_d;
//   scale = Math.min(100, Math.max(10, scale));

//   xSprite.scale.set(scale, scale, scale);
// xSprite.position.copy(xPoint);

//drawLine();
//addPoints(samples, sampleSpread);
var axes = new THREE.AxesHelper(sampleSpread);
//scene.add(new THREE.AxesHelper(axes));

let covMatrix = [
  [4, 12, -16],
  [12, 37, -43],
  [-16, -43, 98],
];

var mean = [1, 2, 3];
//addCholeskyPoints(covMatrix, samples, mean)
