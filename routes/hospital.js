var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

//rutas
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, 'nombre usuario')
        //con esto obtenemos los datos de la tabla usuario
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, hospitales) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    response.status(200).json({
                        ok: true,
                        hospitales: hospitales
                    });
                });

            });


});


//actualizar hospital
app.put('/:id', mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El hospital con id ' + id + 'no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = request.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            response.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });

    });

});

//Crear nuevo hospital
app.post('/', mdAutenticacion.verificaToken, (request, response) => {
    var body = request.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: request.usuario._id
    });


    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        response.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });

});

//eliminar hospital
app.delete('/:id', mdAutenticacion.verificaToken, (request, response) => {
    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        response.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;