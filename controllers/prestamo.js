const mongoose = require('mongoose');
const Prestamo = require('../models/Prestamo');
const Usuario = require('../models/Usuario');
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
    
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    
        const fechaPrestamo = new Date();
        let fechaDevolucion = new Date();
        if (tipo === 'sala') {
            fechaDevolucion.setHours(fechaDevolucion.getHours() + 2);
        } else {
            fechaDevolucion.setDate(fechaDevolucion.getDate() + 7);
        }
    
        const nuevoPrestamo = new Prestamo({
            usuario: usuarioId,
            libros,
            fechaPrestamo,
            fechaDevolucion,
            tipo,
            estado: 'pendiente'
        });
    
        await nuevoPrestamo.save();
    
        await Libro.updateMany(
            { _id: { $in: libros } },
            { $set: { disponible: false } }
        );
    
        res.status(201).json({ mensaje: 'Préstamo creado correctamente' });
        } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el préstamo', error: error.message });
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
            return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
        }
    
        await Libro.updateMany(
            { _id: { $in: prestamo.libros } },
            { $set: { disponible: true } }
        );
    
        await Prestamo.findByIdAndDelete(prestamoId);
    
        res.status(200).json({ mensaje: 'Préstamo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el préstamo', error: error.message });
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
    
        const fechaActual = new Date();
        if (fechaActual > prestamo.fechaDevolucion) {
            usuario.sanciones.push({
            fecha: fechaActual,
            motivo: 'Devolución atrasada',
            duracion: 7
            });
            await usuario.save();
        }
    
        prestamo.libros.pull(libro._id);
        await prestamo.save();
    
        libro.disponible = true;
        await libro.save();
    
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