const express = require('express');
const { conexion } = require('./basedatos/conexion');

const app = express();
const port = 3001;

conexion();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rutas = require('./rutas/rutas');
app.use('/api', rutas);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});