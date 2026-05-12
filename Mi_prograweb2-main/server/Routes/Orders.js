const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', orderController.createOrder);
router.get('/reporte-ventas', orderController.getReporteVentas);
router.get('/my-orders', orderController.getUserOrders);
router.get('/vendor-sales', orderController.getVendorOrders);
router.post('/:orderId/review', orderController.submitOrderReview);
router.get('/:id', orderController.getOrderById);

module.exports = router;