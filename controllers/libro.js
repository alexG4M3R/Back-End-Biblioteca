const Libro = require('../models/Libro');
const mongoose = require('mongoose');

const agregarLibro = async (req, res) => {
    try {
      const { titulo, autor, edicion, age, isbn, categoria } = req.body;
  
      if (!titulo || !autor || !edicion || !age || !isbn || !categoria) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
      }
  
      const libroExistente = await Libro.findOne({ isbn });
      if (libroExistente) {
        return res.status(400).json({ mensaje: 'El ISBN ya existe en el catálogo' });
      }
  
      const nuevoLibro = new Libro({ titulo, autor, edicion, age, isbn, categoria });
      await nuevoLibro.save();
  
      res.status(201).json({ mensaje: 'Documento agregado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al agregar el documento', error: error.message });
    }
  };
  
const obtenerLibroPorIsbn = async (req, res) => {
    try {
      const { isbn } = req.params;
      const libro = await Libro.findOne({ isbn });
      if (!libro) {
        return res.status(404).json({ mensaje: 'Libro no encontrado1' });
      }
      res.status(200).json(libro);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el libro', error: error.message });
    }
};
  
const eliminarLibro = async (req, res) => {
    try {
      const { isbn } = req.params;
      const libro = await Libro.findOneAndDelete({ isbn });
      if (!libro) {
        return res.status(404).json({ mensaje: 'Libro no encontrado2' });
      }
      res.status(200).json({ mensaje: 'Documento eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar el documento', error: error.message });
    }
};











const obtenerLibros = async (req, res) => {
    try {
        const { titulo, autor } = req.query;
        const query = { disponible: true };

        if (titulo) {
            query.titulo = { $regex: titulo, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }
        if (autor) {
            query.autor = { $regex: autor, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }

        const libros = await Libro.find(query);
        res.status(200).json(libros);
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
        const { titulo, autor, age, isbn } = req.body;

        if (!titulo || !autor || !age || !isbn  === undefined) {
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

const eliminar = async (req, res) => {
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
    agregarLibro,
    obtenerLibroPorIsbn,
    obtenerLibros,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    eliminar
};