const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const obtenerUsuarioPorRut = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ rut: req.params.rut });
        if (!usuario) {
            return res.status(404).json({
                status: "error",
                mensaje: "Usuario no encontrado"
            });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener el usuario",
            error: error.message
        });
    }
};


const crearUsuario = async (req, res) => {
  try {
    const { nombre, rut, email, password, rol } = req.body;

    if (!nombre || !rut || !email || !password || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const usuarioExistente = await Usuario.findOne({ rut });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El RUT ya está registrado' });
    }

    const correoExistente = await Usuario.findOne({ email });
    if (correoExistente) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const nuevoUsuario = new Usuario({ nombre, rut, email, password, rol });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el usuario', error: error.message });
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

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        if (password !== usuario.password) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, 'secreto', { expiresIn: '1h' });

        res.json({ token, id: usuario._id, rol: usuario.rol });
        console.log("el usuario id es: ", usuario._id, "el rol es: ", usuario.rol);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorRut,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    login
};