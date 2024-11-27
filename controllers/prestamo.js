const mongoose = require('mongoose');
const Prestamo = require('../models/Prestamo');
const Usuario = require('../models/Usuario'); // Importar el modelo Usuario
const Libro = require('../models/Libro');

const obtenerPrestamos = async (req, res) => {
    try {
        const prestamos = await Prestamo.find().populate('usuario').populate('libros');
        const prestamosActualizados = prestamos.map(prestamo => {
        if (new Date(prestamo.fechaDevolucion) < new Date() && prestamo.estado === 'registrado') {
            prestamo.estado = 'vencido';
        }
        return prestamo;
        });

        res.status(200).json(prestamosActualizados);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los préstamos', error: error.message });
    }
    };

const obtenerPrestamo = async (req, res) => {
    try {
        const prestamos = await Prestamo.find().populate('usuario').populate('libros');
        res.status(200).json({ solicitudes: prestamos });
        } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los préstamos', error: error.message });
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

        if (!usuarioId || !libros || !tipo ) {
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
        const { id } = req.params;
        const { estado, rut } = req.body;
    
        const prestamo = await Prestamo.findById(id).populate('usuario');
        if (!prestamo) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }
    
        if (prestamo.usuario.rut !== rut) {
            console.log("el rut es: ", prestamo.usuario.rut, "el rut que llega es: ", rut);
            return res.status(400).json({ mensaje: 'RUT incorrecto' });
        }
    
        prestamo.estado = estado;
        await prestamo.save();
    
        res.status(200).json({ mensaje: 'Préstamo actualizado correctamente' });
        } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el préstamo', error: error.message });
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


const devolverLibro = async (req, res) => {
    try {
        const { isbn } = req.body;
    
        const libro = await Libro.findOne({ isbn });
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
    
        const prestamo = await Prestamo.findOne({ libros: libro._id });
        if (!prestamo) {
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }
    
        const usuario = await Usuario.findById(prestamo.usuario);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    
        // Verificar si la devolución es atrasada
        const fechaActual = new Date();
        if (fechaActual > prestamo.fechaDevolucion) {
            // Crear sanción automática
            usuario.sanciones.push({
            fecha: fechaActual,
            motivo: 'Devolución atrasada',
            duracion: 7 // Duración de la sanción en días
            });
            await usuario.save();
        }
    
        // Eliminar el libro del préstamo
        prestamo.libros.pull(libro._id);
        await prestamo.save();
    
        // Actualizar el estado del libro a disponible
        libro.disponible = true;
        await libro.save();
    
        // Eliminar el préstamo si no quedan libros
        if (prestamo.libros.length === 0) {
            await Prestamo.findByIdAndDelete(prestamo._id);
        }
    
        res.status(200).json({ mensaje: 'Libro devuelto correctamente' });
        } catch (error) {
        res.status(500).json({ mensaje: 'Error al devolver el libro', error: error.message });
        }
    };

module.exports = {
    obtenerPrestamos,
    obtenerPrestamo,
    obtenerSolicitudPorId,
    crearPrestamo,
    actualizarPrestamo,
    eliminarPrestamo,
    devolverLibro
};