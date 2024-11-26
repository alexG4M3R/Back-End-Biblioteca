const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    user: String,
    email: String,
    rut: String,
    telefono: String,
    password: String,
    rol: { type: String, enum: ['admin', 'bibliotecario', 'usuario'], default: 'usuario' },
    direccion: String,
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo' }]
}, { collection: 'usuarios' });

module.exports = mongoose.model('Usuario', UsuarioSchema);