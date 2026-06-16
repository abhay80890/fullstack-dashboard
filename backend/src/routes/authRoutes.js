const express = require('express');
const { register, login, refreshToken, logout, googleCallback, githubCallback } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.post('/google/callback', googleCallback);
router.post('/github/callback', githubCallback);

module.exports = router;
