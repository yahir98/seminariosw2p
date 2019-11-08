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


  router.post('/new', function(req, res)
  {
    var newCon = Object.assign(
       {},
       req.body,
       { 
         "codigo":req.body.codigo,
         "nombre":req.body.nombre,
         "apartament":parseInt(req.body.apartament),
         "cuotaMensual": req.body.cuotaMensual,
         "createdBy": req.user
       }
     );
    conModel.saveNewCondominio(newCon, (err, rslt)=>{
      if(err){
        res.status(500).json(err);
      }else{
        res.status(200).json(rslt);
      }
    });// saveNewProduct
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