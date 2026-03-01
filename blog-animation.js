document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('background-animation');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 100;

    // --- Theme-aware Colors ---
    let themeColors = {
        light: ['#4f46e5', '#6366f1', '#a5b4fc'],
        dark: ['#6366f1', '#818cf8', '#c7d2fe']
    };

    const getCurrentTheme = () => document.body.dataset.theme || 'light';
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            const currentTheme = getCurrentTheme();
            this.color = themeColors[currentTheme][Math.floor(Math.random() * themeColors[currentTheme].length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0.1) this.size -= 0.01;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        resetColor() {
            const currentTheme = getCurrentTheme();
            this.color = themeColors[currentTheme][Math.floor(Math.random() * themeColors[currentTheme].length)];
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size <= 0.1) {
                particles.splice(i, 1);
                particles.push(new Particle());
            }
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    // --- Listen for Theme Changes ---
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            // We need a short delay for the theme attribute to update on the body
            setTimeout(() => {
                particles.forEach(p => p.resetColor());
            }, 100);
        });
    }
});
