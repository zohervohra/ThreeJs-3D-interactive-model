// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable antialiasing for smoother edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Adjust for device pixel ratio
document.body.appendChild(renderer.domElement);

const loadingMessage = document.getElementById('loadingMessage');
loadingMessage.style.display = 'block';



// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.25; // Damping factor
controls.screenSpacePanning = false; // Disable screen space panning
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation
controls.autoRotate = true; // Enable autorotation
controls.autoRotateSpeed = 5.0; // Adjust the autorotation speed
controls.minDistance = 1; // Minimum zoom distance
controls.maxDistance = 2; // Maximum zoom distance


// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// GLTF Loader
const loader = new THREE.GLTFLoader();

// change the path to the model to get different 3D objects
loader.load('nike/scene.gltf', function (gltf) {
    const nikeModel = gltf.scene;
    scene.add(nikeModel);

    // for scaling
    nikeModel.scale.set(1, 1, 1); 

    // Compute the bounding box of the model
    const box = new THREE.Box3().setFromObject(nikeModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model
    nikeModel.position.sub(center);
    // Adjust camera position to ensure the model is in view
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    camera.position.set(0, 0, cameraZ * 1.5); // Move the camera back to view the larger model

    // Update controls target to the center of the model
    controls.target.copy(new THREE.Vector3(0, 0, 0));
    controls.update();

    // Hide loading message
    loadingMessage.style.display = 'none';
    

}, undefined, function (error) {
    console.error(error);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // rotate by x direction 

    controls.update(); 
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});
