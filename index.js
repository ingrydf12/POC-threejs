import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

//Tamanhos dentro da web
const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(w, h);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement);

// Câmera
const fov = 100; //O quão perto está da câmera
const aspect = w / h; //Tamanho?
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.x = 1.5;
camera.position.y = 0.4;
camera.position.z = 3;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;

//Limitador dos x, y, z da câmera
/* controls.addEventListener('change', () => {
    camera.position.x = Math.max(1, Math.min(2.6, camera.position.x));
    camera.position.y = Math.max(0.4, Math.min(2, camera.position.x));
    camera.position.z = Math.max(2, Math.min(4, camera.position.z));
  }); */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x400987);

// Luz
const ambientLight = new THREE.AmbientLight(0x606060, 0.5); // Luz suave de fundo
scene.add(ambientLight);

// Luz Direcional (habilitar sombras)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-3, 5, 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1000;
directionalLight.shadow.mapSize.height = 1000;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = 0;  // Configuração para ajustar o tamanho da sombra
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
scene.add(directionalLight);

// Luz de Spot com sombras
const spotLight = new THREE.SpotLight(0xffaa33, 2);
spotLight.position.set(0, 5, 2);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.3;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1000;
spotLight.shadow.mapSize.height = 1000;
scene.add(spotLight);

// Luz de preenchimento suave (não gera sombra, apenas luz ambiente)
const pointLight = new THREE.PointLight(0x33aaff, 0.5, 10);
pointLight.position.set(1, 2, 1);
pointLight.castShadow = true;
scene.add(pointLight);
// Luz Hemisphere ajustada para mais contraste
const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000022, 0.5); // Céu e chão
scene.add(hemisphereLight);

// Animação para alterar dinamicamente as cores das luzes
let hue = 0;
function animateLights() {
    hue += 0.01;
    const color = new THREE.Color(`hsl(${(hue * 360) % 360}, 50%, 50%)`);
    spotLight.color = color;
    pointLight.color = color;
    requestAnimationFrame(animateLights);
}
animateLights();

// Monitor
const monitorGeometry = new THREE.BoxGeometry(3, 2, 0.1);
const monitorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
monitor.position.set(0, 1.5, -0.5);
monitor.castShadow = true;
monitor.receiveShadow = true;
scene.add(monitor);

const sup = new THREE.BoxGeometry(1, 0.2, 0.2)
const sup2= new THREE.BoxGeometry(1, 0.2, 0.2)
const supMat = new THREE.MeshBasicMaterial({color: 0x444444})
const suporte1 = new THREE.Mesh(sup, supMat);
const suporte2 = new THREE.Mesh(sup2, supMat);
suporte2.castShadow = true;
suporte2.receiveShadow = true;
suporte2.position.set(0.5, 0, -0.3);
suporte2.rotateY(Math.PI/2 - 30.5);
suporte1.position.set(-0.5, 0, -0.3);
suporte1.rotateY(Math.PI/2 + 30.5);
suporte1.castShadow = true;
suporte1.receiveShadow = true;
scene.add(suporte1);
scene.add(suporte2);


//Mesa
const loader = new THREE.TextureLoader();
const deckGeometry = new THREE.BoxGeometry(4, 0.2, 3);
const deckMaterial = new THREE.MeshBasicMaterial({ map: loader.load('madeira.png') })
const deck = new THREE.Mesh(deckGeometry, deckMaterial);
deck.position.set(0, -0.2, 0.6);
deck.castShadow = true;
deck.receiveShadow = true;
scene.add(deck);

// Tela do Monitor
const video = document.createElement('video');
video.src = 'matrix.mp4';
video.load();
video.play();
video.loop = true;
video.muted = true;
video.crossOrigin = 'anonymous';

video.oncanplaythrough = function () {
    const videoTexture = new THREE.VideoTexture(video);
    const screenGeometry = new THREE.PlaneGeometry(2.5, 1.5);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.5, -0.4);
    screen.castShadow = false;
    screen.receiveShadow = false;

    scene.add(screen);
};

// Base do Computador
const baseGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.set(0, 0, -0.5);
base.castShadow = true;
base.receiveShadow = true;
scene.add(base);

// MARK: Texto 2D
const textDiv = document.createElement('div');
const backDiv = document.createElement('div');
backDiv.style.position = 'fixed';
backDiv.style.top = '0';
backDiv.style.left = '0';
backDiv.style.width = '100%';
backDiv.style.height = '100%';
backDiv.style.backgroundColor = 'black';
backDiv.style.opacity = '0.5';
backDiv.style.transition = 'opacity 0.5s ease';
backDiv.style.zIndex = '1';
backDiv.style.display = 'none';

textDiv.style.position = 'absolute';
textDiv.style.color = 'white';
textDiv.style.top = '15%';
textDiv.style.left = '5%';
textDiv.style.maxWidth = '10%'
textDiv.style.height = '500px'
textDiv.style.fontWeight = '700';
textDiv.style.fontSize = '14rem';
textDiv.style.fontFamily = 'Silkscreen, sans-serif';
textDiv.style.display = 'none';
textDiv.style.transition = 'opacity 0.5s ease'
textDiv.style.zIndex = '2';
textDiv.innerText = 'VAMOS NESSA?';
document.body.appendChild(backDiv);
document.body.appendChild(textDiv);

// Tecla + Teclado
const keyGeometry = new THREE.BoxGeometry(1, 0.1, 0.2);
const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x161616 });
const key = new THREE.Mesh(keyGeometry, keyMaterial);
key.position.set(0, 0.1, 1.8);
scene.add(key);


const keyboardGeometry = new THREE.BoxGeometry(3, 0.2, 1);
const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x101010 });
const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
keyboard.position.set(0, 0, 1.5);
scene.add(keyboard);

// MARK: Interagir teclado
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(key);

    if (intersects.length > 0) {
        key.position.y -= 0.02;
        backDiv.style.display = 'block';
        textDiv.style.display = 'block';
        

        setTimeout(() => {
            key.position.y += 0.05;
        }, 400);
    }
});

// Chão
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    controls.update();
}

animate();