const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json({
            status: "éxito",
            usuarios
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, rut, telefono, password, rol, direccion } = req.body;

        if (!nombre || !email || !rut || !telefono || !password || !rol || !direccion) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({
                status: "error",
                mensaje: "El email ya está registrado"
            });
        }

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            rut,
            telefono,
            password,
            rol,
            direccion
        });

        const usuarioGuardado = await nuevoUsuario.save();

        return res.status(200).json({
            status: "éxito",
            usuario: usuarioGuardado,
            mensaje: "Usuario creado correctamente!!"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar el usuario",
            error: error.message
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de usuario no válido"
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, req.body, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            status: "éxito",
            usuario: usuarioActualizado,
            mensaje: "Usuario actualizado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({
                status: "error",
                mensaje: "Usuario no encontrado"
            });
        }

        await Usuario.findByIdAndDelete(usuarioId);

        return res.status(200).json({
            status: "éxito",
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar el usuario",
            error: error.message
        });
    }
};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};