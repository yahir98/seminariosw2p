var express = require('express');
var router = express.Router();

function initCondominiosApi(db)
{
  var fileModel = require('../filemodel');
  var conCollection = fileModel.getCondominios();

  var conModel = require('./condominios.model')(db);

  router.get('/', function (req, res) {
    res.json({
      "entity": "condominios",
      "version": "0.0.1"
    });
  }); //get

  router.get('/all', function(req, res){
    conModel.getAllCondominios((err, condominios)=>{
      if(err){
        res.status(404).json([]);
      } else {
        res.status(200).json(condominios);
      }
    });// end getAllProducts
  }); // get /all


  router.post('/new', function(req, res){
      conCollection = fileModel.getCondominios();
      var newCondominios = Object.assign(
        {},
        req.body,
        {
            "nombre": req.body.nombre,
            "apartament": parseInt(req.body.apartament),
            "cuotaMensual": parseFloat(req.body.cuotaMensual)
        }
      );
      var condominiosExists = conCollection.find(
        function(o, i){
          return o.codigo === newCondominios.codigo;
        }
      )
      if( ! condominiosExists ){
        conCollection.push(newCondominios);
        fileModel.setCondominios(
          conCollection,
          function(err, savedSuccesfully){
            if(err){
              res.status(400).json({ "error": "No se pudo ingresar objeto" });
            } else {
              res.json(newCondominios);  // req.body ===  $_POST[]
            }
          }
        );
      } else {
        res.status(400).json({"error":"No se pudo ingresar objeto"});
      }
  }); // post /new

  router.put('/update/:conCodigo',
    function(req, res){
        conCollection = fileModel.getCondominios();
        var conCodigoToModify = req.params.conCodigo;
        var amountToAdjust = parseInt(req.body.ajustar);
        var adjustType = req.body.tipo || 'SUB';
        var adjustHow = (adjustType == 'ADD' ? 1 : -1);
        var modCondominios = {};
        var newCondominiosArray = conCollection.map(
          function(o,i){
            if( conCodigoToModify === o.codigo){
              o.cuotaMensual = adjustType;
              modCondominios = Object.assign({}, o);
            }
            return o;
          }
        ); // end map
      conCollection = newCondominiosArray;
      fileModel.setCondominios(
        conCollection,
        function (err, savedSuccesfully) {
          if (err) {
            res.status(400).json({ "error": "No se pudo actualizar objeto" });
          } else {
            res.json(modCondominios);  // req.body ===  $_POST[]
          }
        }
      );
    }
  );// put :prdsku

  router.delete(
      '/delete/:conCodigo',
      function( req, res) {
        conCollection = fileModel.getCondominios();
        var conCodigoToDelete  = req.params.conCodigo;
        var newConCollection = conCollection.filter(
          function(o, i){
            return conCodigoToDelete !== o.codigo;
          }
        ); //filter
        conCollection = newConCollection;
        fileModel.setCondominios(
          conCollection,
          function (err, savedSuccesfully) {
            if (err) {
              res.status(400).json({ "error": "No se pudo eliminar objeto" });
            } else {
              res.json({"newProdsQty": conCollection.length});
            }
          }
        );
      }
    );// delete
    return router;
}

module.exports = initCondominiosApi;