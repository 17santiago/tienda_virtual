const url = "/api/productos";
const url_img = "../static/assets/";

async function cargarProductos() {
    const res = await fetch(url);
    const productos = await res.json();

    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    
    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-bordered";

    
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
        </tr>
    `;
    tabla.appendChild(thead);

    
    const tbody = document.createElement("tbody");
    productos.forEach(p => {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td><img src="${p.imagen}" alt="${p.nombre}" style="max-width: 50px; max-height: 50px;"></td>
            <td>${p.nombre}</td>
            <td>${p.precio}</td>
            <td>
                <button onclick="eliminar(${p.id})" class="btn btn-danger" style="margin: 2px">
                    <img src="../static/Icons/trash.svg" alt="Eliminar" width="20" height="20">
                </button>
                <button onclick="editar(${p.id}, '${p.nombre}', ${p.precio}, '${p.desc || ''}', '${p.imagen || ''}')" class="btn btn-warning" style="margin: 2px">
                    <img src="../static/Icons/edit.svg" alt="Editar" width="20" height="20">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
}

async function eliminar(id){
    await fetch(`${url}/${id}`, {method:"DELETE"});
    cargarProductos();
}


async function editar(id, nombreViejo, precioViejo, descViejo, imagenVieja) {
    const nombre = prompt("Nuevo nombre", nombreViejo);
    const precio = parseFloat(prompt("Nuevo precio", precioViejo));
    const desc = prompt("Nueva descripción", descViejo);
    
    // Mantener imagen existente si no se cambia
    let imagen = prompt("Nueva imagen (nombre del archivo)", imagenVieja.replace(url_img, ''));
    if (imagen === null) return;  // Cancelar si el usuario presiona Cancel
    
    // Usar imagen existente si no se ingresa nueva
    const fullImagePath = imagen ? url_img + imagen : imagenVieja;

    if (nombre && !isNaN(precio)) {
        await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nombre, 
                precio, 
                desc, 
                imagen: fullImagePath 
            }),
        });
        cargarProductos();
    } else {
        alert("Debe ingresar nombre y precio válido");
    }
}


document.getElementById("formulario").addEventListener("submit", async e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const desc = document.getElementById("descripcion").value;
    const imagen = url_img + document.getElementById("imagen").value; 
    await fetch (url, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({nombre, precio, desc, imagen})
    });
    e.target.reset();
    cargarProductos();
});

// Initial load of products when the page loads
document.addEventListener("DOMContentLoaded", cargarProductos);

