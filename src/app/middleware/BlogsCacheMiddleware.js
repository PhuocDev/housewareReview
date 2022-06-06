const NodeCache = require("node-cache");
const mongoose = require ('mongoose');

const blogListcache = new NodeCache({ stdTTL: 120 });

const verifyCache = (req, res, next) => {
    try {
        console.log("bloglist cache have");
        //console.log(blogListcache);
        if (blogListcache.has("blogList")) {
            console.log("cache have");
            //return res.status(200).json(blogListcache.get("blogList"));
            return  res.render('blog', { blogs: blogListcache.get("blogList") });
        }
      return next();
    } catch (err) {
      throw new Error(err);
    }
  };

  
/* const detailCache = (req, res, next) => {
    try {

        if (blogListcache.has("blogList")) {

            var objectId = mongoose.Types.ObjectId(req.params.code);
            const blog = blogListcache.get("blogList").find(({ _id }) => _id === objectId);

            if(blog){
                console.log("have blog");
                return  res.render('detailBlog', { blog: blog });
            }
        }
      return next();
    } catch (err) {
      throw new Error(err);
    }
  }; */
module.exports = { verifyCache, blogListcache/* , detailCache  */};