-- Archivo de inicialización de la base de datos
-- Se ejecuta automáticamente cuando se crea el contenedor de MySQL

USE estudiantes_app;

-- Crear tabla de formularios si no existe
CREATE TABLE IF NOT EXISTS formularios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    materia ENUM('SySO', 'Programación 1', 'Matemática', 'Organización Empresarial') NOT NULL,
    comision VARCHAR(50) NOT NULL,
    tema_elegido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo (opcional)
INSERT INTO formularios (nombre, apellido, materia, comision, tema_elegido) VALUES


-- Mostrar datos insertados
SELECT 'Datos de ejemplo insertados correctamente' AS mensaje;
SELECT COUNT(*) AS total_formularios FROM formularios;