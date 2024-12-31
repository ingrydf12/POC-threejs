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
controls.dampingFactor = 0.4;
controls.maxPolarAngle = Math.PI / 2;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x400987);

// Luz
// Luz Ambiente (luz suave de fundo)
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Cor e intensidade
scene.add(ambientLight);

// Luz Direcional (como luz do sol)


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
directionalLight.position.set(5, 5, 2);
directionalLight.castShadow = true;
scene.add(directionalLight);

const alt = new THREE.HemisphereLight({ color: 0xffffff, blending: THREE.AdditiveBlending })
alt.position.set(0, 0, 0);
alt.castShadow = true;
alt.groundColor.set(0x000000)
scene.add(alt)

// Luz de Spot (efeito dramático de "spotlight")
const light = new THREE.DirectionalLight({ color: 0x175397 });
light.castShadow = true; // default false
light.penumbra = 10;
light.position.set(0, 0.5, 0.5)
scene.add(light);

const spotLight = new THREE.SpotLight(0xff0000, 2);
spotLight.position.set(0, 3, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.1;
spotLight.castShadow = true;
scene.add(spotLight);

const backgroundLight = new THREE.HemisphereLight(0xaaaaff, 0x000000, 0.3); // Cor do céu e cor da terra
scene.add(backgroundLight);

// Monitor
const monitorGeometry = new THREE.BoxGeometry(3, 2, 0.1);
const monitorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
monitor.position.set(0, 1.5, -0.5);
monitor.castShadow = true;
monitor.receiveShadow = true;
scene.add(monitor);

//Mesa
const loader = new THREE.TextureLoader();
const deckGeometry = new THREE.BoxGeometry(4, 0.2, 3);
const deckMaterial = new THREE.MeshBasicMaterial({ map: loader.load('madeira.png') })
const deck = new THREE.Mesh(deckGeometry, deckMaterial);
deck.position.set(0, -0.2, 0.6);
deck.castShadow = false;
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
const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
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

    // Detecta interseções
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