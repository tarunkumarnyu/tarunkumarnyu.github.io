/* ============================================
   THREE.JS 3D HERO ANIMATION
   Loads and displays WRC 3D model
   ============================================ */

// Import Three.js and GLTFLoader from CDN
const threeScript = document.createElement('script');
threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
threeScript.onload = loadGLTFLoader;
document.head.appendChild(threeScript);

let scene, camera, renderer, model, particles;
let mouseX = 0, mouseY = 0;
let modelLoaded = false;

function loadGLTFLoader() {
    // Load GLTFLoader after Three.js is loaded
    const gltfScript = document.createElement('script');
    gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    gltfScript.onload = initThreeJS;
    document.head.appendChild(gltfScript);
}

function initThreeJS() {
    const container = document.getElementById('hero-3d');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Load the WRC 3D model
    loadWRCModel();

    // Create floating particles
    createParticles();

    // Create orbit rings
    createOrbitRings();

    // Enhanced Lighting for 3D model
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00d4ff, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 2, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff006e, 1.5, 100);
    pointLight3.position.set(0, -5, -5);
    scene.add(pointLight3);

    // Mouse interaction
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function loadWRCModel() {
    const loader = new THREE.GLTFLoader();

    // Show loading indicator
    const container = document.getElementById('hero-3d');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'model-loading';
    loadingDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #00d4ff;
        font-family: 'Outfit', sans-serif;
        font-size: 1.2rem;
        z-index: 10;
    `;
    loadingDiv.innerHTML = '<span style="animation: pulse 1.5s infinite;">Loading 3D Model...</span>';
    container.appendChild(loadingDiv);

    loader.load(
        'models/WRC.glb',
        function (gltf) {
            model = gltf.scene;

            // Calculate bounding box to center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Center the model
            model.position.sub(center);

            // Scale model to fit nicely in the scene
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4 / maxDim;
            model.scale.setScalar(scale);

            // Add some glow/emission effect to materials
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    // Enhance materials
                    if (child.material) {
                        child.material.envMapIntensity = 1.5;
                    }
                }
            });

            scene.add(model);
            modelLoaded = true;

            // Remove loading indicator
            loadingDiv.remove();

            console.log('WRC model loaded successfully!');
        },
        function (xhr) {
            const percent = (xhr.loaded / xhr.total * 100).toFixed(1);
            loadingDiv.textContent = `Loading 3D Model... ${percent}%`;
        },
        function (error) {
            console.error('Error loading WRC model:', error);
            loadingDiv.textContent = 'Failed to load 3D model';
            loadingDiv.style.color = '#ff006e';

            // Fallback: create a simple placeholder
            createFallbackModel();
        }
    );
}

function createFallbackModel() {
    // Fallback placeholder if model fails to load
    model = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(2, 1, 3);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.3,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    model.add(body);

    scene.add(model);
    modelLoaded = true;
}

function createParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorOptions = [
        new THREE.Color(0x00d4ff),
        new THREE.Color(0x7c3aed),
        new THREE.Color(0xff006e)
    ];

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 15;
        positions[i + 1] = (Math.random() - 0.5) * 15;
        positions[i + 2] = (Math.random() - 0.5) * 15;

        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createOrbitRings() {
    const ringRadii = [2.5, 3.5, 4.5];
    const ringColors = [0x00d4ff, 0x7c3aed, 0xff006e];

    ringRadii.forEach((radius, index) => {
        const geometry = new THREE.TorusGeometry(radius, 0.01, 8, 100);
        const material = new THREE.MeshBasicMaterial({
            color: ringColors[index],
            transparent: true,
            opacity: 0.2
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2 + (index * 0.2);
        ring.rotation.z = index * 0.3;
        ring.userData.rotationSpeed = 0.001 * (index + 1);
        scene.add(ring);
    });
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    const container = document.getElementById('hero-3d');
    if (!container) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Rotate and animate the 3D model
    if (model && modelLoaded) {
        model.rotation.y += 0.003;
        model.position.y = Math.sin(time * 0.5) * 0.3;

        // Mouse interaction - subtle tilt based on mouse position
        model.rotation.x = mouseY * 0.15;
        model.rotation.z = mouseX * 0.1;
    }

    // Rotate particles
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
    }

    // Rotate orbit rings
    scene.children.forEach(child => {
        if (child.userData.rotationSpeed) {
            child.rotation.z += child.userData.rotationSpeed;
        }
    });

    renderer.render(scene, camera);
}

// ============================================
// ENHANCED PROJECT CARD 3D SHOWCASE
// ============================================
function init3DShowcase() {
    const showcaseContainers = document.querySelectorAll('.showcase-3d');

    showcaseContainers.forEach(container => {
        const img = container.querySelector('img');
        if (!img) return;

        // Create 3D rotating showcase effect
        let rotation = 0;
        let isHovered = false;

        container.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        container.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        function animateShowcase() {
            if (!isHovered) {
                rotation += 0.5;
                container.style.transform = `perspective(1000px) rotateY(${Math.sin(rotation * 0.01) * 10}deg)`;
            }
            requestAnimationFrame(animateShowcase);
        }

        animateShowcase();
    });
}

document.addEventListener('DOMContentLoaded', init3DShowcase);
