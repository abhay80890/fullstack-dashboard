const express = require('express');
const { getDashboardStats, getAdminStats } = require('../controllers/dashboardController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/stats', getDashboardStats);
router.get('/admin/stats', requireAdmin, getAdminStats);

module.exports = router;
