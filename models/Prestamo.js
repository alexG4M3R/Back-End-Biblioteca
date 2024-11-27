const mongoose = require('mongoose');

const PrestamoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  libros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }],
  fechaPrestamo: { type: Date, default: Date.now },
  fechaDevolucion: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) },
  tipo: { type: String, enum: ['domicilio', 'sala'], required: true },
  estado: { type: String, enum: ['pendiente', 'registrado', 'vencido'], default: 'pendiente' },
  rut: { type: String}
}, { collection: 'prestamos' });

module.exports = mongoose.model('Prestamo', PrestamoSchema);