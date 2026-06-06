/* ==========================================================================
   UEP NUEVA REPÚBLICA — JAVASCRIPT GLOBAL
   Funciones: menú hamburguesa, navegación por tabs (demo multi-página),
   filtros de cartelera y validación de formulario.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------------------------------
     1. MENÚ HAMBURGUESA (móvil)
     ----------------------------------------------------------------------- */
  const hamburguesa = document.getElementById('hamburguesa');
  const nav = document.getElementById('nav-principal');

  if (hamburguesa && nav) {
    hamburguesa.addEventListener('click', function () {
      const abierto = nav.classList.toggle('abierto');
      hamburguesa.setAttribute('aria-expanded', abierto);
      // Animar las tres barras a X cuando está abierto
      const barras = hamburguesa.querySelectorAll('span');
      if (abierto) {
        barras[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        barras[1].style.opacity = '0';
        barras[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        barras[0].style.transform = '';
        barras[1].style.opacity = '';
        barras[2].style.transform = '';
      }
    });

    // Cerrar menú al hacer clic en un enlace
    nav.querySelectorAll('.nav__enlace').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        nav.classList.remove('abierto');
        hamburguesa.setAttribute('aria-expanded', 'false');
        const barras = hamburguesa.querySelectorAll('span');
        barras[0].style.transform = '';
        barras[1].style.opacity = '';
        barras[2].style.transform = '';
      });
    });
  }

  /* -----------------------------------------------------------------------
     2. NAVEGACIÓN ENTRE PÁGINAS (sistema de tabs para la maqueta demo)
     Permite navegar entre las 6 secciones del sitio sin recargar la página.
     En WordPress real, cada una será una URL separada.
     ----------------------------------------------------------------------- */
  const tabsBotones = document.querySelectorAll('.tab-pagina');
  const paginasContenido = document.querySelectorAll('.pagina');

  function mostrarPagina(idPagina) {
    // Ocultar todas las páginas
    paginasContenido.forEach(function (p) {
      p.classList.remove('visible');
    });
    // Desactivar todos los tabs
    tabsBotones.forEach(function (t) {
      t.classList.remove('activo');
    });
    // Mostrar la página seleccionada
    const paginaActiva = document.getElementById(idPagina);
    if (paginaActiva) paginaActiva.classList.add('visible');
    // Activar el tab correspondiente
    const tabActivo = document.querySelector('[data-pagina="' + idPagina + '"]');
    if (tabActivo) tabActivo.classList.add('activo');
    // También actualizar el enlace del menú principal
    document.querySelectorAll('.nav__enlace').forEach(function (enlace) {
      enlace.classList.remove('activo');
      if (enlace.getAttribute('data-pagina') === idPagina) {
        enlace.classList.add('activo');
      }
    });
    // Hacer scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Asignar eventos a los tabs de navegación
  tabsBotones.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const pagina = this.getAttribute('data-pagina');
      if (pagina) mostrarPagina(pagina);
    });
  });

  // Asignar eventos a los enlaces del menú principal
  document.querySelectorAll('.nav__enlace[data-pagina]').forEach(function (enlace) {
    enlace.addEventListener('click', function (e) {
      e.preventDefault();
      const pagina = this.getAttribute('data-pagina');
      if (pagina) mostrarPagina(pagina);
    });
  });

  // Asignar eventos a todos los botones/enlaces internos con data-pagina
  document.querySelectorAll('[data-ir-a]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const pagina = this.getAttribute('data-ir-a');
      if (pagina) mostrarPagina(pagina);
    });
  });

  // Mostrar la página de inicio por defecto
  mostrarPagina('pagina-inicio');

  /* -----------------------------------------------------------------------
     3. FILTROS DE LA CARTELERA INFORMATIVA
     ----------------------------------------------------------------------- */
  const filtrosBtns = document.querySelectorAll('.filtro-btn');
  const entradasTarjetas = document.querySelectorAll('.entrada-tarjeta');

  filtrosBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Actualizar estado activo
      filtrosBtns.forEach(function (b) { b.classList.remove('activo'); });
      this.classList.add('activo');

      const categoria = this.getAttribute('data-categoria');

      entradasTarjetas.forEach(function (tarjeta) {
        if (categoria === 'todas') {
          tarjeta.style.display = '';
        } else {
          // Mostrar u ocultar según categoría
          const catTarjeta = tarjeta.getAttribute('data-categoria');
          tarjeta.style.display = (catTarjeta === categoria) ? '' : 'none';
        }
      });
    });
  });

  /* -----------------------------------------------------------------------
     4. VALIDACIÓN BÁSICA DEL FORMULARIO DE ADMISIONES
     ----------------------------------------------------------------------- */
  const formulario = document.getElementById('formulario-cupo');

  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevenir envío real (sin backend aún)

      let valido = true;
      const camposRequeridos = formulario.querySelectorAll('[required]');

      camposRequeridos.forEach(function (campo) {
        if (!campo.value.trim()) {
          valido = false;
          campo.style.borderColor = '#e74c3c';
          campo.style.backgroundColor = '#fff5f5';
        } else {
          campo.style.borderColor = '';
          campo.style.backgroundColor = '';
        }
      });

      if (valido) {
        // Mostrar mensaje de éxito (placeholder — en WordPress se conectará al backend)
        const mensajeExito = document.getElementById('mensaje-exito');
        if (mensajeExito) {
          mensajeExito.style.display = 'block';
          formulario.reset();
          // Ocultar mensaje tras 5 segundos
          setTimeout(function () {
            mensajeExito.style.display = 'none';
          }, 5000);
        }
      }
    });

    // Limpiar errores al escribir
    formulario.querySelectorAll('input, select, textarea').forEach(function (campo) {
      campo.addEventListener('input', function () {
        this.style.borderColor = '';
        this.style.backgroundColor = '';
      });
    });
  }

  /* -----------------------------------------------------------------------
     5. ANIMACIÓN DE ENTRADA (Intersection Observer)
     Elementos con clase .animar-entrada aparecen suavemente al hacer scroll.
     ----------------------------------------------------------------------- */
  const elementosAnimados = document.querySelectorAll(
    '.tarjeta-acceso, .aviso-tarjeta, .tarjeta-nivel, .mvv-tarjeta, .directivo-tarjeta, .entrada-tarjeta'
  );

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.style.opacity = '1';
          entrada.target.style.transform = 'translateY(0)';
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.1 });

    elementosAnimados.forEach(function (el) {
      // Estado inicial oculto para animación
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observador.observe(el);
    });
  }

  /* -----------------------------------------------------------------------
     6. RE-APLICAR ANIMACIONES AL CAMBIAR DE PÁGINA
     (Las tarjetas de la nueva página también se animan al aparecer)
     ----------------------------------------------------------------------- */
  // Re-inicializar observador cuando se muestra una nueva página
  document.querySelectorAll('.tab-pagina, .nav__enlace[data-pagina], [data-ir-a]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      setTimeout(function () {
        const visibles = document.querySelectorAll(
          '.pagina.visible .tarjeta-acceso, .pagina.visible .aviso-tarjeta, .pagina.visible .tarjeta-nivel, .pagina.visible .mvv-tarjeta, .pagina.visible .directivo-tarjeta, .pagina.visible .entrada-tarjeta'
        );
        visibles.forEach(function (el) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          setTimeout(function () {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 100);
        });
      }, 50);
    });
  });

});
