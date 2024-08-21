const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const ArticuloControlador = require('../controladores/Articulo');

// Configurar el almacenamiento de Multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos/'); // Carpeta donde se almacenarán las imágenes
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`); // Nombre único para cada archivo
    }
});


// Filtrar los archivos por tipo de imagen
const fileFilter = (req, file, cb) => {
    // Aceptar solo archivos con las extensiones: .jpeg, .jpg, .png, .gif
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
};

// Crear el middleware de Multer
const subidas = multer({ storage: almacenamiento, fileFilter: fileFilter});



//rutas util
router.post('/crear', ArticuloControlador.crear), //crear articulos
router.get('/articulos', ArticuloControlador.listar), //mostrar todos los articulos
router.get('/articulo/:id', ArticuloControlador.uno), //mostrar un articulo por id
router.delete('/articulo/:id', ArticuloControlador.borrar), //borrar un articulo por id
router.put('/articulo/:id', ArticuloControlador.editar), //borrar un actualizar por id
router.post('/subir-imagen/:id', [subidas.single("file0")], ArticuloControlador.subir),
router.get('/imagen/:fichero', ArticuloControlador.imagen),
router.get('/buscar/:busqueda', ArticuloControlador.buscar);










module.exports = router;