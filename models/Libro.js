const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    age: Number,
    isbn: String,
    disponible: Boolean
});

module.exports = mongoose.model('Libro', LibroSchema);