const validator = require('validator');
const Articulo = require('../modelos/Articulo');
const fs = require('fs');
const path = require('path');



const crear = async (req, res) => {
    const { titulo, contenido } = req.body;

    // Validar datos
    if (!titulo || !contenido || validator.isEmpty(titulo) || validator.isEmpty(contenido)) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    try {
        // Crear y guardar el objeto en la base de datos
        const articulo = new Articulo({ titulo, contenido });
        const articuloGuardado = await articulo.save();

        return res.status(200).json({
            status: 'success',
            Articulo: articuloGuardado,
            mensaje: 'Artículo creado con éxito'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'No se ha guardado el artículo: ' + error.message
        });
    }
};

const listar = async (req, res) => {
    try {
        const articulos = await Articulo.find({}).sort({fecha: -1});

        if (articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            articulos
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al listar los artículos",
            error: error.message
        });
    }
};

const uno = async (req, res) => {
    try {

        let id = req.params.id;
        const articulo = await Articulo.findById(id);

        if (articulo.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículo"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo
        });
       
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al listar el  artículo",
            error: error.message
        });
    }
};

const borrar = async (req, res) => {
    try {
        let id = req.params.id;
        const articuloBorrado = await Articulo.findByIdAndDelete(id);

        if (!articuloBorrado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo para eliminar"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Artículo eliminado con éxito",
            articulo: articuloBorrado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al intentar eliminar el artículo",
            error: error.message
        });
    }
};

const editar = async (req, res) => {
    try {
        let id = req.params.id;
        let datosActualizados = req.body;

        // Validar los datos antes de actualizar (opcional)
        if (!datosActualizados.titulo || !datosActualizados.contenido || 
            validator.isEmpty(datosActualizados.titulo) || validator.isEmpty(datosActualizados.contenido)) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar o los datos no son válidos"
            });
        }

        // Encontrar el artículo por ID y actualizarlo
        const articuloActualizado = await Articulo.findByIdAndUpdate(id, datosActualizados, {
            new: true,  // Devuelve el documento actualizado
            runValidators: true // Ejecuta las validaciones definidas en el esquema
        });

        if (!articuloActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo para actualizar"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Artículo actualizado con éxito",
            articulo: articuloActualizado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al intentar actualizar el artículo",
            error: error.message
        });
    }
};

const subir = async (req, res) => {
    try {
        let id = req.params.id;
        let datosActualizados = req.body;

       
        // Comprobar si se ha subido un archivo
        let imagen = req.file ? req.file.filename : null;
        if (imagen) {
            datosActualizados.imagen = imagen;
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "no hay file0"
            });
        }

        // Encontrar el artículo por ID y actualizarlo
        const articuloActualizado = await Articulo.findByIdAndUpdate(id, datosActualizados, {
            new: true,  // Devuelve el documento actualizado
            runValidators: true // Ejecuta las validaciones definidas en el esquema
        });

        if (!articuloActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo para actualizar"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Artículo actualizado con éxito",
            articulo: articuloActualizado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al intentar actualizar el artículo",
            error: error.message
        });
    }
};

const imagen = async (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica,(error, existe) =>{
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "la imagen no existe",
                existe,
                fichero,
                ruta_fisica
            });
        }
    })

}

const buscar = async (req, res) => {
    try {
        const termino = req.params.busqueda;

        if (!termino || termino.trim() === '') {
            return res.status(400).json({
                status: "error",
                mensaje: "Debe proporcionar un término de búsqueda"
            });
        }

        // Realiza una búsqueda en los campos que deseas (por ejemplo, título o contenido)
        const articulos = await Articulo.find({
            $or: [
                { titulo: { $regex: termino, $options: 'i' } }, // 'i' hace la búsqueda case-insensitive
                { contenido: { $regex: termino, $options: 'i' } }
            ]
        });

        if (articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos que coincidan con la búsqueda"
            });
        }

        return res.status(200).json({
            status: "success",
            articulos
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al buscar los artículos",
            error: error.message
        });
    }
};





module.exports = {
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscar
}