const { Router } = require("express");
const { obtenerFeriados } = require("../controllers/holidays");

const router = Router();

// Obtener feriados Argentina (Año)
router.get('/:id', obtenerFeriados)

// Obtener feriados Argentina Todos los años
// router.get('/', obtenerFeriados)

module.exports = router;