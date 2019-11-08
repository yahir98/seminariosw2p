var ObjectId = require('mongodb').ObjectId;

function condominiosModel(db)
{
    let condominioModel = {};
    var condominiosCollection = db.collection("condominios");

    condominioModel.getAllCondominios = (handler)=>
    {
        condominiosCollection.find({}).toArray(
          (err, docs)=>{
            if(err)
            {
              console.log(err);
              return handler(err, null);
            }
            return handler(null, docs);
          }
        );
    } // end getAllProducts

    condominioModel.saveNewCondominio = (newCondominio, handler)=>
    {
        condominiosCollection.insertOne(newCondominio, (err, result)=>
        {
          if(err)
          {
            console.log(err);
            return handler(err, null);
          }
          return handler(null, result);
        }); //insertOne
    }

    condominioModel.updateCondominio = (updateFields, condominioId, handler)=>{
        let condominioFilter = {"_id": new ObjectId(condominioId)};
        let updateObject = {
          "$set": {
                    "nombre": updateFields.nombre,
                    "apartament": updateFields.apartament,  
                    "dateModified":new Date().getTime()
                }
    };
    condominiosCollection.updateOne(
        condominioFilter,
        updateObject,
        (err, rslt)=>{
          if(err){
            console.log(err);
            return handler(err, null);
          }
          return handler(null, rslt);
        }
      );
    }; // updateObject

    condominioModel.deleteCondominios = (id, handler)=>
    {
      var query = {"_id": new ObjectId(id)};
      condominiosCollection.deleteOne(query, (err, rslt)=>{
          if(err)
          {
            console.log(err);
            return handler(err, null);
          }
          return handler(null, rslt);
      })//deleteone
    }

    return condominioModel;
}
module.exports = condominiosModel;