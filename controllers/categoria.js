const Categoria = require('../models/Categoria');
const mongoose = require('mongoose');

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json({
            status: "éxito",
            categorias
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: "Error al obtener las categorías",
            error: error.message
        });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const categorias = Array.isArray(req.body) ? req.body : [req.body];

        const categoriasGuardadas = [];

        for (const categoria of categorias) {
            const { nombre, descripcion } = categoria;

            if (!nombre || !descripcion) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "Faltan datos por enviar en una o más categorías"
                });
            }

            const nuevaCategoria = new Categoria({ nombre, descripcion });
            const categoriaGuardada = await nuevaCategoria.save();
            categoriasGuardadas.push(categoriaGuardada);
        }

        return res.status(200).json({
            status: "éxito",
            categorias: categoriasGuardadas,
            mensaje: "Categorías creadas correctamente!"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al guardar las categorías",
            error: error.message
        });
    }
};


const actualizarCategoria = async (req, res) => {
    try {
        const categoriaId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(categoriaId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de categoría no válido"
            });
        }

        const categoriaActualizada = await Categoria.findByIdAndUpdate(categoriaId, req.body, { new: true });

        if (!categoriaActualizada) {
            return res.status(404).json({
                status: "error",
                mensaje: "Categoría no encontrada"
            });
        }

        return res.status(200).json({
            status: "éxito",
            categoria: categoriaActualizada,
            mensaje: "Categoría actualizada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar la categoría",
            error: error.message
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const categoriaId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(categoriaId)) {
            return res.status(400).json({
                status: "error",
                mensaje: "ID de categoría no válido"
            });
        }

        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            return res.status(404).json({
                status: "error",
                mensaje: "Categoría no encontrada"
            });
        }

        await Categoria.findByIdAndDelete(categoriaId);

        return res.status(200).json({
            status: "éxito",
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar la categoría",
            error: error.message
        });
    }
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};