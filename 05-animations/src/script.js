import * as THREE from 'three'
import gsap from 'gsap'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// animations


// Clock
// const clock = new THREE.Clock()



// const tick = () => {
   
//     // clock
//     const elapsedTime = clock.getElapsedTime()
   
//     mesh.rotation.y = elapsedTime
//     mesh.rotation.x = elapsedTime * 0.5


//     renderer.render(scene, camera)

//     window.requestAnimationFrame(tick)

// }
// // Start the animation
// tick()





const tick = () => {
    renderer.render(scene, camera)

    gsap.to(mesh.rotation, {
        y: Math.PI * 5,
        duration: 1,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    })



    window.requestAnimationFrame(tick)
}

tick()