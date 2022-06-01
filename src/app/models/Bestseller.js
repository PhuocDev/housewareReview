const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BestsellerSchema = new Schema(
  {
    id: {
      type: String,
    },
    rank: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },
    title: {
      type: String,
    },
    review_count: {
      type: Number,
      default: 0,
    },
    sale_price: {
      type: String,
    },
    regular_price: {
      type: String,
    },
    discount_rate: {
      type: String,
    },
    url: {
      type: String,
    },
    period: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Bestseller = mongoose.model("bestseller", BestsellerSchema);

module.exports = Bestseller;
