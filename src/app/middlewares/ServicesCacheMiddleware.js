const NodeCache = require("node-cache");
const mongoose = require('mongoose');

const serviceListcache = new NodeCache({ stdTTL: 120 });

const verifyCache = (req, res, next) => {
    try {
        console.log("servicelist cache have");
        //console.log(serviceListcache);
        if (serviceListcache.has("serviceList")) {
            console.log("cache have");
            //return res.status(200).json(serviceListcache.get("serviceList"));
            return res.render('service', { services: serviceListcache.get("serviceList") });
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};


/* const detailCache = (req, res, next) => {
    try {

        if (serviceListcache.has("serviceList")) {

            var objectId = mongoose.Types.ObjectId(req.params.code);
            const service = serviceListcache.get("serviceList").find(({ _id }) => _id === objectId);

            if(service){
                console.log("have service");
                return  res.render('detailservice', { service: service });
            }
        }
      return next();
    } catch (err) {
      throw new Error(err);
    }
  }; */
module.exports = { verifyCache, serviceListcache /* , detailCache  */ };