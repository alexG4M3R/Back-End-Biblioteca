const mongoose = require('mongoose');
const Prestamo = require('../models/Prestamo');
const Libro = require('../models/Libro');

const obtenerPrestamos = async (req, res) => {
    try {
        const prestamos = await Prestamo.find().populate('libro').populate('usuario');
        res.status(200).json({
            status: "éxito",
            prestamos
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener los préstamos",
            error: error.message
        });
    }
};

const crearPrestamo = async (req, res) => {
    try {
        const { libro, usuario, fechaPrestamo, fechaDevolucion } = req.body;

        if (!libro || !usuario || !fechaPrestamo || !fechaDevolucion) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        const libroEncontrado = await Libro.findById(libro);
        if (!libroEncontrado) {
            return res.status(404).json({
                status: "error",
                mensaje: "Libro no encontrado"
            });
        }
        if (!libroEncontrado.disponible) {
            return res.status(400).json({
                status: "error",
                mensaje: "El libro no está disponible para préstamo"
            });
        }

        const nuevoPrestamo = new Prestamo({
            libro,
            usuario,
            fechaPrestamo,
            fechaDevolucion
        });

        const prestamoGuardado = await nuevoPrestamo.save();

        await Libro.findByIdAndUpdate(libro, { disponible: false });

        return res.status(200).json({
            status: "éxito",
            prestamo: prestamoGuardado,
            mensaje: "Préstamo creado correctamente!!"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar el préstamo",
            error: error.message
        });
    }
};

const actualizarPrestamo = async (req, res) => {
    try {
        const prestamoId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(prestamoId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de préstamo no válido"
            });
        }

        const prestamoActualizado = await Prestamo.findByIdAndUpdate(prestamoId, req.body, { new: true });

        if (!prestamoActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "Préstamo no encontrado"
            });
        }

        return res.status(200).json({
            status: "éxito",
            prestamo: prestamoActualizado,
            mensaje: "Préstamo actualizado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el préstamo",
            error: error.message
        });
    }
};

const eliminarPrestamo = async (req, res) => {
    try {
        const prestamoId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(prestamoId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de préstamo no válido"
            });
        }

        const prestamo = await Prestamo.findById(prestamoId);
        if (!prestamo) {
            return res.status(404).json({
                status: "error",
                mensaje: "Préstamo no encontrado"
            });
        }

        await Prestamo.findByIdAndDelete(prestamoId);

        await Libro.findByIdAndUpdate(prestamo.libro, { disponible: true });

        return res.status(200).json({
            status: "éxito",
            mensaje: "Préstamo eliminado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar el préstamo",
            error: error.message
        });
    }
};

module.exports = {
    obtenerPrestamos,
    crearPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
};