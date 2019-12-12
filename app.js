// requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables
//definir servidor express
var app = express();

//Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var medicoRoute = require('./routes/medico');
var busquedaRoute = require('./routes/busqueda');
var uploadRoute = require('./routes/upload');
var imagenesRoute = require('./routes/imagenes');

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useUnifiedTopology: true, useNewUrlParser: true },
    (err, res) => {
        if (err) throw err;
        console.log("Base de datos \x1b[32m%s\x1b[0m", "online");

    });

//Server index config
//con lo siguiente podemos montar la estructura de carpetas de uploads de manera grafica 
//no lo utilizaremos

//var serverIndex = require('serve-index');
//app.use(express.static(__dirname + '/'));
//app.use('/uploads', serveIndex(__dirname + '/uploads'));

mongoose.set('useCreateIndex', true);

//Rutas
app.use('/usuario', usuarioRoute);
app.use('/hospital', hospitalRoute);
app.use('/medico', medicoRoute);
app.use('/login', loginRoute);
app.use('/busqueda', busquedaRoute);
app.use('/upload', uploadRoute);
app.use('/img', imagenesRoute);

app.use('/', appRoutes);

//escuchar peticiones
//puerto 3000
app.listen(3000, () => {
    console.log("puerto 3000 \x1b[32m%s\x1b[0m", "online");
});