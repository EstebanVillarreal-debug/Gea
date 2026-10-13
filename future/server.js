require('dotenv').config(); //carga la coneccion desde el archivo .env
const express = require('express'); //framework que facilita la creación del servidor y las rutas HTTP
const cors = require('cors'); //middleware que permite que el frontend para que sea amigo del backend
const mysql = require('mysql2/promise'); //libreria de base de datos mysql

//garantizan que todas las particiones tengan habilitado elacceso de origen, todo en json
const app = express(); //nueva instancia de expres, app ayuda a defirnir las rutas
app.use(cors()); //acepta el http (habilita el Compartimiento de Recursos entre Orígenes Distintos)
app.use(express.json()); //convierte el texto enviado por el cliente en un objeto

// Pool de conexión a la base 
const pool = mysql.createPool({ // "pool" de múltiples conexiones reutilizables y para no estar abriendo y cerrando.
    host: process.env.DB_HOST, //process.env permite extraer credenciales desde el archivo
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Endpoint (url) 1: (insertar/agregar) Inicio de sesión envia los datos a la base de datos para validdarlos 
app.post('/api/login', async (req, res) => { //post es más privado que el get
    const { correo, contrasena } = req.body; //rep pide lo que haya escrito en el body

    console.log("Petición de login recibida:", { correo, contrasena }); //muestra si funciona

    if (!correo || !contrasena) {
        return res.status(400).json({ exito: false, error: 'Faltan credenciales' }); //statuss(401) faltan credensiales, mal requrimiento
    }

    try { //intenta ejecutar instrucciones como si fuera un if yy un else
        const [filas] = await pool.query( // consulta el SQL
            'SELECT * FROM docentes WHERE correo = ? AND `contraseña` = ?',  // evita vulnerabidades (?), lo cual protege el sistema contra inyecciones SQL.
            [correo, contrasena]
        );

        console.log("Filas encontradas en DB:", filas); //muestra quien entró

        if (filas.length > 0) { //length segun el resultado si lass encontro en las filas
            res.status(200).json({ exito: true, usuario: filas[0] }); //estatus(200) todo bien con los taods
        } else {
            res.status(401).json({ exito: false, error: 'Correo o contraseña incorrectos' }); // si no status(401) error
        }
    } catch (error) { // si no sale bien el try se salta al catch
        console.error("❌ Error en SQL:", error); //muestra que pasó
        res.status(500).json({ exito: false, error: 'Error en el servidor' }); //estatuss(500) error del servidor
    }
});

// Endpoint 2: GET: consultar o leer todos los datos de los docentes (el get hace que se vean los datos en la URL)
app.get('/api/docentes', async (req, res) => { //el req está más gris porque sigue pidiendo
    try { //  evalúa una lista en orden y devuelve el primer valor que no sea nulo
        const [filas] = await pool.query(`
            SELECT 
                d.id_docente, d.nombre, d.apellido, d.materia, 
                d.grado_encargado, d.contacto, d.correo,
                COALESCE(r.nombre_rango, 'Docente') AS rango,
                GROUP_CONCAT(
                    CASE WHEN i.tipo = 'excusa' THEN i.descripcion END 
                    SEPARATOR '||'
                ) AS lista_excusas,
                SUM(CASE WHEN i.tipo = 'excusa' THEN 1 ELSE 0 END) AS num_excusas,
                SUM(CASE WHEN i.tipo = 'reporte' THEN 1 ELSE 0 END) AS num_reportes
            FROM docentes d
            LEFT JOIN rangos r ON d.id_rango = r.id_rango
            LEFT JOIN infoextra i ON i.id_docente = d.id_docente 
            GROUP BY d.id_docente
        `); //El uso de LEFT JOIN garantiza que si un docente no tiene un rango asignado o no posee registros en infoextra
        res.json({ exito: true, docentes: filas }); // muestra si hay
    } catch (error) {
        console.error("❌ Error consultando docentes:", error);
        res.status(500).json({ exito: false, error: 'Error consultando docentes' }); //muestra si no pudo procesar la solicitud
    }
});

// Endpoint 3: POST: crear (insertar/agregar) un docente
app.post('/api/docentes', async (req, res) => {
    const { nombre, apellido, materia, grado_encargado, contacto, rango, correo, contrasena } = req.body;

    if (!nombre || !apellido || !materia || !contacto || !correo || !contrasena) {
        return res.status(400).json({ exito: false, error: 'Faltan datos obligatorios' }); //400 error del usuario
    }

    try {
        const [filasRango] = await pool.query( // primero se busca el id numérico del nombre del rango recibido (la tabla docentes guarda el id mas no el texto)
            'SELECT id_rango FROM rangos WHERE nombre_rango = ?',
            [rango]
        );
        const idRango = filasRango.length ? filasRango[0].id_rango : 1; // es un operador ternario referencia al unique, 1 = Docente por defecto

        await pool.query(
            `INSERT INTO docentes (nombre, apellido, materia, grado_encargado, contacto, id_rango, correo, \`contraseña\`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, // parámetros preparados, (?) para evitar inyección SQL
            [nombre, apellido, materia, grado_encargado, contacto, idRango, correo, contrasena]
        );
        res.status(201).json({ exito: true, mensaje: 'Docente agregado correctamente' }); //200 todo bien
    } catch (error) {
        console.error("❌ Error insertando docente en SQL:", error);
        res.status(500).json({ exito: false, error: 'Error insertando docente' });
    }
});

// Endpoint 4: PUT: actualizar (remplazar) el rango de un docente (recibe el id del rango resuelve el id internamente)
app.put('/api/docentes/:id/rango', async (req, res) => {
    const { id } = req.params; // ":id" en la ruta es un parámetro dinámico; req.params lo coge (/api/docentes/5/rango → id = "5")
    const { rango } = req.body; // el nuevo rango viene en el body

    if (!rango) {
        return res.status(400).json({ exito: false, error: 'El rango es obligatorio.' }); // 400 error del usuario
    }
    try {
        const [filasRango] = await pool.query( //mira si existe tal rango
            'SELECT id_rango FROM rangos WHERE nombre_rango = ?',
            [rango]
        );
        if (!filasRango.length) {
            return res.status(400).json({ exito: false, error: 'Rango no válido' }); //400 error del usuario
        }
        const idRango = filasRango[0].id_rango;
        const [resultado] = await pool.query( //actualiza como el id_rango y el nombre para mantenerlos sincronizados
            'UPDATE docentes SET id_rango = ? WHERE id_docente = ?', 
            [idRango, id]
        );
        if (resultado.affectedRows === 0) { // affectedRows indica cuántas filas modificó lo de arriba, si es 0 entoncces error
            return res.status(404).json({ exito: false, error: 'Docente no encontrado' }); // 400 error del usuario
        }
        res.json({ exito: true, mensaje: 'Rango actualizado correctamente' });
    } catch (error) {
        console.error("❌ Error al actualizar rango:", error);
        res.status(500).json({ exito: false, error: 'Error al actualizar en la base de datos' }); //500 error del servidor
    }
});

// Inicio del servidor
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor GEA escuchando en el puerto ${PUERTO}`);
});
