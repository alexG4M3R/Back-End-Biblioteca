const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    rut: String,
    telefono: String,
    password: String,
    rol: String,
    direccion: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema);