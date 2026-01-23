// 1. Находим холст в документе и получаем "контекст" (инструменты для рисования)
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

// 2. Создаем массив, где будут храниться все наши снежинки
let particlesArray = [];

// 3. Настройки снега
const numberOfParticles = 150; // Количество снежинок (можно менять)

// 4. Функция для установки размеров холста
// Мы вынесли её отдельно, чтобы вызывать при каждом изменении окна (и зуме)
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// 5. Класс (шаблон) для создания каждой отдельной снежинки
class Particle {
    constructor() {
        this.init(); // Инициализируем начальные параметры
    }

    // Метод для задания начальных свойств (и для "перерождения" снежинки)
    init() {
        // Случайная позиция по X (вся ширина экрана) и Y (вся высота)
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Случайный размер от 1 до 4 пикселей
        this.size = Math.random() * 3 + 1;
        
        // Скорость: падение вниз (speedY) и легкое покачивание (speedX)
        this.speedX = Math.random() * 0.5 + 0.1;
        this.speedY = Math.random() * 1 + 0.5;
        
        // Случайная прозрачность для эффекта глубины
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    // Обновление позиции снежинки
    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Если снежинка улетела за нижнюю границу экрана
        if (this.y > canvas.height) {
            this.y = -10; // Возвращаем её чуть выше верхней границы
            this.x = Math.random() * canvas.width; // В новом случайном месте по горизонтали
        }
        
        // Если улетела за боковые границы — возвращаем с противоположной стороны
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
    }

    // Рисование снежинки на холсте
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Рисуем круг
        ctx.fill();
    }
}

// 6. Функция создания массива снежинок
function createParticles() {
    particlesArray = []; // Очищаем старые снежинки (важно при ресайзе!)
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// 7. Основной цикл анимации
function animate() {
    // Очищаем весь холст перед рисованием нового кадра
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Перебираем каждую снежинку, обновляем её положение и рисуем
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    // Запускаем следующий кадр (обычно 60 раз в секунду)
    requestAnimationFrame(animate);
}

// 8. Обработчик изменения размера окна (включая ZOOM)
window.addEventListener('resize', () => {
    setCanvasSize();     // Обновляем размер холста
    createParticles();   // Пересоздаем снежинки, чтобы они заполнили новое пространство
});

// 9. ЗАПУСК
setCanvasSize();   // 1. Устанавливаем размер под текущий экран
createParticles(); // 2. Генерируем снежинки
animate();         // 3. Начинаем бесконечную анимацию