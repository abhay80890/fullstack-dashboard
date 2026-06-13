const express = require('express');
const { getMe, updateMe, uploadAvatar, getUsers } = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(authenticateToken);

router.get('/me', getMe);
router.put('/me', updateMe);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.get('/', requireAdmin, getUsers);

module.exports = router;
