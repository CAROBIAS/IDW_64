// Convierte archivo o URL a Base64
async function convertirImagenABase64() {
    const usaUrl = document.getElementById("tipoUrl").checked;
    
    // Caso 1: URL de imagen
    if (usaUrl) {
        const url = document.getElementById("imagenUrl").value.trim();
        if (url === "") return ""; // nada cargado
        return await urlToBase64(url);
    }

    // Caso 2: Archivo seleccionado
    const archivo = document.getElementById("imagenArchivo").files[0];
    if (!archivo) return "";
    
    return await fileToBase64(archivo);
}


// --- Auxiliares internas ---

// Convierte archivo local
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Convierte URL → Base64
async function urlToBase64(url) {
    const resp = await fetch(url);
    const blob = await resp.blob();
    return await fileToBase64(blob);
}
