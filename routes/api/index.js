var express = require('express');
var router = express.Router();

function initApiRouter(db)
{
    //Rutas de Cada Entidad
    var condominiosApiRoutes = require('./condominios/index')(db);
    //localhost:3000/api/con/
    router.use('/con', condominiosApiRoutes);

    return router;
}
module.exports = initApiRouter;