CREATE DATABASE IF NOT EXISTS gea
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gea;

CREATE TABLE IF NOT EXISTS rangos (
  id_rango INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_rango VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_rango),
  UNIQUE KEY uq_rangos_nombre (nombre_rango)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS docentes (
  id_docente INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  materia VARCHAR(100) NOT NULL,
  grado_encargado VARCHAR(30) NULL,
  contacto VARCHAR(40) NOT NULL,
  id_rango INT UNSIGNED NOT NULL DEFAULT 1,
  correo VARCHAR(254) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_docente),
  UNIQUE KEY uq_docentes_correo (correo),
  KEY idx_docentes_rango (id_rango),
  CONSTRAINT fk_docentes_rangos
    FOREIGN KEY (id_rango) REFERENCES rangos (id_rango)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS infoextra (
  id_infoextra INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_docente INT UNSIGNED NOT NULL,
  tipo ENUM('excusa', 'reporte') NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_infoextra),
  KEY idx_infoextra_docente_tipo (id_docente, tipo),
  CONSTRAINT fk_infoextra_docentes
    FOREIGN KEY (id_docente) REFERENCES docentes (id_docente)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO rangos (id_rango, nombre_rango)
VALUES (1, 'Docente'), (2, 'Administrativo');
