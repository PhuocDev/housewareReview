const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    id: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    value: {
      type: String,
    },
    url: {
      type: String,
    },
    expiredDate: {
      type: Date,
    },
    code: {
      type: String,
    },
    source: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("coupon", CouponSchema);

module.exports = Coupon;
