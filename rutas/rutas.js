const express = require('express');
const libroController = require('../controllers/libro');
const usuarioController = require('../controllers/usuario');
const prestamoController = require('../controllers/prestamo');
const sancionController = require('../controllers/sancion');
const reservaController = require('../controllers/reserva');
const categoriaController = require('../controllers/categoria');

const router = express.Router();

// Rutas de Libros
router.get('/libros', libroController.obtenerLibros);
// router.post('/libros', libroController.crearLibro);
router.put('/libros/:id', libroController.actualizarLibro);
router.delete('/libros/:isbn', libroController.eliminarLibro);

router.post('/libros', libroController.agregarLibro);
router.get('/libros/:isbn', libroController.obtenerLibroPorIsbn);
router.delete('/libros/:id', libroController.eliminar);

// Rutas de Usuarios
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.get('/usuarios/:rut', usuarioController.obtenerUsuarioPorRut);
router.post('/usuarios', usuarioController.crearUsuario);
router.put('/usuarios/:id', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

// Ruta de Login
router.post('/login', usuarioController.login);

// Rutas de Prestamos
router.get('/prestamos', prestamoController.obtenerPrestamos);
router.get('/prestamosO', prestamoController.obtenerPrestamo);

router.get('/prestamos/:id', prestamoController.obtenerSolicitudPorId);
router.post('/prestamos', prestamoController.crearPrestamo);
router.put('/prestamos/:id', prestamoController.actualizarPrestamo);
router.delete('/prestamos/:id', prestamoController.eliminarPrestamo);

router.post('/devoluciones', prestamoController.devolverLibro);

// Rutas de Sanciones
router.get('/sanciones', sancionController.obtenerSanciones);
router.post('/sanciones', sancionController.crearSancion);
router.put('/sanciones/:id', sancionController.actualizarSancion);
router.delete('/sanciones/:id', sancionController.eliminarSancion);

// Rutas de Reservas
router.get('/reservas', reservaController.obtenerReservas);
router.post('/reservas', reservaController.crearReserva);
router.put('/reservas/:id', reservaController.actualizarReserva);
router.delete('/reservas/:id', reservaController.eliminarReserva);

// Rutas de Categorias
router.get('/categorias', categoriaController.obtenerCategorias);
router.post('/categorias', categoriaController.crearCategoria);
router.put('/categorias/:id', categoriaController.actualizarCategoria);
router.delete('/categorias/:id', categoriaController.eliminarCategoria);


module.exports = router;