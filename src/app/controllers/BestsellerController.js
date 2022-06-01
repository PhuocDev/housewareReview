const Blog = require("../models/Blog");
const Bestseller = require("../models/Bestseller");

const CATEGORIES = {
  beauty: {
    title: "Làm Đẹp",
  },
  digital_devices: {
    title: "Đồ Chơi Công Nghệ",
  },
  electric_appliances: {
    title: "Điện Gia Dụng",
  },
};

const getPeriodTitle = (period) => {
  if (period === "week") {
    return "Tuần Này";
  } else if (period === "month") {
    return "Tháng Này";
  } else {
    return "Năm " + period.split("_")[1];
  }
};

module.exports.get_list = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      keyword = "",
      category = "beauty",
      period = "week",
    } = req?.query;

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

    let filtersAnd = [];

    if (category !== "") {
      filtersAnd.push(categoryFilter);
    }

    if (keyword !== "") {
      filtersAnd.push(keywordFilter);
    }

    if (period !== "") {
      filtersAnd.push({ period });
    }

    if (filtersAnd?.length > 0) {
      filters = {
        $and: filtersAnd,
      };
    }

    const count = await Bestseller.count(filters);
    const itemList = await Bestseller.find(filters)
      .sort({ rank: 1 })
      .skip(perPage * page - perPage)
      .limit(100)
      .lean();

    res.render("bestsellers", {
      items: itemList,
      total: count,
      keyword,
      category,
      period,
      title: CATEGORIES?.[category]?.title,
      periodTitle: getPeriodTitle(period),
      pagination: {
        page: page || 1,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (err) {
    console.log(err);
  }
};
