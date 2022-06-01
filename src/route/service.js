const express = require('express');
const ServiceController = require('../app/controllers/ServiceController');
const { requireAuth } = require('../app/middleware/AuthMiddleware');
const router = express.Router();
const { verifyCache } = require('../app/middleware/ServicesCacheMiddleware');
const { requireAdmin } = require('../app/middleware/RequireAdminMiddleware');


router.get('/book', requireAuth, ServiceController.book_get);
router.post('/book', requireAuth, ServiceController.book_post);
router.post('/admin-book', requireAuth, ServiceController.adminBook_post);
router.post('/book/get-service-list', requireAuth, ServiceController.customerListService_post);
router.get('/', verifyCache, ServiceController.service_get);

router.get('/editService', requireAdmin, ServiceController.editService_get);
router.post('/editService', ServiceController.editService_post);
router.get('/postService', requireAdmin, ServiceController.postService_get);
router.post('/postService/uploadSingle', /* upload.single('image-Service'), */ ServiceController.postService_post);
router.get('/editService/updateService/:code', requireAdmin, ServiceController.updateService_get);
router.post('/editService/updateService/:code', requireAdmin, ServiceController.updateService_post);
router.get('/:code', ServiceController.detailService_get);
module.exports = router;