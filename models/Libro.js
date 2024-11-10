const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    age: Number,
    isbn: String,
    disponible: Boolean,
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }
});

module.exports = mongoose.model('Libro', LibroSchema);