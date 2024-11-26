const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    libros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }],
    fechaReserva: { type: Date, default: Date.now }, // Fecha y hora de reserva predeterminada a la fecha y hora actual
    fechaFinReserva: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) }, // Fecha y hora de fin de reserva predeterminada a una semana después
    estado: { type: String, enum: ['pendiente', 'registrado'], default: 'pendiente' }
}, { collection: 'reservas' });

module.exports = mongoose.model('Reserva', ReservaSchema);