const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];

const numberOfParticles = 150;

// Управление размером холста
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Класс снежинки
class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 3 + 1;

        this.speedX = Math.random() * 0.5 + 0.1;
        this.speedY = Math.random() * 1 + 0.5;

        this.opacity = Math.random() * 0.5 + 0.3;
    }

    // Обновление позиции снежинки
    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Создание частиц
function createParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Анимация
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    requestAnimationFrame(animate);
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    setCanvasSize();
    createParticles();
});

// Запуск
setCanvasSize();
createParticles();
animate();