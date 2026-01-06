/* ============================================
   3D MODEL VIEWER - Interactive CAD Display
   Uses Three.js + OrbitControls for full 3D interaction
   ============================================ */

class ModelViewer {
    constructor(container, modelPath, options = {}) {
        this.container = container;
        this.modelPath = modelPath;
        this.options = {
            autoRotate: true,
            autoRotateSpeed: 2,
            backgroundColor: 0x050508,
            ambientLightColor: 0x404050,
            ambientLightIntensity: 0.4,
            directionalLightColor: 0x00d4ff,
            directionalLightIntensity: 1,
            accentLightColor: 0x7c3aed,
            enableZoom: true,
            enablePan: false,
            ...options
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);

        // Add fog for depth
        this.scene.fog = new THREE.Fog(this.options.backgroundColor, 10, 50);

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(3, 2, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.container.appendChild(this.renderer.domElement);

        // Lights
        this.setupLights();

        // Grid and environment
        this.setupEnvironment();

        // Controls
        this.setupControls();

        // Load model
        this.loadModel();

        // Handle resize
        window.addEventListener('resize', () => this.onResize());

        // Start animation
        this.animate();
    }

    setupLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(
            this.options.ambientLightColor,
            this.options.ambientLightIntensity
        );
        this.scene.add(ambient);

        // Main directional light (cyan)
        const mainLight = new THREE.DirectionalLight(
            this.options.directionalLightColor,
            this.options.directionalLightIntensity
        );
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // Accent light (purple)
        const accentLight = new THREE.DirectionalLight(
            this.options.accentLightColor,
            0.6
        );
        accentLight.position.set(-5, 5, -5);
        this.scene.add(accentLight);

        // Rim light (pink)
        const rimLight = new THREE.DirectionalLight(0xff006e, 0.3);
        rimLight.position.set(0, -5, -5);
        this.scene.add(rimLight);

        // Point light following camera (subtle)
        this.cameraLight = new THREE.PointLight(0xffffff, 0.2, 10);
        this.scene.add(this.cameraLight);
    }

    setupEnvironment() {
        // Grid
        const gridHelper = new THREE.GridHelper(20, 40, 0x00d4ff, 0x1a1a25);
        gridHelper.position.y = -1;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        // Ground plane with reflection
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x050508,
            metalness: 0.8,
            roughness: 0.4,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.01;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Floating particles
        this.createParticles();
    }

    createParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = Math.random() * 10;
            positions[i + 2] = (Math.random() - 0.5) * 20;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupControls() {
        // OrbitControls for interaction
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.autoRotate = this.options.autoRotate;
            this.controls.autoRotateSpeed = this.options.autoRotateSpeed;
            this.controls.enableZoom = this.options.enableZoom;
            this.controls.enablePan = this.options.enablePan;
            this.controls.minDistance = 2;
            this.controls.maxDistance = 15;
        }
    }

    loadModel() {
        if (!this.modelPath) {
            this.createPlaceholderModel();
            return;
        }

        const loader = new THREE.GLTFLoader();

        // Show loading indicator
        this.showLoading();

        loader.load(
            this.modelPath,
            (gltf) => {
                this.model = gltf.scene;

                // Center and scale model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                this.model.scale.setScalar(scale);

                this.model.position.sub(center.multiplyScalar(scale));
                this.model.position.y = 0;

                // Enable shadows
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        // Enhance materials
                        if (child.material) {
                            child.material.envMapIntensity = 1;
                        }
                    }
                });

                this.scene.add(this.model);
                this.hideLoading();

                // Handle animations if present
                if (gltf.animations && gltf.animations.length) {
                    this.mixer = new THREE.AnimationMixer(this.model);
                    gltf.animations.forEach((clip) => {
                        this.mixer.clipAction(clip).play();
                    });
                }
            },
            (progress) => {
                const percent = (progress.loaded / progress.total * 100).toFixed(0);
                this.updateLoadingProgress(percent);
            },
            (error) => {
                console.error('Error loading model:', error);
                this.createPlaceholderModel();
                this.hideLoading();
            }
        );
    }

    createPlaceholderModel() {
        // Create a stylized drone placeholder
        const group = new THREE.Group();

        // Body
        const bodyGeom = new THREE.OctahedronGeometry(0.5, 0);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        group.add(body);

        // Arms
        const armPositions = [
            { x: 1, z: 1 },
            { x: -1, z: 1 },
            { x: 1, z: -1 },
            { x: -1, z: -1 }
        ];

        armPositions.forEach((pos) => {
            const armGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
            const armMat = new THREE.MeshStandardMaterial({
                color: 0x1a1a25,
                metalness: 0.9,
                roughness: 0.3
            });
            const arm = new THREE.Mesh(armGeom, armMat);
            arm.rotation.z = Math.PI / 4 * (pos.x * pos.z);
            arm.rotation.x = Math.PI / 2;
            arm.position.set(pos.x * 0.5, 0, pos.z * 0.5);
            arm.lookAt(pos.x, 0, pos.z);
            group.add(arm);

            // Motor
            const motorGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
            const motorMat = new THREE.MeshStandardMaterial({
                color: 0x7c3aed,
                emissive: 0x7c3aed,
                emissiveIntensity: 0.3
            });
            const motor = new THREE.Mesh(motorGeom, motorMat);
            motor.position.set(pos.x, 0.1, pos.z);
            group.add(motor);

            // Propeller
            const propGeom = new THREE.BoxGeometry(0.8, 0.02, 0.1);
            const propMat = new THREE.MeshStandardMaterial({
                color: 0x00d4ff,
                transparent: true,
                opacity: 0.7
            });
            const prop = new THREE.Mesh(propGeom, propMat);
            prop.position.set(pos.x, 0.15, pos.z);
            group.add(prop);
        });

        this.model = group;
        this.scene.add(this.model);
    }

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'model-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading 3D Model... <span class="loading-percent">0%</span></div>
        `;
        this.container.appendChild(loadingDiv);
    }

    updateLoadingProgress(percent) {
        const percentEl = this.container.querySelector('.loading-percent');
        if (percentEl) {
            percentEl.textContent = percent + '%';
        }
    }

    hideLoading() {
        const loadingDiv = this.container.querySelector('.model-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Update camera light position
        if (this.cameraLight) {
            this.cameraLight.position.copy(this.camera.position);
        }

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
        }

        // Update animation mixer
        if (this.mixer) {
            this.mixer.update(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        // Clean up
        this.renderer.dispose();
        if (this.controls) this.controls.dispose();
        window.removeEventListener('resize', this.onResize);
    }
}

// ============================================
// INITIALIZE ALL MODEL VIEWERS ON PAGE
// ============================================
function initModelViewers() {
    const modelContainers = document.querySelectorAll('.model-viewer');

    modelContainers.forEach(container => {
        const modelPath = container.dataset.model || null;
        const autoRotate = container.dataset.autoRotate !== 'false';

        new ModelViewer(container, modelPath, {
            autoRotate: autoRotate
        });
    });
}

// Wait for Three.js and GLTFLoader to load
function waitForThree(callback) {
    if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
        callback();
    } else {
        setTimeout(() => waitForThree(callback), 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    waitForThree(initModelViewers);
});

// Export for manual initialization
window.ModelViewer = ModelViewer;
