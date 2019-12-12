var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

//rutas
app.get('/:tipo/:img', (request, response, next) => {

    var tipo = request.params.tipo;
    var img = request.params.img;

    var path_imagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(path_imagen)) {
        response.sendFile(path_imagen);
    } else {
        var path_no_imagen = path.resolve(__dirname, '../assets/no-img.jpg');
        response.sendFile(path_no_imagen);
    }

});

module.exports = app;