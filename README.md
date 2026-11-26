<div align="center">

<img src="img/logo.png" alt="Logo GEA — Gestión Estudiantil Avanzada" width="180" />

# GEA — Gestión Estudiantil Avanzada

Plataforma web diseñada para centralizar y modernizar la gestión académica, disciplinaria y administrativa de instituciones educativas.

![Versión](https://img.shields.io/badge/Versión-Beta%202026-2ca58d?style=for-the-badge)
![SENA](https://img.shields.io/badge/SENA-ADSO%20Ficha%203293992-16324f?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_(Proyectado)-316192?style=for-the-badge&logo=postgresql&logoColor=white)

[🌐 Ver demo en GitHub Pages](https://estebanvillarreal-debug.github.io/Gea/)

</div>

---

## 🏫 Institución aliada

Actualmente, **GEA** está orientado al **Colegio Nacional Ismael Perdomo Borrero** (Gigante, Huila), con una arquitectura pensada para escalar posteriormente a otras escuelas, colegios e instituciones educativas.

## 🎯 Misión y Visión

| Misión | Visión |
| :--- | :--- |
| Brindar una plataforma eficiente que facilite la gestión académica y administrativa, mejorando la organización y el acceso a la información institucional. | Ser un sistema de referencia en gestión educativa, reconocido por su innovación, seguridad, trazabilidad y facilidad de uso. |

---

## 📚 Módulos de la plataforma

### 🏠 Landing e Inicio de Sesión
- Página informativa institucional con identidad visual propia, carrusel de aliados y mapa integrado.
- Inicio de sesión con validación de campos y gestión de sesión en navegador.

### 📢 Noticias y Comunicados
- Visualización de comunicados institucionales con filtros por visibilidad (**General**, **Pública**, **Privada**) y buscador en tiempo real.

### 📋 Registro de Movimientos
- Seguimiento de entradas y salidas de estudiantes con vista por **Día**, **Semana** o **Mes**, filtros por grado y estado actual dentro de la institución.

### 📄 Reportes y Asistencia
- Gestión de estudiantes (documento de identidad, código de escaneo, acudiente y formación técnica en grados 10° y 11°).
- Registro de reportes disciplinarios/académicos por estudiante.
- Control de asistencia semanal (lunes a viernes) con cálculo automático de inasistencias.

### 👨‍🏫 Gestión Docente
- Directorio de docentes con filtros por grado, materia y rango, registro de nuevos docentes y cambio de rango administrativo.

### 📅 Calendario Institucional
- Agenda mensual interactiva con soporte para **eventos de varios días**.
- Clasificación por tipo con código de color: **Académico**, **Festivo**, **Reunión** y **Evaluación**.
- Buscador por título, lugar, invitados o descripción y validación de rango horario.

### 👤 Perfil
- Personalización de nombre y fotografía de perfil con recorte automático y persistencia local.

---

## 🛠️ Tecnologías

- **Frontend actual:** HTML5, Tailwind CSS (`3.4.17` vía CDN), JavaScript Vanilla modular (IIFE + `localStorage` / `sessionStorage`).
- **Tipografía e íconos:** Google Fonts (*Poppins* e *Inter*), Font Awesome 6.5.1 y mapa integrado de Google Maps.
- **Arquitectura proyectada (Backend):** Node.js + PostgreSQL (modelo relacional normalizado de 15 tablas).

---

## 📁 Estructura del proyecto

```text
GEA/
├── admin/
├── docente/
├── img/
├── js/
├── index.html
├── login.html
└── README.md
```

---

## ▶️ Ejecución y demo

La versión actual corresponde a una **Beta Frontend (2026)** con almacenamiento local en el navegador (`localStorage`):

1. Abre la versión publicada en GitHub Pages: **https://estebanvillarreal-debug.github.io/Gea/** (o abre `index.html` con Live Server).
2. Haz clic en **Ingresar** para ir a `login.html`.

---

## 👥 Equipo de desarrollo

- **Juan Esteban Villarreal Ramírez** — Desarrollador y jefe — [GitHub](https://github.com/EstebanVillarreal-debug)
- **Samuel Gerardo Chavarro García** — Desarrollador y co-jefe — [GitHub](https://github.com/sgchavarro)
- **Héctor David Toledo** — Instructor y Acompañamiento SENA — [GitHub](https://github.com/hdtoledo)

---

<div align="center">

**Contacto:** [gea@gmail.com](mailto:gea@gmail.com)

**GEA — Gestión Estudiantil Avanzada** © 2026

</div>
