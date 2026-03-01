document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('animation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // Particle class
    class Particle {
        constructor(x, y, size, color, weight) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.weight = weight; // How fast it moves
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            this.size -= 0.05;
            if (this.size < 0) {
                this.x = (Math.random() * canvas.width);
                this.y = (Math.random() * canvas.height);
                this.size = (Math.random() * 5) + 2;
                this.weight = (Math.random() * 2) - 0.5;
            }
            this.y += this.weight;
            this.weight += 0.01;

            if (this.y > canvas.height - this.size) {
                this.weight *= -0.4;
            }
        }
    }
    
    // Simplified particle line class for the background effect
    class ParticleLine {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = Math.random() * 1.5 + 0.5;
            this.size = Math.random() * 1 + 0.5;
            // 60% chance for white, 40% for red
            this.color = Math.random() > 0.6 ? '#CE1141' : 'rgba(255,255,255,0.8)';
        }
        update() {
            this.x += this.speed;
            if (this.x > canvas.width) {
                this.x = 0;
                this.y = Math.random() * canvas.height;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size * 10, this.y); // Draw a short line
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.stroke();
        }
    }


    function init() {
        particlesArray = [];
        const numberOfParticles = 100;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new ParticleLine());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
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
});
