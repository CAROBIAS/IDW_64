// carrusel.js - Carrusel de Obras Sociales desde LocalStorage

document.addEventListener('DOMContentLoaded', function() {
    cargarCarruselObrasSociales();
});

function cargarCarruselObrasSociales() {
    // Obtener datos de localStorage
    const obrasSocialesJSON = localStorage.getItem('centroMedico_obrasSociales');
    
    if (!obrasSocialesJSON) {
        console.log('No hay obras sociales en localStorage');
        return;
    }

    try {
        const obrasSociales = JSON.parse(obrasSocialesJSON);
        
        if (!Array.isArray(obrasSociales) || obrasSociales.length === 0) {
            console.log('No hay obras sociales disponibles');
            return;
        }

        // Obtener el contenedor del carrusel
        const carouselTrack = document.querySelector('.carousel-track');
        
        if (!carouselTrack) {
            console.error('No se encontró el contenedor .carousel-track');
            return;
        }

        // Limpiar contenido existente
        carouselTrack.innerHTML = '';

        // Crear elementos del carrusel
        obrasSociales.forEach((obraSocial, index) => {
            if (obraSocial.imagen && obraSocial.porcentaje) {
                // Crear contenedor para cada item
                const itemDiv = document.createElement('div');
                itemDiv.className = 'carousel-item-wrapper';
                
                // Crear imagen
                const img = document.createElement('img');
                img.src = obraSocial.imagen;
                img.alt = obraSocial.nombre || `Obra Social ${index + 1}`;
                img.loading = 'lazy';
                
                // Crear badge con porcentaje
                const badge = document.createElement('span');
                badge.className = 'percentage-badge';
                badge.textContent = `-${obraSocial.porcentaje}%`;
                
                // Agregar elementos al contenedor
                itemDiv.appendChild(img);
                itemDiv.appendChild(badge);
                
                // Agregar al carrusel
                carouselTrack.appendChild(itemDiv);
            }
        });

        // Duplicar items para efecto infinito
        const items = carouselTrack.innerHTML;
        carouselTrack.innerHTML = items + items;

        console.log(`Carrusel cargado con ${obrasSociales.length} obras sociales`);

    } catch (error) {
        console.error('Error al cargar obras sociales:', error);
    }
}

// Función para recargar el carrusel (útil si se actualizan los datos)
function recargarCarrusel() {
    cargarCarruselObrasSociales();
}