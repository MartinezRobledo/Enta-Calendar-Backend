const { response } = require('express');
const Feriados = require('../models/Feriados');
const { getHolidays } = require('../bot/getHolidays');

const obtenerFeriados = async( req, res = response ) => {
    
    const año = req.params.id;

    try {
        const feriadosBD = await Feriados.findOne({ año });
        if(!feriadosBD) {
            const feriados = new Feriados( req.body );
            console.log(feriados);
            const peticion = await getHolidays(año);
            if(peticion.error !== ''){
                return res.status(400).json({
                    ok: false,
                    error: peticion.error
                });
            } else {
                feriados.año = año;
                feriados.feriados_ar = peticion.allHolidays
                console.log(feriados)
                const eventoGuardado = await feriados.save();
                return res.status(201).json({
                    ok: true,
                    feriados: eventoGuardado
                });
            }
        } else {
            return res.status(200).json({
                ok: true,
                feriados: feriadosBD
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        });
    }
}

module.exports = {
    obtenerFeriados,
}