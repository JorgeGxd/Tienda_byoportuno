CREATE database tienda;
USE tienda;

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(50),
  imagen VARCHAR(255)
);
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);
INSERT INTO usuarios (username, password, rol)
VALUES ('dueno', '$2b$10$WwGyjY2HhHf6LUL.rKkGFe5A0MZ9rsrL3ePFGQZ/6HrIYFHFzv8Le', 'admin');

INSERT INTO usuarios (username, password, rol)
VALUES ('admin', '$2b$10$WwGyjY2HhHf6LUL.rKkGFe5A0MZ9rsrL3ePFGQZ/6HrIYFHFzv8Le', 'admin');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria) 
VALUES ("Pin Hollow Knight", "Pin esmatlado metalico con diseño de Hollow Knight", "30.00", "10", "Videojuegos");

INSERT INTO usuarios (username, password, rol)
VALUES ('admin2', 'admin', 'admin');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria) 
VALUES ("Pin Cyberpunk", "Pin esmatlado metalico con diseño de Cyberpunk", "40.00", "10", "Videojuegos");

UPDATE usuarios SET password = "$2a$12$C5E3O4yfVEPbkFGgYF2EbuEq4ZjZhnYi6Rw8JjJH//Y2XBw8xbMlG" WHERE username = "dueno";

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('En proceso', 'Completo', 'Cancelado') DEFAULT 'En proceso',
    subtotal DECIMAL(10,2) NOT NULL,
    envio DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO usuarios (username, password, rol)
VALUES ('Nancy', '$2a$12$C5E3O4yfVEPbkFGgYF2EbuEq4ZjZhnYi6Rw8JjJH//Y2XBw8xbMlG', 'admin');