const express = require("express");
const router = express.Router();
const CouponController = require("../app/controllers/CouponController");

router.get("/", CouponController.get_list);

module.exports = router;
