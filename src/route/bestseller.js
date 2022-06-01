const express = require("express");
const router = express.Router();
const BestsellerController = require("../app/controllers/BestsellerController");

router.get("/", BestsellerController.get_list);

module.exports = router;
