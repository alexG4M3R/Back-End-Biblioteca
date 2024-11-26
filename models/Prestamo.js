const mongoose = require('mongoose');

const PrestamoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    libros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }],
    fechaPrestamo: { type: Date, default: Date.now }, // Fecha de préstamo predeterminada a la fecha actual
    fechaDevolucion: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) }, // Fecha de devolución predeterminada a una semana después
    tipo: { type: String, enum: ['domicilio', 'sala'], required: true }, // Tipo de préstamo
    estado: { type: String, enum: ['pendiente', 'registrado'], default: 'pendiente' },
    rut: { type: String, required: true } // RUT del usuario
}, { collection: 'prestamos' });

module.exports = mongoose.model('Prestamo', PrestamoSchema);