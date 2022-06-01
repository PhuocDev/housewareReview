const express = require("express");
const router = express.Router();
const HistoryController = require("../app/controllers/HistoryController");

router.get("/", HistoryController.get_list);
router.post("/", HistoryController.create);
router.delete("/single/:id", HistoryController.delete_single);
router.delete("/all/:userId", HistoryController.delete_all);

module.exports = router;
