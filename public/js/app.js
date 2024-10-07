import config from '../js/config.js';

const destinations = [
    { name: "Eiffel Tower", country: "France", price: "$250", description: "An iconic symbol of Paris and a breathtaking marvel of intricate architectural engineering and design." },
    { name: "Great Wall of China", country: "China", price: "$300", description: "A vast series of ancient fortifications that stretch across northern China, made of various materials." },
    { name: "Machu Picchu", country: "Peru", price: "$350", description: "An ancient Inca city in the Andes Mountains, famed for its archaeological importance and mystery." },
    { name: "Sydney Opera House", country: "Australia", price: "$280", description: "A renowned performing arts center in Sydney, famous for its striking and unique architectural style." },
    { name: "Colosseum", country: "Italy", price: "$220", description: "An ancient amphitheater in Rome, known for gladiatorial contests and magnificent architectural splendor." },
    { name: "Taj Mahal", country: "India", price: "$270", description: "A stunning marble mausoleum built by Emperor Shah Jahan, a tribute to his beloved wife, breathtaking in beauty." },
    { name: "Christ the Redeemer", country: "Brazil", price: "$320", description: "A colossal statue of Christ towering over Rio de Janeiro, a new wonder celebrated for its majestic presence." },
    { name: "Statue of Liberty", country: "USA", price: "$200", description: "A symbol of freedom and democracy, this beautiful gift from France stands proudly in the United States." },
    { name: "Santorini", country: "Greece", price: "$350", description: "An island renowned for breathtaking sunsets, whitewashed buildings, and the clarity of its turquoise waters." },
    { name: "Angkor Wat", country: "Cambodia", price: "$300", description: "A massive temple complex in Cambodia, celebrated as one of the grandest religious monuments on the planet." },
    { name: "Niagara Falls", country: "Canada", price: "$190", description: "A trio of majestic waterfalls on the border of Canada and the USA, known for their power and natural beauty." },
    { name: "Mount Fuji", country: "Japan", price: "$290", description: "Japan's highest peak, an active stratovolcano, famed for its perfectly symmetrical and iconic cone shape." }
];

// Funcion Para Imagenes De Unsplash
async function fetchImage(query) {
    const apiKey = config.UNSPLASH_API_KEY;
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`);
        const data = await response.json();
        if (data.results.length > 0) {
            return data.results[0].urls.small;
        } else {
            return 'https://via.placeholder.com/300'; // Imagen Por Defecto
        }
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        return 'https://via.placeholder.com/300'; // Imagen Por Defecto En Caso De Error
    }
}

// Funcion Para Añadir Al Carrito
function addToCart(destination) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.some(item => item.name === destination.name)) {
        showAlreadyInCartAlert(destination.name);
    } else {
        cart.push(destination);
        localStorage.setItem('cart', JSON.stringify(cart));
        showAddedToCartAlert(destination.name);
    }
}

// Funcion Para Mostrar Alertas 
function showAlreadyInCartAlert(productName) {
    Swal.fire({
        title: 'Product already in the cart',
        text: `${productName} already in the cart.`,
        icon: 'warning',
        customClass: {
            title: "custom-warning",
            content: "custom-warning",
        },
        showConfirmButton: false,
        timer: 1800,
        toast: true,
        position: 'top-end'
    });
}

function showAddedToCartAlert(productName) {
    Swal.fire({
        title: 'Product added',
        text: `${productName} has been added to the cart.`,
        icon: 'success',
        customClass: {
            title: "custom-success",
            content: "custom-success",
        },
        showConfirmButton: false,
        timer: 1800,
        toast: true,
        position: 'top-end'
    });
}


// Funcion Para Obtener Y Renderizar Los Destinos
async function fetchDestinations() {
    const destinationsWithData = await Promise.all(destinations.map(async (destination) => {
        const imageUrl = await fetchImage(destination.name);
        return {
            ...destination,
            imageUrl: imageUrl,
        };
    }));

    renderDestinations(destinationsWithData);
}

// Funcion Para Renderizar Los Destinos En El HTML
function renderDestinations(destinations) {
    const grid = document.getElementById('destinations-grid');
    grid.innerHTML = destinations.map((destination, index) => `
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card destination-card h-100 shadow-sm">
                <img src="${destination.imageUrl}" class="card-img-top" alt="${destination.name}">
                <div class="card-body text-center">
                    <h5 class="card-title text-center mb-0 fs-3">${destination.name}</h5>
                    <p class="card-country text-muted">${destination.country}</p>
                    <p class="card-price fs-5">Price: ${destination.price}</p>
                    <p class="card-description text-muted mb-4">${destination.description}</p>
                    <button class="btn btn-primary mt-auto btn-block w-100" id="add-to-cart-${index}">
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Añadir El Evento 'addToCart' A Cada Boton
    destinations.forEach((destination, index) => {
        document.getElementById(`add-to-cart-${index}`).addEventListener('click', () => addToCart(destination));
    });
}

document.addEventListener('DOMContentLoaded', fetchDestinations);
