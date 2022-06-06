const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema(
  {
    url: {
      type: String,
    },
    userId: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

const History = mongoose.model("history", HistorySchema);
module.exports = History;
