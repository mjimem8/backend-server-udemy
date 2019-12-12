var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

//rutas
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre usuario hospital')
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (err, medicos) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    response.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });

            });


});


//actualizar medico
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El medico con id ' + id + 'no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = request.usuario._id;
        medico.hospital = body.hospital_id;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });

    });

});

//Crear nuevo medico
app.post('/', mdAutenticacion.verificaToken, (request, response) => {
    var body = request.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: request.usuario._id,
        hospital: body.hospital_id
    });


    medico.save((err, medicoGuardado) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });

});

//eliminar medico
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        response.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;