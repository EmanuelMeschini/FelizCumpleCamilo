
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  /* ========================================
     1. CARTA DENTRO DEL SOBRE
  ======================================== */

  const sobreNuevo = $("#sobre-cerrado");
  const modalCarta = $("#carta-modal");
  const cerrarCarta = $("#carta-cerrar");

  let elementoEnfocadoAntesDeAbrir = null;

  function abrirCarta() {
    if (!modalCarta) return;

    elementoEnfocadoAntesDeAbrir = document.activeElement;

    modalCarta.classList.add("visible");
    modalCarta.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    cerrarCarta?.focus();
    lanzarLluvia(24);
  }

  function cerrarCartaModal() {
    if (!modalCarta) return;

    modalCarta.classList.remove("visible");
    modalCarta.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (
      elementoEnfocadoAntesDeAbrir &&
      typeof elementoEnfocadoAntesDeAbrir.focus === "function"
    ) {
      elementoEnfocadoAntesDeAbrir.focus();
    }
  }

  sobreNuevo?.addEventListener("click", abrirCarta);
  cerrarCarta?.addEventListener("click", cerrarCartaModal);

  // Cerrar al tocar el espacio vacío.
  modalCarta?.addEventListener("click", (evento) => {
    if (evento.target === modalCarta) {
      cerrarCartaModal();
    }
  });

  // Cerrar con Escape.
  document.addEventListener("keydown", (evento) => {
    if (
      evento.key === "Escape" &&
      modalCarta?.classList.contains("visible")
    ) {
      cerrarCartaModal();
    }
  });


  /* ========================================
     2. LLUVIA DE CORAZONES Y ANIMALITOS
  ======================================== */

  const contenedorLluvia = $("#lluvia-animales");

  const emojis = [
    "💗", "💕", "💖", "💘", "♡",
    "🐰", "🐱", "🐾", "✨", "🌸"
  ];

  function lanzarLluvia(cantidad = 30) {
    if (!contenedorLluvia) return;

    for (let i = 0; i < cantidad; i++) {
      const particula = document.createElement("span");

      particula.className = "particula";

      particula.textContent =
        emojis[Math.floor(Math.random() * emojis.length)];

      particula.style.left = `${Math.random() * 100}%`;
      particula.style.fontSize = `${14 + Math.random() * 20}px`;

      particula.style.animationDuration =
        `${3 + Math.random() * 4}s`;

      particula.style.animationDelay =
        `${Math.random() * 1.5}s`;

      contenedorLluvia.appendChild(particula);

      particula.addEventListener(
        "animationend",
        () => particula.remove(),
        { once: true }
      );
    }
  }


  /* ========================================
     3. POLAROIDS LATERALES
  ======================================== */

  const seccionesPolaroid = [
    {
      id: "inicio",
      foto: "Imagenes/foto5.jpg",
      texto: "Un recuerdo ♡"
    },
    {
      id: "recuerdos",
      foto: "Imagenes/foto6.jpg",
      texto: "Momentos bonitos ✨"
    },
    {
      id: "animalitos",
      foto: "Imagenes/foto3.jpg",
      texto: "Siempre juntitos 💗"
    },
    {
      id: "musica",
      foto: "Imagenes/foto4.jpg",
      texto: "Nuestra canción ♫"
    }
  ];

  seccionesPolaroid.forEach((dato, indice) => {
    const seccion = document.getElementById(dato.id);

    if (!seccion) return;

    const polaroid = document.createElement("div");

    const lado = indice % 2 === 0
      ? "izquierda"
      : "derecha";

    polaroid.className = `polaroids-lateral ${lado}`;

    const imagen = document.createElement("img");

    imagen.src = dato.foto;
    imagen.alt = dato.texto;
    imagen.loading = "lazy";
    imagen.tabIndex = 0;
    imagen.setAttribute("role", "button");
    imagen.setAttribute(
      "aria-label",
      `Ampliar foto: ${dato.texto}`
    );

    const pie = document.createElement("p");
    pie.textContent = dato.texto;

    polaroid.append(imagen, pie);
    seccion.appendChild(polaroid);

    if ("IntersectionObserver" in window) {
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              polaroid.classList.add("visible");
              observador.unobserve(polaroid);
            }
          });
        },
        { threshold: 0.12 }
      );

      observador.observe(polaroid);
    } else {
      polaroid.classList.add("visible");
    }

    imagen.addEventListener("keydown", (evento) => {
      if (
        evento.key === "Enter" ||
        evento.key === " "
      ) {
        evento.preventDefault();
        abrirFoto(imagen);
      }
    });
  });


  /* ========================================
     4. VISOR DE FOTOS AMPLIADAS
  ======================================== */

  const visor = $("#visor-fotos");
  const fotoAmpliada = $("#foto-ampliada");
  const botonCerrarFoto = $("#cerrar-foto");

  let elementoAnterior = null;

  function abrirFoto(imagen) {
    if (!visor || !fotoAmpliada || !imagen) return;

    elementoAnterior = document.activeElement;

    fotoAmpliada.src = imagen.currentSrc || imagen.src;
    fotoAmpliada.alt = imagen.alt || "Fotografía de recuerdo";

    visor.classList.add("visible");
    visor.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    botonCerrarFoto?.focus();
  }

  function cerrarFoto() {
    if (!visor || !fotoAmpliada) return;

    visor.classList.remove("visible");
    visor.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    fotoAmpliada.removeAttribute("src");
    fotoAmpliada.alt = "";

    if (
      elementoAnterior &&
      typeof elementoAnterior.focus === "function"
    ) {
      elementoAnterior.focus();
    }
  }

  // Abrir fotos de la galería.
  $$(".galeria-fotos .foto").forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const imagen = $("img", tarjeta);

      if (imagen) abrirFoto(imagen);
    });
  });

  // Abrir las Polaroids laterales.
  document.addEventListener("click", (evento) => {
    if (!(evento.target instanceof Element)) return;

    const imagenPolaroid = evento.target.closest(
      ".polaroids-lateral img"
    );

    if (imagenPolaroid) {
      abrirFoto(imagenPolaroid);
    }
  });

  botonCerrarFoto?.addEventListener("click", cerrarFoto);

  // Cerrar al tocar el fondo.
  visor?.addEventListener("click", (evento) => {
    if (evento.target === visor) {
      cerrarFoto();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (
      evento.key === "Escape" &&
      visor?.classList.contains("visible")
    ) {
      cerrarFoto();
    }
  });


  /* ========================================
     5. MENSAJES SORPRESA
  ======================================== */

  const botonSorpresa = $("#boton-sorpresa");
  const mensajeSorpresa = $("#mensaje-sorpresa");

  const mensajes = [
    "Recordatorio importante: sos una persona muy especial y merecés cosas hermosas. 💗",

    "El comité de animalitos confirma que hoy tenés permiso para recibir todos los mimos del mundo. 🐰",

    "Ojalá pudiera darte un abrazo enorme en este momento. Te mando uno virtual, pero multiplicado por mil. 🫂",

    "Que nunca te falten motivos para reír, canciones para cantar y personas que te quieran bonito. ✨",

    "Notificación oficial: alguien te quiere muchísimo y preparó todo esto pensando en vos. 💌",

    "Tu misión de hoy es disfrutar, sonreír y dejar que te mimen un poquito más de lo habitual. 🎀"
  ];

  let ultimoMensaje = -1;

  botonSorpresa?.addEventListener("click", () => {
    if (!mensajeSorpresa) return;

    let nuevoMensaje;

    do {
      nuevoMensaje = Math.floor(
        Math.random() * mensajes.length
      );
    } while (
      mensajes.length > 1 &&
      nuevoMensaje === ultimoMensaje
    );

    ultimoMensaje = nuevoMensaje;

    mensajeSorpresa.textContent = mensajes[nuevoMensaje];
    mensajeSorpresa.hidden = false;

    lanzarLluvia(25);
  });


  /* ========================================
     6. MENSAJE FINAL
  ======================================== */

  const botonFinal = $("#boton-final");
  const mensajeFinal = $("#mensaje-final");

  botonFinal?.addEventListener("click", () => {
    if (!mensajeFinal) return;

    const mostrar = mensajeFinal.hidden;

    mensajeFinal.hidden = !mostrar;

    botonFinal.textContent = mostrar
      ? "Cerrar mensajito 💗"
      : "Tengo una última cosita 💌";

    if (mostrar) {
      lanzarLluvia(45);

      mensajeFinal.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });


  /* ========================================
     7. REPRODUCTOR MUSICAL
  ======================================== */

  const audio = $("#audio");
  const pistas = $$(".pista");
  const estadoMusica = $("#estado-musica");
  const disco = $(".disco");

  function actualizarPistaActiva(pistaActiva) {
    pistas.forEach((pista) => {
      const activa = pista === pistaActiva;

      pista.classList.toggle("reproduciendo", activa);

      const icono = $(".pista-play", pista);

      if (icono) {
        icono.textContent = activa ? "♫" : "▶";
      }
    });
  }

  function limpiarPistaActiva() {
    pistas.forEach((pista) => {
      pista.classList.remove("reproduciendo");

      const icono = $(".pista-play", pista);

      if (icono) icono.textContent = "▶";
    });

    disco?.classList.remove("girando");
  }

  pistas.forEach((pista) => {
    pista.addEventListener("click", async () => {
      if (!audio) return;

      const ruta = pista.dataset.src;
      const titulo = pista.dataset.titulo || "Canción";
      const artista = pista.dataset.artista || "";

      if (!ruta) {
        if (estadoMusica) {
          estadoMusica.textContent =
            "Esta canción todavía no tiene un archivo asignado. ♡";
        }

        return;
      }

      // Si es la canción actual, pausar o reanudar.
      if (
        audio.dataset.rutaActual === ruta &&
        audio.getAttribute("src")
      ) {
        if (audio.paused) {
          try {
            await audio.play();

            actualizarPistaActiva(pista);
            disco?.classList.add("girando");

            if (estadoMusica) {
              estadoMusica.textContent =
                `Sonando: ${titulo} — ${artista} ♫`;
            }
          } catch {
            if (estadoMusica) {
              estadoMusica.textContent =
                "No se pudo reproducir. Revisá que el MP3 exista.";
            }
          }
        } else {
          audio.pause();
          disco?.classList.remove("girando");

          if (estadoMusica) {
            estadoMusica.textContent = `En pausa: ${titulo} ♡`;
          }
        }

        return;
      }

      audio.pause();
      audio.src = ruta;
      audio.dataset.rutaActual = ruta;
      audio.load();

      limpiarPistaActiva();

      try {
        await audio.play();

        actualizarPistaActiva(pista);
        disco?.classList.add("girando");

        if (estadoMusica) {
          estadoMusica.textContent =
            `Sonando: ${titulo} — ${artista} ♫`;
        }
      } catch {
        limpiarPistaActiva();

        if (estadoMusica) {
          estadoMusica.textContent =
            "No se pudo reproducir. Revisá el nombre del archivo y la carpeta Musica.";
        }
      }
    });
  });

  audio?.addEventListener("pause", () => {
    disco?.classList.remove("girando");
  });

  audio?.addEventListener("play", () => {
    disco?.classList.add("girando");
  });

  audio?.addEventListener("ended", () => {
    limpiarPistaActiva();

    if (estadoMusica) {
      estadoMusica.textContent =
        "Canción terminada ♡ Elegí otra si querés.";
    }
  });

  audio?.addEventListener("error", () => {
    limpiarPistaActiva();

    if (estadoMusica) {
      estadoMusica.textContent =
        "No se encontró el archivo de audio. Revisá el nombre y la carpeta Musica.";
    }
  });

});





