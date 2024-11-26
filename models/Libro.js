const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    age: Number,
    isbn: String,
    disponible: Boolean,
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo' }]
}, { collection: 'libros' });


module.exports = mongoose.model('Libro', LibroSchema);