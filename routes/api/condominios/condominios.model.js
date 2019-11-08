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

    return condominioModel;
}
module.exports = condominiosModel;