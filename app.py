from flask import Flask, jsonify, render_template, request, redirect, url_for, session
import json
import os
from collections import defaultdict

app = Flask(__name__)
app.secret_key = 'secreto123'  # necesario para el carrito

DB_FILE = 'productos.json'

# Funciones auxiliares para cargar y guardar productos
def cargar_productos():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f:
            json.dump([], f)
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def guardar_productos(productos):
    with open(DB_FILE, 'w') as f:
        json.dump(productos, f, indent=4)

def leer_productos():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    return []

def escribir_productos(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def cargar_carrito():
    if 'carrito' not in session:
        session['carrito'] = {}
    return session['carrito']

def guardar_carrito(carrito):
    session['carrito'] = carrito

@app.route('/')
def index():
    productos = cargar_productos()
    return render_template('index.html', productos=productos)

@app.route('/carrito')
def ver_carrito():
    carrito = cargar_carrito()
    productos = cargar_productos()
    
    productos_carrito = []
    total = 0.0
    
    for producto in productos:
        if str(producto['id']) in carrito:
            cantidad = carrito[str(producto['id'])]
            # Convertir el precio de string a float para los cálculos
            precio = float(producto['precio'])  # Conversión temporal
            subtotal = precio * cantidad
            
            producto_con_cantidad = {
                'id': producto['id'],
                'nombre': producto['nombre'],
                'precio': producto['precio'],  # Mantenemos el string original
                'imagen': producto['imagen'],
                'cantidad': cantidad,
                'subtotal': subtotal  # Esto será un número
            }
            productos_carrito.append(producto_con_cantidad)
            total += subtotal
    
    return render_template('carrito.html', 
                         productos=productos_carrito, 
                         total=total)

@app.route('/agregar_al_carrito', methods=['POST'])
def agregar_al_carrito():
    producto_id = str(request.form.get('producto_id'))
    
    carrito = cargar_carrito()
    carrito[producto_id] = carrito.get(producto_id, 0) + 1
    guardar_carrito(carrito)
    
    return redirect(url_for('ver_carrito'))

@app.route('/actualizar_carrito', methods=['POST'])
def actualizar_carrito():
    producto_id = str(request.form.get('producto_id'))
    cantidad = int(request.form.get('cantidad', 1))
    
    carrito = cargar_carrito()
    
    if cantidad <= 0:
        if producto_id in carrito:
            del carrito[producto_id]
    else:
        carrito[producto_id] = cantidad
    
    guardar_carrito(carrito)
    
    return redirect(url_for('ver_carrito'))

@app.route('/eliminar_del_carrito/<producto_id>', methods=['POST'])
def eliminar_del_carrito(producto_id):
    carrito = cargar_carrito()
    
    if producto_id in carrito:
        del carrito[producto_id]
        guardar_carrito(carrito)
    
    return redirect(url_for('ver_carrito'))

@app.route('/vaciar_carrito', methods=['POST'])
def vaciar_carrito():
    session.pop('carrito', None)
    return redirect(url_for('ver_carrito'))

# Resto de las rutas se mantienen igual
@app.route('/admin')
def admin():    
    productos = cargar_productos()
    return render_template('admin.html', productos=productos)

@app.route('/api/productos', methods=['GET'])
def get_producto():
    return jsonify(leer_productos())

@app.route('/api/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    productos = leer_productos()
    productos = [p for p in productos if p['id'] != id]
    escribir_productos(productos)
    return jsonify({'message': 'Producto eliminado'}), 200

@app.route('/api/productos', methods=['POST'])
def agregar_producto():
    productos = leer_productos()
    nuevo = request.json
    nuevo['id'] = max([p['id'] for p in productos], default=0) + 1
    productos.append(nuevo)
    escribir_productos(productos)
    return jsonify(nuevo), 201

@app.route('/api/productos/<int:id>', methods=['PUT'])
def editar_producto(id):
    productos = leer_productos()
    for p in productos:
        if p['id'] == id:
            p.update(request.json)
            escribir_productos(productos)
            return jsonify(p), 200
    return jsonify({'error': 'Producto no encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)