/**
 * MAIN.JS - Inteligencia del Portfolio
 * Incluye: Dark Mode, Traducciones, Scroll Reveal y Filtros
 */

// 1. DICCIONARIO DE TRADUCCIONES
const translations = {
    es: {
        heroTitle: "Diseñador",
        heroDesc: "Creatividad aplicada a soluciones de negocio reales.",
        servGrafico: "Gráfico",
        servWeb: "Web",
        servBranding: "Branding",
        servEditorial: "Editorial",
        filterAll: "Todos",
        footerTitle: "¿Comenzamos tu proyecto?",
        contactMail: "Email",
        contactCall: "Llamar",
        contactWa: "WhatsApp"
    },
    en: {
        heroTitle: "Designer",
        heroDesc: "Creativity applied to real business solutions.",
        servGrafico: "Graphic",
        servWeb: "Web Design",
        servBranding: "Branding",
        servEditorial: "Editorial",
        filterAll: "All",
        footerTitle: "Shall we start your project?",
        contactMail: "Email",
        contactCall: "Call",
        contactWa: "WhatsApp"
    }
};

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initDarkMode();
    initLanguage();
    initScrollReveal();
    initFilters();
});

// 2. LÓGICA DE MODO OSCURO
function initDarkMode() {
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    
    // Recuperar preferencia guardada
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.setAttribute('data-lucide', 'sun');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // Guardar preferencia
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Cambiar icono
        themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        lucide.createIcons();
    });
}

// 3. LÓGICA DE IDIOMAS
function initLanguage() {
    const flags = document.querySelectorAll('.lang-flag');
    
    // Recuperar idioma guardado o usar español por defecto
    const savedLang = localStorage.getItem('lang') || 'es';
    applyLanguage(savedLang);

    flags.forEach(flag => {
        flag.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('alt').toLowerCase() === 'es' ? 'es' : 'en';
            applyLanguage(lang);
        });
    });
}

function applyLanguage(lang) {
    // Actualizar textos con atributo data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Actualizar flags activas
    document.querySelectorAll('.lang-flag').forEach(f => {
        f.classList.remove('active');
        if (f.getAttribute('alt').toLowerCase() === lang) f.classList.add('active');
    });

    localStorage.setItem('lang', lang);
}

// 4. LÓGICA DE FILTRADO (Adaptada para categoría única y múltiple)
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.proyecto-card');

    if (!filterBtns.length || !projects.length) return; // Salvaguarda si no encuentra elementos

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            let delay = 0;

            projects.forEach(p => {
                // 1. Resetear estados de animación pasados
                p.classList.remove('show');
                p.style.animation = 'none';
                
                // 2. Extraer y limpiar las categorías del proyecto de forma segura
                const categoryData = p.getAttribute('data-category') || '';
                // Dividimos por espacios y limpiamos elementos vacíos si pusiste espacios de más
                const categories = categoryData.trim().split(/\s+/);
                
                // 3. Evaluar si el proyecto pasa el filtro
                if (filter === 'all' || categories.includes(filter)) {
                    p.classList.remove('hidden');
                    void p.offsetWidth; // Reflow técnico obligatorio para reiniciar animación
                    p.style.animation = `popIn 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67) ${delay}s forwards`;
                    p.classList.add('show');
                    delay += 0.06; // Efecto stagger (escalonado)
                } else {
                    p.classList.add('hidden');
                }
            });
        });
    });
}

// 5. REVEAL ON SCROLL
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if(e.isIntersecting) {
                e.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


// --- LÓGICA DEL TYPEWRITER ---
function initTypewriter() {
    const textElement = document.getElementById('typewriter');
    
    // Si el elemento no existe (como en la página de detalle), salimos de la función sin error
    if (!textElement) return;

    const words = ["Branding & Identidad de Marca", "Diseño UX/UI & Desarrollo Web", "Diseño Editorial & Publicaciones", "Dirección de Arte & Comunicación Visual", "Consultoría Creativa & Auditoría Visual"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 80 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            speed = 2000; // Pausa cuando termina de escribir la palabra
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500; // Pausa antes de empezar la siguiente palabra
        }

        setTimeout(type, speed);
    }

    type();
}

// Asegúrate de que esta función esté llamada dentro del DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... otras inicializaciones (lucide, dark mode, etc)
    initTypewriter(); 
});



// TEXTO ANIMADO EN CARDS TRABAJOS PORTFOLIO

function initProjectTitles() {
    const cards = document.querySelectorAll('.proyecto-card');

    cards.forEach(card => {
        const titleEl = card.querySelector('.anim-title');
        if (!titleEl) return;

        const originalText = titleEl.getAttribute('data-text');
        let interval;

        card.addEventListener('mouseenter', () => {
            let i = 0;
            titleEl.textContent = ''; // Limpiamos para empezar a escribir
            
            clearInterval(interval);
            interval = setInterval(() => {
                if (i < originalText.length) {
                    titleEl.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 30); // VELOCIDAD: 30ms es muy rápido y fluido
        });

        // Opcional: Si quieres que al sacar el mouse se limpie o se quede fijo
        card.addEventListener('mouseleave', () => {
            clearInterval(interval);
            titleEl.textContent = originalText; // Restauramos el texto completo
        });
    });
}

// Actualiza tu DOMContentLoaded para incluirla
document.addEventListener('DOMContentLoaded', () => {
    // ... tus otras funciones ...
    initProjectTitles();
});

// --- ANIMACIÓN DE VISTA PREVIA (ONBOARDING DE SERVICIOS) ---
function initServicePeek() {
    const serviciosSection = document.getElementById('servicios');
    const cards = document.querySelectorAll('#servicios .servicio-card');

    if (!serviciosSection || !cards.length) return;

    let hasPeeked = false; // Garantiza que la animación solo se ejecute 1 vez por sesión

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Cuando la sección entra al 30% en pantalla y aún no ha hecho la demo
            if (entry.isIntersecting && !hasPeeked) {
                hasPeeked = true;

                // Pequeña pausa de 1.2s para que el usuario se ubique visualmente
                setTimeout(() => {
                    cards.forEach((card, index) => {
                        // Giro en cascada (efecto ola)
                        setTimeout(() => {
                            card.classList.add('flipped');

                            // Mantiene el texto visible 1.4 segundos y vuelve a su cara frontal
                            setTimeout(() => {
                                card.classList.remove('flipped');
                            }, 1400);

                        }, index * 180); // Delay entre cada tarjeta (180ms)
                    });
                }, 1200);

                observer.unobserve(entry.target); // Dejamos de observar la sección
            }
        });
    }, { threshold: 0.3 });

    observer.observe(serviciosSection);
}

// Asegúrate de llamarla dentro de tu DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    // ... tus otras funciones (initDarkMode, initTypewriter, etc) ...
    initServicePeek();
});

// --- FONDO ANIMADO DE TRAMA GEOMÉTRICA (CUADRICULADO) ---
function initGridCanvas() {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Tamaño de la retícula (32px)
    const gridSize = 32; 
    const shapes = [];
    const numShapes = 35; 

    function resize() {
        width = canvas.width = window.innerWidth || document.documentElement.clientWidth;
        height = canvas.height = window.innerHeight || document.documentElement.clientHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Generar figuras iniciales
    shapes.length = 0; // Limpiar array
    for (let i = 0; i < numShapes; i++) {
        shapes.push({
            x: Math.random() * (width || 1000),
            y: Math.random() * (height || 1000),
            size: Math.random() * 6 + 3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            type: Math.floor(Math.random() * 3), // 0: Cruz, 1: Círculo, 2: Cuadrado
            rot: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.006
        });
    }

    function draw() {
        if (!width || !height) {
            resize();
        }

        ctx.clearRect(0, 0, width, height);

        const isDark = document.body.classList.contains('dark-mode');
        
        // Intensidad visible de las líneas
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
        const shapeColor = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.16)';

        // 1. DIBUJAR HOJA CUADRICULADA
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.8;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // 2. DIBUJAR FIGURAS FLOTANTES
        ctx.strokeStyle = shapeColor;
        ctx.fillStyle = shapeColor;
        ctx.lineWidth = 1.2;

        shapes.forEach(shape => {
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rot += shape.vRot;

            if (shape.x < -20) shape.x = width + 20;
            if (shape.x > width + 20) shape.x = -20;
            if (shape.y < -20) shape.y = height + 20;
            if (shape.y > height + 20) shape.y = -20;

            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rot);

            if (shape.type === 0) {
                // Cruz (+)
                ctx.beginPath();
                ctx.moveTo(-shape.size, 0);
                ctx.lineTo(shape.size, 0);
                ctx.moveTo(0, -shape.size);
                ctx.lineTo(0, shape.size);
                ctx.stroke();
            } else if (shape.type === 1) {
                // Círculo
                ctx.beginPath();
                ctx.arc(0, 0, shape.size / 1.4, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // Cuadrado
                ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            }

            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    draw();
}

// INVOCACIÓN OBLIGATORIA EN DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    initGridCanvas();
    // ... tus otras funciones ...
});