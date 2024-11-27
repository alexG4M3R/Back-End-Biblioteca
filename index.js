const express = require('express');
const { conexion } = require('./basedatos/conexion'); // Importar la función de conexión
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 3001; // Usar el puerto definido en el entorno o 3001 por defecto

conexion(); // Establecer la conexión con MongoDB Atlas

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rutas = require('./rutas/rutas'); // Importar las rutas
app.use('/api', rutas); // Usar las rutas

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});