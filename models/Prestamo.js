const mongoose = require('mongoose');

const PrestamoSchema = new mongoose.Schema({
    libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fechaPrestamo: Date,
    fechaDevolucion: Date
});

module.exports = mongoose.model('Prestamo', PrestamoSchema);