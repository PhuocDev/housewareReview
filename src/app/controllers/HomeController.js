const Blog = require("../models/Blog");
const Bestseller = require("../models/Bestseller");

class HomeController {
  async index(req, res) {
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(9)
      .lean();
    const beautyProducts = await Bestseller.find({
      category: "beauty",
      period: "week",
    })
      .sort({ rank: "asc" })
      .limit(6)
      .lean();
    const deviceProducts = await Bestseller.find({
      category: "digital_devices",
      period: "week",
    })
      .sort({ rank: "asc" })
      .limit(6)
      .lean();
    const applianceProducts = await Bestseller.find({
      category: "electric_appliances",
      period: "week",
    })
      .sort({ rank: "asc" })
      .limit(6)
      .lean();
    const monthBeautyProducts = await Bestseller.find({
      category: "beauty",
      period: "month",
    })
      .sort({ rank: "asc" })
      .limit(6)
      .lean();
    const monthDeviceProducts = await Bestseller.find({
      category: "digital_devices",
      period: "month",
    })
      .sort({ rank: "asc" })
      .limit(6)
      .lean();
    const monthApplianceProducts = await Bestseller.find({
      category: "electric_appliances",
      period: "month",
    })
      .sort({ rank: "asc" })
      .limit(6)
      .lean();

    res.render("home", {
      blogs,
      beautyProducts,
      deviceProducts,
      applianceProducts,
      monthBeautyProducts,
      monthDeviceProducts,
      monthApplianceProducts,
    });
  }
}

module.exports = new HomeController();
