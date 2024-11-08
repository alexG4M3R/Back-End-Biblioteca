const mongoose = require('mongoose');
const Reserva = require('../models/Reserva');
const Libro = require('../models/Libro');

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().populate('libro').populate('usuario');
        res.status(200).json({
            status: "éxito",
            reservas
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener las reservas",
            error: error.message
        });
    }
};

const crearReserva = async (req, res) => {
    try {
        const { libro, usuario, fechaReserva, fechaExpiracion } = req.body;

        if (!libro || !usuario || !fechaReserva || !fechaExpiracion) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        const nuevaReserva = new Reserva({
            libro,
            usuario,
            fechaReserva,
            fechaExpiracion
        });

        const reservaGuardada = await nuevaReserva.save();

        await Libro.findByIdAndUpdate(libro, { disponible: false });

        return res.status(200).json({
            status: "éxito",
            reserva: reservaGuardada,
            mensaje: "Reserva creada correctamente!!"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar la reserva",
            error: error.message
        });
    }
};

const actualizarReserva = async (req, res) => {
    try {
        const reservaId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(reservaId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de reserva no válido"
            });
        }

        const reservaActualizada = await Reserva.findByIdAndUpdate(reservaId, req.body, { new: true });

        if (!reservaActualizada) {
            return res.status(404).json({
                status: "error",
                mensaje: "Reserva no encontrada"
            });
        }

        return res.status(200).json({
            status: "éxito",
            reserva: reservaActualizada,
            mensaje: "Reserva actualizada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar la reserva",
            error: error.message
        });
    }
};

const eliminarReserva = async (req, res) => {
    try {
        const reservaId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(reservaId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de reserva no válido"
            });
        }

        const reserva = await Reserva.findById(reservaId);
        if (!reserva) {
            return res.status(404).json({
                status: "error",
                mensaje: "Reserva no encontrada"
            });
        }

        await Reserva.findByIdAndDelete(reservaId);

        await Libro.findByIdAndUpdate(reserva.libro, { disponible: true });

        return res.status(200).json({
            status: "éxito",
            mensaje: "Reserva eliminada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar la reserva",
            error: error.message
        });
    }
};

module.exports = {
    obtenerReservas,
    crearReserva,
    actualizarReserva,
    eliminarReserva
};