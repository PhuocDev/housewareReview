const Blog = require("../models/Blog");

module.exports.list_get = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, keyword = "" } = req?.query;

    if (keyword === "") {
      return res.redirect("/home");
    }

    let filters = {};
    let keywordFilter = {};

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

    res.render("search", {
      blogs: blogList,
      loggedIn: req?.userId !== undefined,
      total: count,
      keyword,
      pagination: {
        page: page || 1,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (err) {
    console.log(err);
  }
};
