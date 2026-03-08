// Получение холста и его 2D-контекста
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

// Массив для хранения частиц (снежинок)
let particlesArray = [];

// Количество снежинок
const numberOfParticles = 150;

// Устанавливает размер холста в соответствии с размером окна
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Класс для создания и управления одной снежинкой
class Particle {
    constructor() {
        this.init();
    }

    // Инициализация или сброс свойств снежинки
    init() {
        this.x = Math.random() * canvas.width; // Случайная позиция по X
        this.y = Math.random() * canvas.height; // Случайная позиция по Y

        this.size = Math.random() * 3 + 1; // Случайный размер

        this.speedX = Math.random() * 0.5 + 0.1; // Скорость движения по X
        this.speedY = Math.random() * 1 + 0.5; // Скорость движения по Y

        this.opacity = Math.random() * 0.5 + 0.3; // Случайная прозрачность
    }

    // Обновление позиции снежинки
    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Если снежинка вышла за нижнюю границу, перемещаем ее наверх
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }

        // Если снежинка вышла за боковые границы, перемещаем ее на противоположную сторону
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
    }

    // Отрисовка снежинки
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Создание и наполнение массива снежинок
function createParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Основной цикл анимации
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста

    // Обновление и отрисовка каждой снежинки
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    requestAnimationFrame(animate); // Запрос следующего кадра анимации
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    setCanvasSize();
    createParticles();
});

// Первоначальный запуск
setCanvasSize();
createParticles();
animate();

// --- Логика для полноэкранного просмотра аватара ---
document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.querySelector('.avatar');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenAvatar = document.getElementById('fullscreen-avatar');

    if (avatar && fullscreenOverlay && fullscreenAvatar) {
        // --- Открытие оверлея ---
        avatar.addEventListener('click', () => {
            fullscreenAvatar.src = avatar.src; // Устанавливаем src для полноэкранного аватара
            fullscreenOverlay.style.display = 'flex'; // Показываем оверлей
            // Небольшая задержка для плавного появления
            setTimeout(() => {
                fullscreenOverlay.style.opacity = '1';
            }, 10);
        });

        // --- Закрытие оверлея ---
        const closeOverlay = () => {
            fullscreenOverlay.style.opacity = '0'; // Делаем оверлей прозрачным
            // Скрываем оверлей после завершения анимации (300ms)
            setTimeout(() => {
                fullscreenOverlay.style.display = 'none';
            }, 300);
        };

        // Закрытие по клику на оверлей
        fullscreenOverlay.addEventListener('click', () => {
            closeOverlay();
        });

        // Закрытие по нажатию клавиши Escape
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && fullscreenOverlay.style.display === 'flex') {
                closeOverlay();
            }
        });
    }
});

// --- Логика для переключения языка ---
document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const langIcon = langToggle ? langToggle.querySelector('.icon') : null;

    const fetchFlagIcon = async (lang) => {
        const response = await fetch(`svg/${lang.toUpperCase()}.svg`);
        const svg = await response.text();
        return svg;
    };

    const updateFlag = async () => {
        if (!langIcon) return;
        const currentPath = window.location.pathname;
        const isEnglish = currentPath.includes('.en.html');
        
        const langToLoad = isEnglish ? 'RU' : 'US';
        const flagSvg = await fetchFlagIcon(langToLoad);
        langIcon.innerHTML = flagSvg;
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            let currentPath = window.location.pathname;

            // Если путь - корень сайта, считаем его как /index.html
            if (currentPath === '/') {
                currentPath = '/index.html';
            }

            const isEnglish = currentPath.includes('.en.html');

            let newPath;
            if (isEnglish) {
                // Переключаем на русский
                newPath = currentPath.replace('.en.html', '.html');
            } else {
                // Переключаем на английский
                newPath = currentPath.replace('.html', '.en.html');
            }
            window.location.href = newPath;
        });
        
        updateFlag();
    }
});