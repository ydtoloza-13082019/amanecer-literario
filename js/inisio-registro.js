// =========================================
// INTERCAMBIO DE PESTAÑAS (LOGIN / REGISTRO)
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const tabLogin = document.getElementById('tab-login-btn');
  const tabRegistro = document.getElementById('tab-registro-btn');
  const loginPane = document.getElementById('login-pane');
  const registroPane = document.getElementById('registro-pane');

  // Verificar que los elementos existan en el HTML antes de asignar el evento
  if (tabLogin && tabRegistro && loginPane && registroPane) {
    tabLogin.addEventListener('click', function(e) {
      e.preventDefault();
      tabLogin.classList.add('active');
      tabRegistro.classList.remove('active');
      loginPane.style.display = 'block';
      registroPane.style.display = 'none';
    });

    tabRegistro.addEventListener('click', function(e) {
      e.preventDefault();
      tabRegistro.classList.add('active');
      tabLogin.classList.remove('active');
      loginPane.style.display = 'none';
      registroPane.style.display = 'block';
    });
  }
});

// ==========================================================
// CONTROL DE CARRUSEL DINÁMICO Y ROTACIÓN DEL BANNER
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  // Definimos la lista de tus 3 banners con sus nombres exactos y sus respectivos títulos
  const coleccionBanners = [
    {
      imagen: "imagenes/baner 1.jpg",
      titulo: "Descubre historias para cada amanecer"
    },
    {
      imagen: "imagenes/banner 2.png",
      titulo: "Explora nuevos mundos en nuestro catálogo"
    },
    {
      imagen: "imagenes/banner 3.png",
      titulo: "Entérate de las próximas ferias literarias"
    }
  ];

  let indiceActual = 0;
  let temporizadorRotacion;

  // Seleccionamos los elementos del HTML
  const elImagen = document.getElementById("mainBannerImage");
  const elTitulo = document.getElementById("mainBannerTitle");
  const elBtnAtras = document.getElementById("bannerPrevBtn");
  const elBtnAdelante = document.getElementById("bannerNextBtn");

  // Función encargada de hacer el cambio de contenido con una transición suave
  function actualizarBanner(nuevoIndice) {
    if (!elImagen || !elTitulo) return;
    
    indiceActual = nuevoIndice;

    // Efecto de desvanecimiento corto (fade out)
    elImagen.style.opacity = "0.3";

    setTimeout(() => {
      // Reemplazamos la ruta de la imagen y el texto del h2
      elImagen.src = coleccionBanners[indiceActual].imagen;
      elTitulo.textContent = coleccionBanners[indiceActual].titulo;
      
      // Regresamos la opacidad a la normalidad (fade in)
      elImagen.style.opacity = "1";
    }, 250);
  }

  // Funciones para avanzar y retroceder de posición
  function siguienteBanner() {
    let proximoIndice = (indiceActual + 1) % coleccionBanners.length;
    actualizarBanner(proximoIndice);
  }

  function anteriorBanner() {
    let proximoIndice = (indiceActual - 1 + coleccionBanners.length) % coleccionBanners.length;
    actualizarBanner(proximoIndice);
  }

  // Activa el temporizador automático para que rote cada 5 segundos solo
  function iniciarAutomático() {
    clearInterval(temporizadorRotacion);
    temporizadorRotacion = setInterval(siguienteBanner, 5000);
  }

  // Escuchadores de clics para los botones de las flechas
  if (elBtnAdelante && elBtnAtras) {
    elBtnAdelante.addEventListener("click", () => {
      siguienteBanner();
      iniciarAutomático(); // Resetea el tiempo para evitar que cambie de golpe
    });

    elBtnAtras.addEventListener("click", () => {
      anteriorBanner();
      iniciarAutomático(); // Resetea el tiempo
    });
  }

  // Encendemos la rotación automática al cargar la página
  iniciarAutomático();
});

// ==========================================================================
// LÓGICA DEL CARRUSEL DE TRASLACIÓN PREMIUM AUTOMÁTICO
// ==========================================================================
function initAutoCarousel() {
  const carousel = document.getElementById("booksCarousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!carousel) return;

  let currentIndex = 0; // Guardamos el índice del libro actual en pantalla
  const cards = carousel.querySelectorAll(".book-card");
  const totalCards = cards.length;

  // Función principal: Desplaza la cinta Flexbox usando el transform de CSS
  const updateCarouselPosition = () => {
    if (totalCards === 0) return;
    
    // Medimos el ancho real de una tarjeta en el navegador
    const cardWidth = cards[0].getBoundingClientRect().width;
    
    // Leemos el gap (32px) configurado en tu CSS de forma dinámica
    const computedGap = parseFloat(window.getComputedStyle(carousel).gap) || 32; 
    
    // Calculamos cuántos píxeles debemos trasladar la cinta hacia la izquierda
    const offset = currentIndex * (cardWidth + computedGap);
    
    // Aplicamos el movimiento continuo por hardware
    carousel.style.transform = `translateX(-${offset}px)`;
  };

  // Función de avance automático (Bucle Infinito)
  const autoScrollNext = () => {
    // Calculamos cuántas tarjetas caben visibles en el contenedor según la pantalla
    const cardsInView = Math.floor(carousel.parentElement.clientWidth / (60 + 32)) || 1;
    
    // Si ya llegamos al final de los libros, regresamos suavemente al inicio (0)
    if (currentIndex >= totalCards - cardsInView) {
      currentIndex = 0; 
    } else {
      currentIndex++; // Avanzamos un libro a la derecha
    }
    updateCarouselPosition();
  };

  // PROGRAMACIÓN AUTOMÁTICA: Se ejecuta solo cada 3.5 segundos
  let autoScrollTimer = setInterval(autoScrollNext, 3500);

  // Da 5 segundos de calma tras una interacción manual para que no salte toscamente
  const resetTimer = () => {
    clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(autoScrollNext, 5000); 
  };

  // Flecha Siguiente (Derecha)
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const cardsInView = Math.floor(carousel.parentElement.clientWidth / (60 + 32)) || 1;
      if (currentIndex >= totalCards - cardsInView) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarouselPosition();
      resetTimer();
    });
  }

  // Flecha Anterior (Izquierda)
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex <= 0) {
        const cardsInView = Math.floor(carousel.parentElement.clientWidth / (60 + 32)) || 1;
        currentIndex = totalCards - cardsInView; // Si va hacia atrás desde el inicio, salta al final
      } else {
        currentIndex--;
      }
      updateCarouselPosition();
      resetTimer();
    });
  }

  // PAUSA INTELIGENTE: Si el mouse entra al carrusel, congelamos la marcha automática
  carousel.addEventListener("mouseenter", () => clearInterval(autoScrollTimer));
  
  // Al quitar el cursor, el movimiento automático vuelve a marchar solo
  carousel.addEventListener("mouseleave", () => {
    clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(autoScrollNext, 3500);
  });

  // RESPONSIVE: Si se cambia el tamaño de la pantalla, se recalculan las posiciones al instante
  window.addEventListener("resize", updateCarouselPosition);
}

// Asegúrate de inicializar la función al cargar el DOM si no lo habías hecho arriba
document.addEventListener("DOMContentLoaded", () => {
  initAutoCarousel();
});

// ==========================================================================
// LÓGICA DEL CARRUSEL libros destacados (SWIPER.JS)
// ==========================================================================
const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  spaceBetween: 20, // Espacio de 20px entre cada una de las 5 tarjetas
  grabCursor: true,

  // Paginación (Puntitos de abajo)
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Flechas de navegación (Asegúrate de que apunten a estas clases)
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // Puntos de ruptura para controlar cuántas tarjetas se ven
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    560: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 5, // <--- Esto forzará las 5 tarjetas en pantallas grandes
    }
  }
});


/* =========================================
   INTERACTIVIDAD ADAPTADA PARA LA GRID DUAL
========================================= */

const toggleBtn = document.getElementById("toggleNumbers");
const numbersList = document.getElementById("numbersList");

toggleBtn.addEventListener("click", () => {

  numbersList.classList.toggle("show");

  if (numbersList.classList.contains("show")) {
    toggleBtn.textContent = "Hide global numbers";
  } else {
    toggleBtn.textContent = "View all global numbers";
  }

});

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", (e) => {

  e.preventDefault();

  alert("Mensaje enviado correctamente.");

  contactForm.reset();

});