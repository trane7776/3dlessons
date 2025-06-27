import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Axes Helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load('/textures/matcaps/2.png');
const matcapTexture2 = textureLoader.load('/textures/matcaps/7.png');

// Fonts
const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('trane7776', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 20,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 8,
    });

    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) / 2,
    //     -(textGeometry.boundingBox.max.y - 0.02) / 2,
    //     -(textGeometry.boundingBox.max.z - 0.03) / 2
    // );
    textGeometry.center();
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture1,
    });
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);
    const textCloneMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture2,
    });

    for (let i = 0; i < 100; i++) {
        const textClone = text.clone();
        textClone.name = `textClone${i}`;
        textClone.position.x = (Math.random() - 0.5) * 10;
        textClone.position.y = (Math.random() - 0.5) * 10;
        textClone.position.z = (Math.random() - 0.5) * 10;
        textClone.rotation.x = Math.random() * Math.PI;
        textClone.rotation.y = Math.random() * Math.PI;
        textClone.rotation.z = Math.random() * Math.PI;
        const scale = Math.random() * 0.5 + 0.1; // Random scale between 0.1 and 0.6
        textClone.scale.set(scale, scale, scale);
        textClone.material = textCloneMaterial;
        scene.add(textClone);
    }
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // random rotation for donuts
    // Loop through all objects in the scene
    scene.children.forEach((object) => {
        // Check if object is a mesh with donut geometry
        if (object.isMesh && object.name.startsWith('textClone')) {
            // Apply smoother, slower rotation
            const rotationSpeed = 0.007; // Reduced speed for more elegant motion
            object.rotation.x +=
                Math.sin(elapsedTime * 0.2 + object.position.y) * rotationSpeed;
            object.rotation.y +=
                Math.cos(elapsedTime * 0.15 + object.position.z) *
                rotationSpeed;
            object.rotation.z +=
                Math.sin(elapsedTime * 0.1 + object.position.x) * rotationSpeed;
        }
    });

    // Camera zoom in and out effect
    const zoomSpeed = 0.5; // Controls the speed of zoom oscillation
    const baseDistance = 2; // The middle point of zoom
    const zoomRange = 1; // How far to zoom in/out from base distance

    // Calculate new z position based on sine wave for smooth oscillation
    camera.position.z =
        baseDistance + Math.sin(elapsedTime * zoomSpeed) * zoomRange;

    // Ensure camera is always looking at the center of the scene
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
