const res = require("express/lib/response");
const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");
const { blogListcache } = require("../middleware/BlogsCacheMiddleware");
const { render } = require("express/lib/response");
const jwt = require("jsonwebtoken");

/* const path = require('path') */
/* var fs = require('fs'); */
const handleErrors = (err) => {
  let errors = {
    title: "",
    img: "",
    category: "",
    description: "",
    contentCode: "",
  };

  if (err.message === "Title is required") {
    errors.title = "*Title is required";
    return errors;
  }

  if (err.message === "Image is required") {
    errors.img = "*Image is required";
    return errors;
  }

  if (err.message === "Category is required") {
    errors.category = "*Category is required";
    return errors;
  }
  if (err.message === "Description is required") {
    errors.description = "*Description is required";
    return errors;
  }
  if (err.message === "Content is required") {
    errors.contentCode = "*Content is required";
    return errors;
  }
  return errors;
};

module.exports.blog_get = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, keyword = "", category = "" } = req?.query;

    let filters = {};
    let categoryFilter = {};
    let keywordFilter = {};

    if (category !== "") {
      categoryFilter = {
        category,
      };
    }

    if (keyword !== "") {
      keywordFilter = {
        $or: [
          {
            title: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      };
    }

    let filtersAnd = [{ status: "published" }];

    if (category !== "") {
      filtersAnd.push(categoryFilter);
    }

    if (keyword !== "") {
      filtersAnd.push(keywordFilter);
    }

    if (filtersAnd?.length > 0) {
      filters = {
        $and: filtersAnd,
      };
    }

    const count = await Blog.count(filters);
    const blogList = await Blog.find(filters)
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .lean();

    const userBlogList = await Blog.find({
      authorId: req?.userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.render("blog", {
      blogs: blogList,
      userBlogs: userBlogList,
      loggedIn: req?.userId !== undefined,
      total: count,
      keyword,
      category,
      pagination: {
        page: page || 1,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.postBlog_get = (req, res) => {
  res.render("postBlog", { userId: req?.userId, userRole: req?.userRole });
};

//---------------------------------------------------------------------------

module.exports.postBlog_post = async (req, res) => {
  /*     if (req.files == undefined) {
        return res.send({
          message: "You must select a file.",
        });
    }
    else{
        console.log(req.file)
    } */

  const {
    title,
    img,
    category,
    description,
    status = "draft",
    contentCode,
    userId,
  } = req.body;
  /*     var image = fs.readFileSync(req.file.path);
    var encode_image = image.toString('base64'); */
  try {
    if (title == "") throw Error("Title is required");
    if (img == "") throw Error("Image is required");
    if (category == "") throw Error("Category is required");
    if (description == "") throw Error("Description is required");
    if (contentCode == "") throw Error("Content is required");

    const author = await User.findById(userId).lean();

    var newBlog = new Blog({
      title: title,
      img: img,
      category: category,
      description: description,
      contentCode: contentCode,
      status,
      authorId: req?.userId,
      author: {
        username: author?.username,
        fullname: author?.fullname,
        email: author?.mail,
      },
    });
    newBlog.save().then((result) => {
      console.log("posting successful");
      blogListcache.del("blogList"); //remove cache
      console.log(newBlog);
      res.status(200).json({ blog: newBlog });
    });
  } catch (err) {
    console.log(err.message);
    const errors = handleErrors(err);
    res.status(400).json({ errors: errors });
  }
};
//-----------------------------------------------------------------//

module.exports.detailBlog_get = async (req, res) => {
  console.log("blog code: ", req.params.code);
  var objectId = mongoose.Types.ObjectId(req.params.code);
  console.log("objectID: ", objectId);
  try {
    const blog = await Blog.findOne({ _id: objectId }).lean();
    const blogUrl = `http://reviewsblog.com/blog/${blog._id}`;

    if (blog) {
      //console.log(blog);
      res.render("detailBlog", { blog: blog, userId: req?.userId, blogUrl });
    } else {
      console.log("blog null");
    }
  } catch (err) {
    console.log("blog detail error");
    console.log(err);
  }
};
//-------------------------------------------------------------------------//
module.exports.editBlog_get = async (req, res) => {
  try {
    const blogList = await Blog.find({}).sort({ createdAt: -1 }).lean();

    if (blogList) {
      res.render("editBlog", {
        blogs: blogList,
        userRole: req?.userRole,
      });
    } else {
      console.log("blogList Null");
    }
  } catch (err) {
    console.log("get blog error");
    console.log(err);
  }
};

module.exports.editBlog_post = async (req, res) => {
  const { id, status } = req.body;
  var objectId = mongoose.Types.ObjectId(id);
  try {
    if (status == "delete") {
      const query = { _id: objectId };
      const result = await Blog.deleteOne(query);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
        blogListcache.del("blogList"); //remove cache
        res.status(200).json({ status: "deleted" });
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    }
  } catch (err) {
    console.log("delete blog error");
    console.log(err);
  }
};
/*---------------------------------------------------------------------*/
module.exports.editDetailBlog_get = async (req, res) => {
  const objectId = mongoose.Types.ObjectId(req.params.code);

  try {
    const blog = await Blog.findOne({ _id: objectId }).lean();

    if (blog) {
      res.render("editDetailBlog", {
        blog: blog,
        userId: req?.userId,
        userRole: req?.userRole,
      });
    } else {
      console.log("blog null");
    }
  } catch (err) {
    console.log("blog detail error");
    console.log(err);
  }
};

module.exports.editDetailBlog_post = async (req, res) => {
  const { id, title, img, category, description, contentCode, status } =
    req.body;

  console.log("go here", status);

  if (title == "") throw Error("Title is required");
  if (img == "") throw Error("Image is required");
  if (category == "") throw Error("Category is required");
  if (description == "") throw Error("Description is required");
  if (contentCode == "") throw Error("Content is required");

  var objectId = mongoose.Types.ObjectId(id);
  const newBlog = new Blog({
    title: title,
    img: img,
    category: category,
    description: description,
    contentCode: contentCode,
    status: status,
  });

  try {
    //const query = { _id: objectId };
    const result = await Blog.updateOne(
      { _id: objectId },
      {
        title: title,
        img: img,
        category: category,
        description: description,
        contentCode: contentCode,
        status: status,
      }
    );
    if (result.modifiedCount === 1) {
      console.log("Successfully update one document.");
      blogListcache.del("blogList"); //remove cache
      res.status(200).json({ blog: newBlog });
    } else {
      console.log("No documents matched the query. uploaded 0 documents.");
    }
  } catch (err) {
    console.log("update service error");
    console.log(err);
  }
};

module.exports.deleteById = async (req, res) => {
  try {
    const { id } = req?.params;
    const result = await Blog.deleteOne({
      _id: id,
    });

    if (result.deletedCount === 1) {
      res.status(200).json({
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: 400,
    });
  }
};
