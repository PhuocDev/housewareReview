const express = require("express");
const BlogController = require("../app/controllers/BlogController");
const router = express.Router();
const { verifyCache } = require("../app/middleware/BlogsCacheMiddleware");
const { requireAdmin } = require("../app/middleware/RequireAdminMiddleware");

/* const multer = require('multer');//
const { connections } = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage, limits: {
    fileSize: 4 * 1024 * 1024,
  } }); */

router.get("/postBlog", BlogController.postBlog_get);
router.post(
  "/postBlog/uploadSingle",
  /* upload.single('image-blog'), */ BlogController.postBlog_post
);
router.get("/editBlog", requireAdmin, BlogController.editBlog_get);
router.post("/editBlog", BlogController.editBlog_post);
router.delete("/:id", BlogController.deleteById);
router.get("/editBlog/:code", BlogController.editDetailBlog_get);
router.post("/editBlog/:code", BlogController.editDetailBlog_post);
router.get("/", verifyCache, BlogController.blog_get);
router.get("/:code", /* detailCache, */ BlogController.detailBlog_get);

module.exports = router;
