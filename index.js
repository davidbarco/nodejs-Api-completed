const {conexion} = require('./basedatos/conexion');
const express = require('express');
const cors = require('cors');

conexion();

const app = express();
const port = 3900;

app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas
const rutas_articulo = require("./rutas/articulo");

//cargo las rutas
app.use("/api", rutas_articulo);



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
  });

