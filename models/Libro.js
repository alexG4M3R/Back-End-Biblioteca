const mongoose = require('mongoose');

const categorias = [
    'Ficción',
    'No Ficción',
    'Ciencia',
    'Historia',
    'Biografía',
    'Fantasía',
    'Misterio',
    'Romance',
    'Terror',
    'Aventura',
    'Infantil',
    'Educativo',
    'Autoayuda',
    'Salud',
    'Tecnología'
];

const LibroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    age: Number,
    isbn: {type: String, unique: true},
    disponible: { type: Boolean, default: true },
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo' }],
    categoria: { type: String, enum: categorias, required: true }
}, { collection: 'libros' });

module.exports = mongoose.model('Libro', LibroSchema);