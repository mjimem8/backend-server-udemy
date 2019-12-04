// requires 
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
//definir servidor express
var app = express();

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hostipalDB', (err, res) => {
    if (err) throw err;
    console.log("Base de datos \x1b[32m%s\x1b[0m", "online");

});

//rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});


//escuchar peticiones
//puerto 3000
app.listen(3000, () => {
    console.log("puerto 3000 \x1b[32m%s\x1b[0m", "online");
});