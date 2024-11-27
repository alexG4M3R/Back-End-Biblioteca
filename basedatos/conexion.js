const mongoose = require('mongoose');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

const uri = process.env.MONGODB_URI; // Obtener la URI de MongoDB desde las variables de entorno

const conexion = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas', error);
  }
};

module.exports = { conexion };