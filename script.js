document.addEventListener('DOMContentLoaded', () => {

    // =========== Hamburger Menu ===========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
        });

        // Close when a menu link is tapped
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
        });

        // Close when tapping outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // =========== Three.js Carousel ===========
    const container = document.getElementById('threejs-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

    const isMobile = () => window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Cap pixel ratio lower on mobile to save GPU
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    const imageUrls = [
        'images/enwonwu_1.jpg', 'images/enwonwu_2.jpg', 'images/enwonwu_3.jpg',
        'images/enwonwu_4.jpg', 'images/enwonwu_5.jpg', 'images/enwonwu_6.jpg',
        'images/enwonwu_7.jpg', 'images/enwonwu_8.jpg'
    ];

    const geometry = new THREE.PlaneGeometry(2, 1.5);
    const textureLoader = new THREE.TextureLoader();

    imageUrls.forEach((url, i) => {
        const texture = textureLoader.load(url);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        plane.name = `carousel-image-${i}`;
        carouselGroup.add(plane);
    });

    function updateCarouselLayout() {
        const mobile = isMobile();
        const imageCount = carouselGroup.children.length;
        const radius = mobile ? 2.7 : 3.5;
        camera.position.z = mobile ? 5.6 : 6.0;

        carouselGroup.children.forEach((plane, i) => {
            const angle = (i / imageCount) * Math.PI * 2;
            plane.position.x = radius * Math.sin(angle);
            plane.position.z = radius * Math.cos(angle);
            plane.lookAt(0, 0, 0);
        });
    }

    updateCarouselLayout();

    // Interaction (touch & mouse)
    let isDragging = false;
    let startX = 0;
    let autoRotateSpeed = 0.002;

    const onPointerDown = (x) => { isDragging = true; startX = x; autoRotateSpeed = 0; };
    const onPointerMove = (x) => {
        if (!isDragging) return;
        carouselGroup.rotation.y += (x - startX) * 0.005;
        startX = x;
    };
    const onPointerUp = () => { isDragging = false; autoRotateSpeed = 0.002; };

    container.addEventListener('mousedown', (e) => onPointerDown(e.clientX));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX));
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', (e) => onPointerDown(e.touches[0].clientX), { passive: true });
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        onPointerMove(e.touches[0].clientX);
    }, { passive: false });
    container.addEventListener('touchend', onPointerUp);

    // Pause rendering when the carousel is off-screen (saves battery on mobile)
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        if (!isDragging) carouselGroup.rotation.y += autoRotateSpeed;
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        updateCarouselLayout();
    });

    animate();
});
