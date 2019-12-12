var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//busqueda por colección
app.get('/coleccion/:tabla/:busqueda', (request, response) => {

    var busqueda = request.params.busqueda;
    var tabla = request.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;

        default:
            response.status(200).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });
    }

    promesa.then(data => {
        response.status(200).json({
            ok: true,
            [tabla]: data,
        });
    });

});


//busqueda general
app.get('/todo/:busqueda', (request, response) => {

    var busqueda = request.params.busqueda;
    //con la el caracter `i` hacemos una expresión regular insensible a mayuculas y minusculas
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ]).then(respuestas => {

        response.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuario: respuestas[2],
        });

    });

});


function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });
    });

}

function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });
    });

}

function buscarUsuarios(regex) {

    return new Promise((resolve, reject) => {
        //con esto buscamos en una columna o en otra
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuario) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuario);
                }
            })

    });

}

module.exports = app;