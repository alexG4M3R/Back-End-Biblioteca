const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
    libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaReserva: { type: Date, default: Date.now },
    fechaExpiracion: Date
});

module.exports = mongoose.model('Reserva', ReservaSchema);