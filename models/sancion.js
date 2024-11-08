const mongoose = require('mongoose');

const SancionSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    descripcion: String,
    fecha: { type: Date, default: Date.now },
    monto: Number
});

module.exports = mongoose.model('Sancion', SancionSchema);