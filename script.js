document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    container.appendChild(renderer.domElement);

    // --- Carousel Setup ---
    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    const imageUrls = [
        'images/arsenal.jpeg', 'images/cantona.jpeg', 'images/abstractred.jpeg',
        'images/africared.jpeg', 'images/me.jpeg', 'images/gustav.jpeg',
        'images/kd.jpeg', 'images/painting.jpeg'
    ];
    
    // Geometry Reuse
    const geometry = new THREE.PlaneGeometry(2, 1.5); 
    const textureLoader = new THREE.TextureLoader();

    // Create meshes and add them to the group
    imageUrls.forEach((url, i) => {
        const texture = textureLoader.load(url);
        texture.colorSpace = THREE.SRGBColorSpace; 

        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            side: THREE.DoubleSide 
        });
        
        const plane = new THREE.Mesh(geometry, material);
        plane.name = `carousel-image-${i}`; 
        carouselGroup.add(plane);
    });

    // --- RESPONSIVE LAYOUT LOGIC (AGGRESSIVE ZOOM FIX) ---
    
    // --- RESPONSIVE LAYOUT LOGIC (TUNED FOR "CLEAN & BIG") ---
    
    function updateCarouselLayout() {
        const isMobile = window.innerWidth < 768;
        const imageCount = carouselGroup.children.length;

        // FIXED VALUES
        // Radius 2.7 is the mathematical floor for 8 images of width 2.
        const radius = isMobile ? 2.7 : 3.5;
        
        // Camera 5.6 keeps the distance roughly the same (~2.9 units away from the front image)
        const cameraZ = isMobile ? 5.6 : 6.0;

        camera.position.z = cameraZ;

        carouselGroup.children.forEach((plane, i) => {
            const angle = (i / imageCount) * Math.PI * 2;
            plane.position.x = radius * Math.sin(angle);
            plane.position.z = radius * Math.cos(angle);
            plane.lookAt(0, 0, 0);
        });
    }

    // Run once on load to set initial positions
    updateCarouselLayout();

    // --- Interaction (Touch & Mouse) ---
    
    let isDragging = false;
    let startX = 0;
    let autoRotateSpeed = 0.002;

    const onPointerDown = (x) => {
        isDragging = true;
        startX = x;
        autoRotateSpeed = 0;
    };

    const onPointerMove = (x) => {
        if (!isDragging) return;
        const deltaX = x - startX;
        carouselGroup.rotation.y += deltaX * 0.005; 
        startX = x; 
    };

    const onPointerUp = () => {
        isDragging = false;
        autoRotateSpeed = 0.002; 
    };

    // MOUSE Listeners
    container.addEventListener('mousedown', (e) => onPointerDown(e.clientX));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX)); 
    window.addEventListener('mouseup', onPointerUp);

    // TOUCH Listeners 
    container.addEventListener('touchstart', (e) => onPointerDown(e.touches[0].clientX), { passive: false });
    container.addEventListener('touchmove', (e) => {
        e.preventDefault(); 
        onPointerMove(e.touches[0].clientX);
    }, { passive: false });
    container.addEventListener('touchend', onPointerUp);

    // --- Animation Loop ---
    const animate = () => {
        requestAnimationFrame(animate);
        if (!isDragging) {
            carouselGroup.rotation.y += autoRotateSpeed;
        }
        renderer.render(scene, camera);
    };

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        updateCarouselLayout();
    });

    animate();
});