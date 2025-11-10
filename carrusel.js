document.addEventListener("DOMContentLoaded", () => {
  // Obtener obras sociales del localStorage
  const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
  
  const track = document.querySelector('.carousel-track');
  
  if (!track) return; // Si no existe el elemento, salir
  
  // Limpiar el contenido actual del carrusel
  track.innerHTML = '';
  
  // Filtrar solo las obras sociales activas
  const obrasSocialesActivas = obrasSociales.filter(os => os.activo);
  
  // Obras sociales por defecto con descuentos de ejemplo
  const obrasSocialesDefault = [
    { nombre: "Hospital Alemán", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osHA.jpg", descuento: 10 },
    { nombre: "OSDE", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osOsde.jpg", descuento: 15 },
    { nombre: "OSPATCA", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osOspatca.gif", descuento: 12 },
    { nombre: "Swiss Medical", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osSS.jpg", descuento: 20 },
    { nombre: "OSDIPP", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osOsdipp.gif", descuento: 8 },
    { nombre: "Comisarios", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osComisarios.png", descuento: 5 },
    { nombre: "Cobermed", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osCobermed.png", descuento: 18 },
    { nombre: "Dasuten", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osDasuten.jpg", descuento: 25 },
    { nombre: "Omint", imagen: "https://www.cmbelgrano.com.ar/images/cobertura/osOmint.png", descuento: 15 }
  ];
  
  // Usar las obras sociales del localStorage o las por defecto
  const obrasSocialesAMostrar = obrasSocialesActivas.length > 0 ? obrasSocialesActivas : obrasSocialesDefault;
  
  // Generar las imágenes del carrusel
  obrasSocialesAMostrar.forEach(os => {
    // Crear contenedor flex para imagen + badge lado a lado
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '8px';
    
    // Crear imagen (los estilos vienen del CSS: width: 50px, border-radius: 10px)
    const img = document.createElement('img');
    img.src = os.imagen;
    img.alt = os.nombre;
    
    wrapper.appendChild(img);
    
    // Si tiene descuento, agregar badge al lado
    if (os.descuento && os.descuento > 0) {
      const badge = document.createElement('span');
      badge.className = 'descuento-badge';
      badge.textContent = `-${os.descuento}%`;
      badge.style.backgroundColor = '#28a745';
      badge.style.color = 'white';
      badge.style.padding = '3px 7px';
      badge.style.borderRadius = '4px';
      badge.style.fontSize = '11px';
      badge.style.fontWeight = 'bold';
      badge.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
      badge.style.whiteSpace = 'nowrap';
      badge.style.flexShrink = '0';
      
      wrapper.appendChild(badge);
    }
    
    track.appendChild(wrapper);
  });
  
  // Obtener todos los contenedores actuales
  const items = Array.from(track.children);
  
  // Clonar los elementos y agregarlos al final para efecto infinito
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
  
  // Animación del carrusel
  let position = 0;
  function moveCarousel() {
    position -= 1; // velocidad (px por frame)
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0; // reset al llegar a la mitad
    }
    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(moveCarousel);
  }
  
  moveCarousel();
});