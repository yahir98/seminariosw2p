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

 router.put('/update/:conid',
 function(req, res)
 {
   var conIdToModify = req.params.conid;
   var nombreAct= req.body.nombre;
   var apartamentAct = req.body.apartament;
   conModel.updateCondominio(
     {nombre:nombreAct, apartament:apartamentAct}, conIdToModify,
     (err, rsult)=>{
       if(err){
         res.status(500).json(err);
       }else{
         res.status(200).json(rsult);
       }
     }
     ); //updateProduct
 }
);// put :prdsku

  router.delete(
    '/delete/:conid',
    function( req, res) {

      var id = req.params.conid || '';
      if(id===' ')
      {
        return  res.status(404).json({"error": "Identificador no válido"});
      }
      conModel.deleteCondominios(id, (err, rslt)=>{
        if(err)
        {
          return res.status(500).json({"error":"Ocurrió un error, intente de nuevo."});
        }
        return res.status(200).json({"msg":"Deleted ok"});
        
      }); //delete product
    }
  );// delete
    return router;
}

module.exports = initCondominiosApi;