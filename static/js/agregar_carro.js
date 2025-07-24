const url = "/api/productos";
const url_img = "../static/assets/";



document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los botones de "Agregar al carrito"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Agregar evento click a cada botón
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obtener los datos del producto
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            
            // Crear objeto del producto
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            };
            
            // Llamar a la función para agregar al carrito
            addToCart(product);
            
            // Redirigir al carrito
            window.location.href = '/carrito';
        });
    });
    
    // Función para agregar producto al carrito
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            // Si existe, incrementar la cantidad
            existingProduct.quantity += 1;
        } else {
            // Si no existe, agregarlo al carrito
            cart.push(product);
        }
        
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Opcional: Mostrar notificación
        alert(`${product.name} ha sido agregado al carrito!`);
    }
});