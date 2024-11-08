const Libro = require('../models/Libro');
const mongoose = require('mongoose');

const obtenerLibros = async (req, res) => {
    try {
        const libros = await Libro.find();
        res.status(200).json({
            status: "éxito",
            libros
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener los libros",
            error: error.message
        });
    }
};

const crearLibro = async (req, res) => {
    try {
        const { titulo, autor, age, isbn, disponible } = req.body;

        if (!titulo || !autor || !age || !isbn || disponible === undefined) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        const nuevoLibro = new Libro({
            titulo,
            autor,
            age,
            isbn,
            disponible
        });

        const libroGuardado = await nuevoLibro.save();

        return res.status(200).json({
            status: "éxito",
            libro: libroGuardado,
            mensaje: "Libro creado correctamente!!"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar el libro",
            error: error.message
        });
    }
};

const actualizarLibro = async (req, res) => {
    try {
        const libroId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(libroId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de libro no válido"
            });
        }

        const libroActualizado = await Libro.findByIdAndUpdate(libroId, req.body, { new: true });

        if (!libroActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "Libro no encontrado"
            });
        }

        return res.status(200).json({
            status: "éxito",
            libro: libroActualizado,
            mensaje: "Libro actualizado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el libro",
            error: error.message
        });
    }
};

const eliminarLibro = async (req, res) => {
    try {
        const libroId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(libroId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de libro no válido"
            });
        }

        const libro = await Libro.findById(libroId);
        if (!libro) {
            return res.status(404).json({
                status: "error",
                mensaje: "Libro no encontrado"
            });
        }

        await Libro.findByIdAndDelete(libroId);

        return res.status(200).json({
            status: "éxito",
            mensaje: "Libro eliminado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar el libro",
            error: error.message
        });
    }
};

module.exports = {
    obtenerLibros,
    crearLibro,
    actualizarLibro,
    eliminarLibro
};