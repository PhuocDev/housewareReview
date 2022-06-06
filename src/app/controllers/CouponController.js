const Coupon = require("../models/Coupon");

module.exports.get_list = async (req, res) => {
  try {
    const { page = 1, perPage = 10, keyword = "", category = "" } = req?.query;

    let filters = {};
    let categoryFilter = {};
    let keywordFilter = {};

    if (category !== "") {
      categoryFilter = {
        source: category,
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

    let filtersAnd = [];

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

    const count = await Coupon.count(filters);
    const coupons = await Coupon.find(filters)
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .lean();

    res.render("coupons", {
      coupons,
      total: count,
      keyword,
      category,
      userId: req?.userId,
      pagination: {
        page: page || 1,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (err) {
    console.log(err);
  }
};
