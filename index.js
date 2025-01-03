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
camera.position.x = 0;
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
  });
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);

// MARK: Luz

// Luz Direcional (habilitar sombras)

// Luz de Spot com sombras
const spotLight = new THREE.SpotLight(0xba204e, 1);
spotLight.position.set(3, 4, 0.7);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 1.0;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 200;
spotLight.shadow.mapSize.height = 200;
scene.add(spotLight);

const spot2 = new THREE.SpotLight(0xffffff, 0.3);
spot2.position.set(0, 5, 0.7);
spot2.angle = Math.PI / 8;
spot2.penumbra = 0.2;
spot2.castShadow = true;
spot2.shadow.mapSize.width = 1000;
spot2.shadow.mapSize.height = 1000;
scene.add(spot2);

// Luz de preenchimento suave (não gera sombra, apenas luz ambiente)
const pointLight = new THREE.PointLight(0xb51246, 0.5, 5);
pointLight.position.set(0, 2, 1);
pointLight.penumbra =1;
pointLight.castShadow = true;
scene.add(pointLight);
// Luz Hemisphere ajustada para mais contraste
const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000022, 0.5); // Céu e chão
scene.add(hemisphereLight);


// Monitor
const monitorGeometry = new THREE.BoxGeometry(4, 2, 0.1);
const monitorMaterial = new THREE.MeshStandardMaterial({ color: 0x151515 });
const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
monitor.position.set(0, 1.5, -0.5);
monitor.castShadow = true;
monitor.receiveShadow = true;
scene.add(monitor);

const sup = new THREE.BoxGeometry(1, 0.2, 0.2)
const sup2= new THREE.BoxGeometry(1, 0.2, 0.2)
const supMat = new THREE.MeshStandardMaterial({color: 0x151515})
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
const deckGeometry = new THREE.BoxGeometry(10, 0.2, 3);
const deckMaterial = new THREE.MeshPhongMaterial({color: 0xfafafa})
/* const deckMaterial = new THREE.MeshPhongMaterial({ map: loader.load('madeira.png') })
 */const deck = new THREE.Mesh(deckGeometry, deckMaterial);
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
    const screenGeometry = new THREE.PlaneGeometry(3.8, 1.7);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.5, -0.4);
    screen.castShadow = false;
    screen.receiveShadow = false;

    scene.add(screen);
};

// Base do Computador
const baseGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x151515 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.set(0, 0.2, -0.5);
base.castShadow = true;
base.receiveShadow = true;
scene.add(base);

//Suporte Abajur
const luzAbajur = new THREE.PointLight(0xd6ad1a, 4, 3);
luzAbajur.position.set(-4, 2.5, 0);
luzAbajur.penumbra =1;
luzAbajur.castShadow = true;
scene.add(luzAbajur);

const geometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32, 3); 
const circleGeo = new THREE.CylinderGeometry(0.3, 1, 1, 32, 3, 1, false); 
const material = new THREE.MeshPhongMaterial( {color: 0x7d3a10} ); 
const mat = new THREE.MeshLambertMaterial( {color: 0x7d3a10} ); 
const cylinder = new THREE.Mesh( geometry, material );
const circleCyl = new THREE.Mesh(circleGeo, mat);

circleCyl.position.set(-4,2.5,0);
cylinder.position.set(-4, 1, 0);
scene.add(cylinder);
scene.add(circleCyl);


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
const keyGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);

const keyMaterial = new THREE.MeshPhongMaterial({ color: 0x171717 });
const key = new THREE.Mesh(keyGeometry, keyMaterial);
const keyG = new THREE.Mesh(keyGeo, keyMaterial);
keyG.position.set(-1, 0.1, 1.8);
key.position.set(0, 0.1, 1.8);
scene.add(key);
scene.add(keyG);

const keyboardGeometry = new THREE.BoxGeometry(3, 0.2, 1);
const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x404040 });
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