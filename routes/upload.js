var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

//default options
app.use(fileUpload());

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

//rutas
app.put('/:tipo/:id', (request, response, next) => {

    var tipo = request.params.tipo;
    var id = request.params.id;

    //tipos de coleccion
    var tipos_validos = ['hospitales', 'medicos', 'usuarios'];

    if (tipos_validos.indexOf(tipo) < 0) {
        response.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es valida',
            errors: { message: 'Tipo de colección no es valida' }
        });
    }

    if (!request.files) {
        response.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = request.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];

    //Valicaciones de extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        response.status(400).json({
            ok: false,
            mensaje: 'Extensión no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    //nombre del archivo personalizado
    var nombre_archivo = `${ id } - ${new Date().getMilliseconds()}.${extension}`;

    //mover el archivo temporal a un path
    var path = `./uploads/${ tipo }/${ nombre_archivo }`;

    archivo.mv(path, err => {
        if (err) {
            response.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombre_archivo, response);

    });

});

function subirPorTipo(tipo, id, nombre_archivo, response) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: err
                });
            }

            var path_antiguo = './uploads/usuarios/' + usuario.img;

            //si existe elimina la imagen anterior
            if (fs.existsSync(path_antiguo)) {
                fs.unlink(path_antiguo, (err) => {
                    if (err) {
                        return response.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el archivo',
                            errors: err
                        });
                    }
                });
            }

            usuario.img = nombre_archivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });

    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: err
                });
            }

            var path_antiguo = './uploads/medicos/' + medico.img;

            //si existe elimina la imagen anterior
            if (fs.existsSync(path_antiguo)) {
                fs.unlink(path_antiguo, (err) => {
                    if (err) {
                        return response.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el archivo',
                            errors: err
                        });
                    }
                });
            }

            medico.img = nombre_archivo;

            medico.save((err, medicoActualizado) => {
                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: err
                });
            }

            var path_antiguo = './uploads/hospitales/' + hospital.img;

            //si existe elimina la imagen anterior
            if (fs.existsSync(path_antiguo)) {
                fs.unlink(path_antiguo, (err) => {
                    if (err) {
                        return response.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el archivo',
                            errors: err
                        });
                    }
                });
            }

            hospital.img = nombre_archivo;

            hospital.save((err, hospitalActualizado) => {
                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });

        });
    }


}

module.exports = app;