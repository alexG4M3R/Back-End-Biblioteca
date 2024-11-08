const mongoose = require('mongoose');
const Sancion = require('../models/Sancion');

const obtenerSanciones = async (req, res) => {
    try {
        const sanciones = await Sancion.find().populate('usuario');
        res.status(200).json({
            status: "éxito",
            sanciones
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener las sanciones",
            error: error.message
        });
    }
};

const crearSancion = async (req, res) => {
    try {
        const { usuario, descripcion, fecha, monto } = req.body;

        if (!usuario || !descripcion || !fecha || !monto) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        const nuevaSancion = new Sancion({
            usuario,
            descripcion,
            fecha,
            monto
        });

        const sancionGuardada = await nuevaSancion.save();

        return res.status(200).json({
            status: "éxito",
            sancion: sancionGuardada,
            mensaje: "Sanción creada correctamente!!"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar la sanción",
            error: error.message
        });
    }
};

const actualizarSancion = async (req, res) => {
    try {
        const sancionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(sancionId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de sanción no válido"
            });
        }

        const sancionActualizada = await Sancion.findByIdAndUpdate(sancionId, req.body, { new: true });

        if (!sancionActualizada) {
            return res.status(404).json({
                status: "error",
                mensaje: "Sanción no encontrada"
            });
        }

        return res.status(200).json({
            status: "éxito",
            sancion: sancionActualizada,
            mensaje: "Sanción actualizada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar la sanción",
            error: error.message
        });
    }
};

const eliminarSancion = async (req, res) => {
    try {
        const sancionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(sancionId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de sanción no válido"
            });
        }

        const sancion = await Sancion.findById(sancionId);
        if (!sancion) {
            return res.status(404).json({
                status: "error",
                mensaje: "Sanción no encontrada"
            });
        }

        await Sancion.findByIdAndDelete(sancionId);

        return res.status(200).json({
            status: "éxito",
            mensaje: "Sanción eliminada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar la sanción",
            error: error.message
        });
    }
};

module.exports = {
    obtenerSanciones,
    crearSancion,
    actualizarSancion,
    eliminarSancion
};