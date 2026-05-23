// =========================================
// INTERCAMBIO DE PESTAÑAS (LOGIN / REGISTRO)
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  const tabLogin = document.getElementById('tab-login-btn');
  const tabRegistro = document.getElementById('tab-registro-btn');
  const loginPane = document.getElementById('login-pane');
  const registroPane = document.getElementById('registro-pane');

  if (tabLogin && tabRegistro && loginPane && registroPane) {
    tabLogin.classList.add('active');
    tabRegistro.classList.remove('active');
    loginPane.classList.add('active');
    registroPane.classList.remove('active');
    loginPane.style.display = 'block';
    registroPane.style.display = 'none';

    tabLogin.addEventListener('click', function(e) {
      e.preventDefault();
      tabLogin.classList.add('active');
      tabRegistro.classList.remove('active');
      loginPane.classList.add('active');
      registroPane.classList.remove('active');
      loginPane.style.display = 'block';
      registroPane.style.display = 'none';
    });

    tabRegistro.addEventListener('click', function(e) {
      e.preventDefault();
      tabRegistro.classList.add('active');
      tabLogin.classList.remove('active');
      registroPane.classList.add('active');
      loginPane.classList.remove('active');
      loginPane.style.display = 'none';
      registroPane.style.display = 'block';
    });
  }
});

// ==========================================================
// CONEXIÓN CON API: LOGIN / REGISTRO
// ==========================================================

// ✅ URL del backend en Railway
const API_BASE_URL = "https://amanecer-literario-backend-production.up.railway.app/api";

/**
 * Función central para hacer peticiones al backend.
 * Incluye el token JWT automáticamente si existe en localStorage.
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("amanecerToken");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      // Si hay un token guardado, lo enviamos en cada petición protegida
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: No se pudo completar la solicitud.`);
  }

  return data;
}

/**
 * Guarda el token y los datos del usuario en localStorage tras login/registro.
 */
function saveAuthSession(data) {
  if (data.token) {
    localStorage.setItem("amanecerToken", data.token);
  }
  // El backend puede devolver el usuario como "usuario" o como "user"
  const usuario = data.usuario || data.user;
  if (usuario) {
    localStorage.setItem("amanecerUsuario", JSON.stringify(usuario));
  }
}

/**
 * Cierra la sesión eliminando los datos del localStorage.
 * Llama a esta función desde tu botón de "Cerrar sesión" si lo tienes.
 */
function cerrarSesion() {
  localStorage.removeItem("amanecerToken");
  localStorage.removeItem("amanecerUsuario");
  // Opcional: recargar la página o redirigir
  window.location.reload();
}

/**
 * Devuelve true si hay un usuario con sesión activa.
 */
function estaAutenticado() {
  return !!localStorage.getItem("amanecerToken");
}

/**
 * Activa/desactiva el botón de submit mientras se procesa la petición.
 */
function setSubmitState(form, isLoading) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? "Procesando..." : button.dataset.originalText;
}

// ==========================================================
// FORMULARIOS: LOGIN Y REGISTRO
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.forms["form-login"];
  const registroForm = document.getElementById("form-registro");

  // ---- LOGIN ----
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setSubmitState(loginForm, true);

      try {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: loginForm.email.value.trim(),
            password: loginForm.clave.value
          })
        });

        saveAuthSession(data);
        alert(data.message || "¡Inicio de sesión exitoso!");

        // Cierra el panel de cuenta si existe
        const btnCuenta = document.getElementById("btn-cuenta");
        if (btnCuenta) btnCuenta.checked = false;

        // Opcional: recargar para reflejar estado autenticado en el UI
        // window.location.reload();

      } catch (error) {
        alert("Error al iniciar sesión: " + error.message);
      } finally {
        setSubmitState(loginForm, false);
      }
    });
  }

  // ---- REGISTRO ----
  if (registroForm) {
    registroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = registroForm.querySelector("#clave-registro")?.value;
      const repeatedPassword = registroForm.querySelector("#clave-registro-repetida")?.value;

      if (!password || !repeatedPassword) {
        alert("Por favor completa todos los campos de contraseña.");
        return;
      }

      if (password !== repeatedPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      setSubmitState(registroForm, true);

      try {
        const data = await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            nombre: registroForm.querySelector("#nombre-register")?.value.trim(),
            email: registroForm.querySelector("#email-register")?.value.trim(),
            password
          })
        });

        saveAuthSession(data);
        alert(data.message || "¡Cuenta creada correctamente!");
        registroForm.reset();

        const btnCuenta = document.getElementById("btn-cuenta");
        if (btnCuenta) btnCuenta.checked = false;

      } catch (error) {
        alert("Error al registrarse: " + error.message);
      } finally {
        setSubmitState(registroForm, false);
      }
    });
  }
});

// ==========================================================
// FUNCIONES PARA OBTENER LIBROS Y FERIAS DESDE EL BACKEND
// Úsalas en cualquier otra página que las necesite.
// ==========================================================

/**
 * Obtiene la lista de libros desde el backend.
 * @returns {Promise<Array>} Lista de libros
 */
async function obtenerLibros() {
  try {
    const data = await apiRequest("/libros");
    // El backend puede devolver { libros: [...] } o directamente un array
    return data.libros || data || [];
  } catch (error) {
    console.error("Error al obtener libros:", error.message);
    return [];
  }
}

/**
 * Obtiene la lista de ferias desde el backend.
 * @returns {Promise<Array>} Lista de ferias
 */
async function obtenerFerias() {
  try {
    const data = await apiRequest("/ferias");
    return data.ferias || data || [];
  } catch (error) {
    console.error("Error al obtener ferias:", error.message);
    return [];
  }
}

// ==========================================================
// CONTROL DE CARRUSEL DINÁMICO Y ROTACIÓN DEL BANNER
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const coleccionBanners = [
    { imagen: "imagenes/baner1.jpg" },
    { imagen: "imagenes/banner2.png" },
    { imagen: "imagenes/banner3.png" }
  ];

  let indiceActual = 0;
  let temporizadorRotacion;

  const elImagen = document.getElementById("mainBannerImage");
  const elBtnAtras = document.getElementById("bannerPrevBtn");
  const elBtnAdelante = document.getElementById("bannerNextBtn");

  function actualizarBanner(nuevoIndice) {
    if (!elImagen) return;
    indiceActual = nuevoIndice;
    elImagen.style.opacity = "0.3";
    setTimeout(() => {
      elImagen.src = coleccionBanners[indiceActual].imagen;
      elImagen.style.opacity = "1";
    }, 250);
  }

  function siguienteBanner() {
    let proximoIndice = (indiceActual + 1) % coleccionBanners.length;
    actualizarBanner(proximoIndice);
  }

  function anteriorBanner() {
    let proximoIndice = (indiceActual - 1 + coleccionBanners.length) % coleccionBanners.length;
    actualizarBanner(proximoIndice);
  }

  function iniciarAutomático() {
    clearInterval(temporizadorRotacion);
    temporizadorRotacion = setInterval(siguienteBanner, 5000);
  }

  if (elBtnAdelante && elBtnAtras) {
    elBtnAdelante.addEventListener("click", () => {
      siguienteBanner();
      iniciarAutomático();
    });
    elBtnAtras.addEventListener("click", () => {
      anteriorBanner();
      iniciarAutomático();
    });
  }

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

  let currentIndex = 0;
  const cards = carousel.querySelectorAll(".book-card");
  const totalCards = cards.length;

  const updateCarouselPosition = () => {
    if (totalCards === 0) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const computedGap = parseFloat(window.getComputedStyle(carousel).gap) || 32;
    const offset = currentIndex * (cardWidth + computedGap);
    carousel.style.transform = `translateX(-${offset}px)`;
  };

  const autoScrollNext = () => {
    const cardsInView = Math.floor(carousel.parentElement.clientWidth / (60 + 32)) || 1;
    if (currentIndex >= totalCards - cardsInView) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateCarouselPosition();
  };

  let autoScrollTimer = setInterval(autoScrollNext, 3500);

  const resetTimer = () => {
    clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(autoScrollNext, 5000);
  };

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

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex <= 0) {
        const cardsInView = Math.floor(carousel.parentElement.clientWidth / (60 + 32)) || 1;
        currentIndex = totalCards - cardsInView;
      } else {
        currentIndex--;
      }
      updateCarouselPosition();
      resetTimer();
    });
  }

  carousel.addEventListener("mouseenter", () => clearInterval(autoScrollTimer));
  carousel.addEventListener("mouseleave", () => {
    clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(autoScrollNext, 3500);
  });

  window.addEventListener("resize", updateCarouselPosition);
}

document.addEventListener("DOMContentLoaded", () => {
  initAutoCarousel();
});

// ==========================================================================
// LÓGICA DEL CARRUSEL DE LIBROS DESTACADOS (SWIPER.JS)
// ==========================================================================
if (typeof Swiper !== "undefined" && document.querySelector(".slider-wrapper")) {
  const swiper = new Swiper(".slider-wrapper", {
    loop: true,
    spaceBetween: 20,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0:    { slidesPerView: 1 },
      560:  { slidesPerView: 2 },
      768:  { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
    }
  });
}

// =========================================
// INTERACTIVIDAD: NÚMEROS GLOBALES Y CONTACTO
// =========================================
const toggleBtn = document.getElementById("toggleNumbers");
const numbersList = document.getElementById("numbersList");

if (toggleBtn && numbersList) {
  toggleBtn.addEventListener("click", () => {
    numbersList.classList.toggle("show");
    toggleBtn.textContent = numbersList.classList.contains("show")
      ? "Hide global numbers"
      : "View all global numbers";
  });
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensaje enviado correctamente.");
    contactForm.reset();
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  const libros = await obtenerLibros();
  console.log(libros); // ya tienes el array
});