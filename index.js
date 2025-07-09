import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.131/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.131/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1.5, 3.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 1.8;
controls.maxDistance = 4.5;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2 - 0.1;

controls.addEventListener("change", () => {
    const zoomProgress = (controls.maxDistance - controls.getDistance()) / (controls.maxDistance - controls.minDistance);
    camera.fov = fov - (fov * 0.4 * zoomProgress);
    camera.updateProjectionMatrix();
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020202);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const mainDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
mainDirectionalLight.position.set(5, 8, 3);
mainDirectionalLight.castShadow = true;
mainDirectionalLight.shadow.mapSize.width = 2048;
mainDirectionalLight.shadow.mapSize.height = 2048;
mainDirectionalLight.shadow.camera.left = -5;
mainDirectionalLight.shadow.camera.right = 5;
mainDirectionalLight.shadow.camera.top = 5;
mainDirectionalLight.shadow.camera.bottom = -5;
mainDirectionalLight.shadow.camera.near = 0.1;
mainDirectionalLight.shadow.camera.far = 20;
mainDirectionalLight.shadow.bias = -0.0005;
scene.add(mainDirectionalLight);

const monitorSpotLight = new THREE.SpotLight(0xb82e43, 1.0, 10, Math.PI / 4, 1, 1);
monitorSpotLight.position.set(0.5, 4, 3);
monitorSpotLight.castShadow = true;
monitorSpotLight.shadow.mapSize.width = 1024;
monitorSpotLight.shadow.mapSize.height = 1024;
monitorSpotLight.shadow.bias = -0.0001;
scene.add(monitorSpotLight);

// Luz do Abajur (SpotLight)
const lampLight = new THREE.SpotLight(0xffcc99, 0.8, 5, Math.PI / 5, 0.5, 1);
lampLight.position.set(-1.5, 1.4, -0.5);
const lampTarget = new THREE.Object3D();
lampTarget.position.set(-1.5, 0, -0.5);
scene.add(lampTarget);
lampLight.target = lampTarget;
lampLight.castShadow = true;
lampLight.shadow.mapSize.width = 512;
lampLight.shadow.mapSize.height = 512;
lampLight.shadow.bias = -0.0001;
scene.add(lampLight);

// Monitor
const monitorGeometry = new THREE.BoxGeometry(2, 1.2, 0.1);

const monitorMaterial = new THREE.MeshStandardMaterial({
  color: 0x151515,
  metalness: 0.7,
  roughness: 0.2,
  emissive: 0x111111,
  emissiveIntensity: 0.3,
  transparent: true,
});

const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
monitor.position.set(0, 0.9, -0.9);
monitor.castShadow = true;
monitor.receiveShadow = true;
scene.add(monitor);

// Base do Monitor
const standGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.1);
const standMaterial = new THREE.MeshStandardMaterial({ color: 0x151515 });
const monitorStand = new THREE.Mesh(standGeometry, standMaterial);
monitorStand.position.set(0, 0.3, -0.9);
monitorStand.castShadow = true;
monitorStand.receiveShadow = true;
scene.add(monitorStand);

const sup = new THREE.BoxGeometry(0.6, 0.2, 0.2)
const sup2= new THREE.BoxGeometry(0.6, 0.2, 0.2)
const supMat = new THREE.MeshStandardMaterial({color: 0x151515})
const suporte1 = new THREE.Mesh(sup, supMat);
const suporte2 = new THREE.Mesh(sup2, supMat);
suporte2.castShadow = true;
suporte2.receiveShadow = true;
suporte2.position.set(0.3, 0, -0.8);
suporte2.rotateY(Math.PI/2 - 30.5);
suporte1.position.set(-0.3, 0, -0.8);
suporte1.rotateY(Math.PI/2 + 30.5);
suporte1.castShadow = true;
suporte1.receiveShadow = true;
scene.add(suporte1);
scene.add(suporte2);

// Mesa
const loader = new THREE.TextureLoader();

const metalColor = loader.load("textures/metalColor.jpg");
const metalNormal = loader.load("textures/metal.png");
const metalRoughness = loader.load("textures/metalRough.png");

const deckGeometry = new THREE.BoxGeometry(4, 0.2, 2);
const deckMaterial = new THREE.MeshStandardMaterial({
    map: metalColor,
    normalMap: metalNormal,
    roughnessMap: metalRoughness,
    metalness: 1.0,
    roughness: 0,
    envMapIntensity: 1.0,
});

const deck = new THREE.Mesh(deckGeometry, deckMaterial);
deck.position.set(0, -0.1, 0);
deck.castShadow = true;
deck.receiveShadow = true;
scene.add(deck);

// Tela do Monitor
const video = document.createElement("video");
video.src = "matrix.mp4";
video.load();
video.play();
video.loop = true;
video.muted = true;
video.crossOrigin = "anonymous";

video.oncanplaythrough = function () {
    const videoTexture = new THREE.VideoTexture(video);
    const screenGeometry = new THREE.PlaneGeometry(1.9, 1.05);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.9, -0.84);
    scene.add(screen);
};

// --- Texto 2D ---
const textDiv = document.createElement("div");
const backDiv = document.createElement("div");

backDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: 10;
    pointer-events: none;
`;

textDiv.style.cssText = `
    position: absolute;
    color: #00ff00;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5rem;
    font-weight: 700;
    font-family: 'Silkscreen', cursive;
    text-shadow: 0 0 10px #00ff00;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: 11;
    pointer-events: none;
    text-align: center;
    white-space: nowrap;
`;
textDiv.innerText = "VAMOS NESSA?";
document.body.appendChild(backDiv);
document.body.appendChild(textDiv);

// --- Teclado ---
const keyboardMaterial = new THREE.MeshStandardMaterial({
    color: 0x303030,
    roughness: 0.7,
    metalness: 0.2,
});

const keyMaterial = new THREE.MeshStandardMaterial({
    color: 0x171717,
    roughness: 0.6,
    metalness: 0.1,
});
const pressedKeyMaterial = new THREE.MeshStandardMaterial({
    color: 0x007bff,
    emissive: 0x007bff,
    emissiveIntensity: 0.3,
    roughness: 0.6,
    metalness: 0.1,
});

const keyWidth = 0.1;
const keyHeight = 0.05;
const keyDepth = 0.11;
const spacingX = 0.02;
const spacingZ = 0.02;

const numKeysPerRow = 12;
const numAlphaRows = 4;

const keyboardWidth = (numKeysPerRow * keyWidth) + ((numKeysPerRow - 1) * spacingX) + (spacingX * 2) + 0.1;
const keyboardDepth = (numAlphaRows * keyDepth) + ((numAlphaRows - 1) * spacingZ) + keyDepth + spacingZ + (spacingZ * 2);

// Base do Teclado
const keyboardBaseHeight = 0.1;
const keyboardBaseGeometry = new THREE.BoxGeometry(keyboardWidth, keyboardBaseHeight, keyboardDepth);
const keyboardBase = new THREE.Mesh(keyboardBaseGeometry, keyboardMaterial);
keyboardBase.position.set(0, -0.04, 0.4);
keyboardBase.castShadow = true;
keyboardBase.receiveShadow = true;
scene.add(keyboardBase);

const allKeys = [];

const alphaKeysStart_Z = keyboardBase.position.z + (keyboardBase.geometry.parameters.depth / 2) - (keyDepth / 2) - spacingZ;
const zOffset = 0.15;

for (let row = 0; row < numAlphaRows; row++) {
    const rowWidth = (numKeysPerRow * keyWidth) + ((numKeysPerRow - 1) * spacingX);
    const rowStart_X = keyboardBase.position.x - (rowWidth / 2) + (keyWidth / 2);

    for (let col = 0; col < numKeysPerRow; col++) {
        const keyGeometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
        const key = new THREE.Mesh(keyGeometry, keyMaterial);

        key.position.x = rowStart_X + col * (keyWidth + spacingX);
        key.position.y = keyboardBase.position.y + keyboardBaseHeight / 2 + keyHeight / 2 + 0.01;
        key.position.z = row * (keyDepth + spacingZ) + zOffset;

        key.castShadow = true;
        key.receiveShadow = true;
        key.originalY = key.position.y;
        key.originalMaterial = keyMaterial;

        scene.add(key);
        allKeys.push(key);
    }
}

const spacebarWidth = keyWidth * 6 + spacingX * 5;
const spacebarHeight = keyHeight;
const spacebarDepth = keyDepth;

const spacebarGeometry = new THREE.BoxGeometry(spacebarWidth, spacebarHeight, spacebarDepth);
const spacebar = new THREE.Mesh(spacebarGeometry, keyMaterial);

const lastAlphaRow_Z = alphaKeysStart_Z - (numAlphaRows - 1) * (keyDepth + spacingZ);
spacebar.position.z = lastAlphaRow_Z + keyboardBase.position.z;

spacebar.position.x = keyboardBase.position.x;
spacebar.position.y = keyboardBase.position.y + keyboardBaseHeight / 2 + spacebarHeight / 2 + 0.01;

spacebar.castShadow = true;
spacebar.receiveShadow = true;
spacebar.originalY = spacebar.position.y;
spacebar.originalMaterial = keyMaterial;

scene.add(spacebar);
allKeys.push(spacebar);

// --- Interagir teclado ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(allKeys);

    if (intersects.length > 0) {
        const clickedKey = intersects[0].object;

        clickedKey.position.y -= 0.02;
        clickedKey.material = pressedKeyMaterial;

        backDiv.style.display = "block";
        textDiv.style.display = "block";
        backDiv.style.opacity = "0.7";
        textDiv.style.opacity = "1";

        setTimeout(() => {
            clickedKey.position.y = clickedKey.originalY;
            clickedKey.material = clickedKey.originalMaterial;

            backDiv.style.opacity = "0";
            textDiv.style.opacity = "0";
            setTimeout(() => {
                backDiv.style.display = "none";
                textDiv.style.display = "none";
            }, 300);
        }, 1500);
    }
});

// Chão
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x181818,
    roughness: 0.8,
    metalness: 0.1,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.15;
floor.receiveShadow = true;
scene.add(floor);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});