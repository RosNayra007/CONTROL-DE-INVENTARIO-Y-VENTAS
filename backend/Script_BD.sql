CREATE DATABASE inventario_ventas_db;
USE inventario_ventas_db;

-- Tabla de usuarios con roles
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor', 'almacen') DEFAULT 'vendedor',
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de logs de acceso
CREATE TABLE logs_acceso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ip VARCHAR(45),
    evento ENUM('ingreso', 'salida') NOT NULL,
    browser VARCHAR(255),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    eliminado TINYINT(1) DEFAULT 0
);

-- Tabla de productos (CRUD con eliminación lógica)
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT,
    precio_compra DECIMAL(10, 2) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    imagen VARCHAR(255),
    eliminado TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nit VARCHAR(20) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    eliminado TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado TINYINT(1) DEFAULT 0,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalle de ventas
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de proveedores (opcional pero útil)
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    eliminado TINYINT(1) DEFAULT 0
);

-- Insertar datos de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Dispositivos electrónicos y accesorios'),
('Alimentos', 'Productos alimenticios'),
('Ropa', 'Vestimenta y accesorios'),
('Hogar', 'Artículos para el hogar');

-- (El hash cambia en cada ejecución, este es solo un ejemplo)
INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES
('Administrador del Sistema', 'admin@tienda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1);

-- Clientes de ejemplo
INSERT INTO clientes (nit, nombre, telefono, email, direccion) VALUES
('1234567', 'Cliente General', '70000000', 'cliente@email.com', 'La Paz, Bolivia'),
('7654321', 'Juan Pérez', '71111111', 'juan@email.com', 'Calle 1, La Paz');

-- Productos de ejemplo
INSERT INTO productos (codigo, nombre, descripcion, categoria_id, precio_compra, precio_venta, stock, stock_minimo) VALUES
('PROD001', 'Laptop HP', 'Laptop HP 15 pulgadas, 8GB RAM', 1, 3500.00, 4500.00, 10, 3),
('PROD002', 'Mouse Inalámbrico', 'Mouse inalámbrico Logitech', 1, 50.00, 80.00, 25, 5),
('PROD003', 'Teclado Mecánico', 'Teclado mecánico RGB', 1, 150.00, 220.00, 15, 5),
('PROD004', 'Arroz 1kg', 'Arroz blanco 1 kilogramo', 2, 8.00, 12.00, 100, 20),
('PROD005', 'Aceite Vegetal', 'Aceite vegetal 1 litro', 2, 15.00, 22.00, 50, 10);