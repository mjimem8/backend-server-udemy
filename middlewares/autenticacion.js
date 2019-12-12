var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//verificar token
//simplemente para verificar el token tendremos que pasar por parametro 
//a la petición el metodo que ponemos aquí

//en las demas peticiones el token se asa por parametro/request y el sistema 
//automaticamente en las peticiones que recibe el token podemos obtener los datos
//del usuario a traves del token de tal forma -> request.usuario._id

exports.verificaToken = function(request, response, next) {
    var token = request.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return response.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        request.usuario = decoded.usuario;

        //con el next controlamos que las peticiones que utilicen token puedan seguir con su curso
        next();
    });

}