const History = require("../models/History");

module.exports.get_list = async (req, res) => {
  try {
    const { page = 1, perPage = 10, keyword = "", userId } = req?.query;

    let filters = {
      userId,
    };
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

    let filtersAnd = [];

    if (keyword !== "") {
      filtersAnd.push(keywordFilter);
    }

    if (filtersAnd?.length > 0) {
      filters = {
        $and: [{ userId }, filtersAnd],
      };
    }

    const count = await History.count(filters);
    const histories = await History.find(filters)
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .lean();

    if (coupons) {
      res.render("history", {
        histories,
        total: count,
        keyword,
        pagination: {
          page: page || 1,
          pageCount: Math.ceil(count / perPage),
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.create = async (req, res) => {
  try {
    const data = req.body;

    const newHistory = new History(data);
    newHistory.save().then((result) => {
      res.status(200).json({
        status: 200,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.delete_single = async (req, res) => {
  try {
    const { id } = req?.params;
    const result = await History.deleteOne({ _id: id });

    if (result) {
      res.json({ status: 200 });
    } else {
      res.json({ status: 400, error: "Failed to delete history record!" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.delete_all = async (req, res) => {
  try {
    const { userId } = req?.params;
    const result = await History.deleteMany({ userId });

    if (result) {
      res.json({ status: 200 });
    } else {
      res.json({
        status: 400,
        error: "Failed to delete all user's history records!",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
