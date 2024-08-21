
const mongoose = require('mongoose');


const conexion = async (req, res) => {
    try {
        await // Conexión a MongoDB
        mongoose.connect('mongodb://localhost:27017/mi_blog', {
          //useNewUrlParser: true,
          //useUnifiedTopology: true
        })
          console.log('Conectado a MongoDB');
        
    } catch (error) {
        console.error('Error al conectar a MongoDB', error);
        
    }
}

module.exports = {
    conexion
}
