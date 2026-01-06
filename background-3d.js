/* ============================================
   ULTRA 3D IMMERSIVE BACKGROUND
   Award-winning dynamic visual experience
   ============================================ */

window.addEventListener('load', () => {
    setTimeout(initUltra3D, 500);
});

let scene, camera, renderer, composer;
let particles, nebula, geometricShapes = [];
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let clock;

function initUltra3D() {
    // Load Three.js and post-processing effects
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = setupUltraScene;
    document.head.appendChild(script);
}

function setupUltraScene() {
    // Create container
    const container = document.createElement('div');
    container.id = 'ultra-3d-bg';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        opacity: 1;
    `;
    document.body.insertBefore(container, document.body.firstChild);

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a192f, 0.015);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // Create all elements
    createStarField();
    createNebula();
    createFloatingGeometry();
    createEnergyRings();
    createDataStreams();

    // Events
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);

    // Animate
    animate();
}

/* Star Field - Optimized particle count */
function createStarField() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position - spread across a large area
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 100 - 20;

        // Color - variations of cyan
        const hue = 0.5 + Math.random() * 0.1;
        color.setHSL(hue, 0.8, 0.6 + Math.random() * 0.4);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Size
        sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

/* Nebula Effect - Glowing cloud clusters */
function createNebula() {
    const nebulaGroup = new THREE.Group();

    const nebulaConfigs = [
        { position: [-30, 20, -40], scale: 15, color: 0x64ffda, opacity: 0.03 },
        { position: [35, -15, -35], scale: 12, color: 0x4facfe, opacity: 0.02 },
        { position: [0, 30, -50], scale: 20, color: 0x00f2fe, opacity: 0.025 },
        { position: [-25, -25, -45], scale: 10, color: 0x667eea, opacity: 0.02 },
    ];

    nebulaConfigs.forEach(config => {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: config.opacity,
            blending: THREE.AdditiveBlending
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...config.position);
        mesh.scale.setScalar(config.scale);
        nebulaGroup.add(mesh);
    });

    nebula = nebulaGroup;
    scene.add(nebulaGroup);
}

/* Floating Geometry - Premium wireframe shapes */
function createFloatingGeometry() {
    const shapeDefs = [
        { type: 'icosahedron', pos: [-25, 10, -20], scale: 4, speed: 0.3 },
        { type: 'octahedron', pos: [28, -8, -15], scale: 3, speed: 0.4 },
        { type: 'dodecahedron', pos: [-20, -15, -25], scale: 2.5, speed: 0.35 },
        { type: 'torus', pos: [22, 18, -22], scale: 2, speed: 0.25 },
        { type: 'torusKnot', pos: [0, -20, -30], scale: 1.5, speed: 0.2 },
        { type: 'icosahedron', pos: [30, 25, -35], scale: 3, speed: 0.28 },
    ];

    const material = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    shapeDefs.forEach(def => {
        let geometry;
        switch (def.type) {
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(1, 1);
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(1, 0);
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(1, 0);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                break;
            case 'torusKnot':
                geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
                break;
        }

        const mesh = new THREE.Mesh(geometry, material.clone());
        mesh.position.set(...def.pos);
        mesh.scale.setScalar(def.scale);
        mesh.userData = {
            rotSpeed: { x: def.speed * 0.5, y: def.speed, z: def.speed * 0.3 },
            floatSpeed: def.speed,
            floatOffset: Math.random() * Math.PI * 2,
            initialY: def.pos[1]
        };

        scene.add(mesh);
        geometricShapes.push(mesh);
    });
}

/* Energy Rings - Glowing rotating rings */
function createEnergyRings() {
    const ringMaterial = new THREE.LineBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.1
    });

    for (let i = 0; i < 3; i++) {
        const radius = 25 + i * 12;
        const segments = 64;
        const points = [];

        for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(theta) * radius,
                (Math.random() - 0.5) * 2,
                Math.sin(theta) * radius - 30
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const ring = new THREE.Line(geometry, ringMaterial.clone());
        ring.rotation.x = Math.PI * 0.5;
        ring.userData.rotationSpeed = 0.001 + i * 0.0005;

        scene.add(ring);
        geometricShapes.push(ring);
    }
}

/* Data Streams - Flowing particle lines (optimized) */
function createDataStreams() {
    const streamCount = 4;

    for (let s = 0; s < streamCount; s++) {
        const particleCount = 25;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        const startX = (Math.random() - 0.5) * 100;
        const startZ = -Math.random() * 50 - 20;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = startX + (Math.random() - 0.5) * 5;
            positions[i3 + 1] = -50 + i * 2;
            positions[i3 + 2] = startZ + (Math.random() - 0.5) * 5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x64ffda,
            size: 0.3,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const stream = new THREE.Points(geometry, material);
        stream.userData.speed = 0.02 + Math.random() * 0.03;
        stream.userData.isStream = true;

        scene.add(stream);
        geometricShapes.push(stream);
    }
}

function onMouseMove(event) {
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

let scrollY = 0;
function onScroll() {
    scrollY = window.scrollY;
    // 3D background is always visible
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Smooth mouse following
    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;

    // Rotate star field (simple rotation only - no per-particle updates)
    if (particles) {
        particles.rotation.y += 0.0001;
        particles.rotation.x = mouseY * 0.05;
    }

    // Animate nebula (simplified)
    if (nebula) {
        nebula.rotation.y += 0.0001;
    }

    // Animate geometric shapes (simplified)
    geometricShapes.forEach(shape => {
        if (shape.userData.isStream) {
            shape.position.y += shape.userData.speed;
            if (shape.position.y > 50) {
                shape.position.y = -50;
            }
        } else if (shape.userData.rotationSpeed) {
            shape.rotation.z += shape.userData.rotationSpeed;
        } else if (shape.userData.rotSpeed) {
            shape.rotation.x += shape.userData.rotSpeed.x * 0.005;
            shape.rotation.y += shape.userData.rotSpeed.y * 0.005;
        }
    });

    // Camera responds to mouse
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.01;
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.01;
    camera.lookAt(0, 0, -20);

    renderer.render(scene, camera);
}

console.log('🌌 Ultra 3D immersive background loaded!');
