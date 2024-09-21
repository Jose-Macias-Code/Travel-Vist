document.addEventListener('DOMContentLoaded', renderCart);

// Funcion Para Renderizar El Carrito
function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsContainer = document.getElementById('cart-items');
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">There are no products in the cart.</p>';
        document.getElementById('cart-total').innerText = `Total: $0.00`;
        return; 
    }

    // Renderizar Elementos Del Carrito
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-3">
            <div>
                <h5 class="mb-1">${item.name}</h5>
                <p class="mb-1 text-muted">${item.country}</p>
                <p class="mb-1">Price: <strong>${item.price}</strong></p>
            </div>
            <img src="${item.imageUrl}" alt="${item.name}" width="100" height="80" class="cart-img rounded">
        </div>
    `).join('');

    total = cart.reduce((acc, item) => acc + parseFloat(item.price.replace('$', '')), 0);
    document.getElementById('cart-total').innerText = `Total: $${total.toFixed(2)}`;
}

// Evento Para Limpiar El Carrito Al Hacer Clic En El Boton Correspondiente
document.getElementById('clear-cart').addEventListener('click', () => {
    clearCart();
});

// Evento Para Manejar El Envio Del Formulario
document.getElementById('payment-form').addEventListener('submit', (e) => {
    e.preventDefault(); 

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        Swal.fire({
            title: 'Warning',
            text: 'There is nothing in the cart.',
            icon: 'warning',
            confirmButtonText: 'Accept'
        });
        return; 
    }

    // Obtener Los Valores De Los Campos Del Formulario
    const cardNumber = document.getElementById('card-number').value;
    const cardName = document.getElementById('card-name').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    // Validar Los Campos De Entrada
    if (validateInputs(cardNumber, cardName, expiryDate, cvv)) {
        Swal.fire({
            title: 'Payment Successful!',
            text: 'Your payment has been processed successfully.',
            icon: 'success',
            confirmButtonText: 'Accept'
        }).then(() => {
            clearCart(); 
            clearForm(); 
        });
    }
});

// Funcion Para Validar Los Campos De Entrada
function validateInputs(cardNumber, cardName, expiryDate, cvv) {
    let isValid = true; 
    clearErrors();

    // Validar El Numero De Tarjeta
    const cardNumberRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
    if (!cardNumberRegex.test(cardNumber)) {
        isValid = false; 
        showError('card-number', 'card-number-error'); // Mostrar Error
    }

    // Validar El Nombre De La Tarjeta
    if (cardName.trim() === '') {
        isValid = false;
        showError('card-name', 'card-name-error');
    }

    // Validar La Fecha De Expiracion
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
        isValid = false;
        showError('expiry-date', 'expiry-date-error');
    }

    // Validar El CVV
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
        isValid = false;
        showError('cvv', 'cvv-error');
    }

    return isValid; // Devolver El Estado De Validez
}

// Funcion Para Limpiar Los Mensajes De Error
function clearErrors() {
    const fields = ['card-number', 'card-name', 'expiry-date', 'cvv'];
    fields.forEach(field => {
        document.getElementById(field).classList.remove('is-invalid'); 
        document.getElementById(`${field}-error`).style.display = 'none'; 
    });
}

// Funcion Para Mostrar Mensajes De Error
function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add('is-invalid'); 
    document.getElementById(errorId).style.display = 'block'; 
}

// Funcion Para Limpiar El Carrito
function clearCart() {
    localStorage.removeItem('cart'); 
    renderCart(); 
}

// Funcion Para Limpiar El Formulario De Pago
function clearForm() {
    document.getElementById('payment-form').reset(); 
    clearErrors(); 
}
