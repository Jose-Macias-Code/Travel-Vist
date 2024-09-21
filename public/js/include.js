function loadHTML(selector, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = data;

                // Solo Ejecuta El Script De Ocultar Enlaces Si Se Ha Cargado El Header
                if (selector === '#header') {
                    const currentPage = window.location.pathname.split('/').pop();
                    if (currentPage === 'cart.html') {
                        const aboutLink = document.getElementById('nav-about');
                        const destinationsLink = document.getElementById('nav-destinations');
                        if (aboutLink) aboutLink.style.display = 'none';
                        if (destinationsLink) destinationsLink.style.display = 'none';
                    }
                }
            } else {
                console.error(`Element with selector ${selector} not found.`);
            }
        })
        .catch(error => console.error('Error Loading HTML:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadHTML('#header', '../partials/header.html');  
    loadHTML('#footer', '../partials/footer.html'); 
});
