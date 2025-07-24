document.addEventListener('DOMContentLoaded', function() {
    // Actualizar cantidad de producto
    document.querySelectorAll('.cantidad-producto').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const cantidad = parseInt(this.value);
            
            fetch('/actualizar_carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    cantidad: cantidad
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload(); // Recargar para ver cambios
                }
            });
        });
    });
    
    // Eliminar producto
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            
            fetch(`/eliminar_del_carrito/${productId}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
        });
    });
    
    // Vaciar carrito
    document.getElementById('vaciar-carrito')?.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            fetch('/vaciar_carrito', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
        }
    });
});