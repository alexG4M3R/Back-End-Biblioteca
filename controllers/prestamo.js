const mongoose = require('mongoose');
const Prestamo = require('../models/Prestamo');
const Usuario = require('../models/Usuario'); // Importar el modelo Usuario
const Libro = require('../models/Libro');

const obtenerPrestamos = async (req, res) => {
    try {
        const solicitudes = await Prestamo.find({ estado: 'pendiente' }).populate('usuario').populate('libros');
        res.status(200).json({
            status: "éxito",
            solicitudes
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener las solicitudes pendientes",
            error: error.message
        });
    }
};



const obtenerSolicitudPorId = async (req, res) => {
    try {
        const solicitud = await Prestamo.findById(req.params.id).populate('usuario').populate('libros');
        if (!solicitud) {
            return res.status(404).json({
                status: "error",
                mensaje: "Solicitud no encontrada"
            });
        }
        res.status(200).json(solicitud);
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener la solicitud",
            error: error.message
        });
    }
};

const crearPrestamo = async (req, res) => {
    try {
        const { usuarioId, libros, tipo } = req.body;

        if (!usuarioId || !libros || !tipo) {
            console.log("el usuario es: ", usuarioId, "los libros son:",libros, "el tipo es: ",tipo);
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(400).json({
                status: "error",
                mensaje: "Usuario no encontrado"
            });
        }

        const nuevaSolicitud = new Prestamo({
            usuario: usuarioId,
            libros,
            fechaPrestamo: new Date(), // Fecha de préstamo predeterminada a la fecha actual
            fechaDevolucion: new Date(Date.now() + 7*24*60*60*1000), // Fecha de devolución predeterminada a una semana después
            tipo
        });

        const solicitudGuardada = await nuevaSolicitud.save();

        await Usuario.findByIdAndUpdate(usuarioId, { $push: { prestamos: solicitudGuardada._id } });
        await Promise.all(libros.map(async (libroId) => {
            await Libro.findByIdAndUpdate(libroId, { $push: { prestamos: solicitudGuardada._id }, disponible: false });
        }));

        return res.status(200).json({
            status: "éxito",
            solicitud: solicitudGuardada,
            mensaje: "Solicitud creada correctamente!!"
        });

    } catch (error) {
        console.error('Error al crear la solicitud:', error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al crear la solicitud",
            error: error.message
        });
    }
};

const actualizarPrestamo = async (req, res) => {
    try {
        const solicitud = await Prestamo.findByIdAndUpdate(req.params.id, { estado: 'registrado' }, { new: true });
        if (!solicitud) {
            return res.status(404).json({
                status: "error",
                mensaje: "Solicitud no encontrada"
            });
        }
        res.status(200).json({
            status: "éxito",
            solicitud,
            mensaje: "Estado de la solicitud actualizado a registrado"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el estado de la solicitud",
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
    obtenerSolicitudPorId,
    crearPrestamo,
    actualizarPrestamo,
    eliminarPrestamo
};