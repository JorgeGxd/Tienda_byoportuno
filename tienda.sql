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
