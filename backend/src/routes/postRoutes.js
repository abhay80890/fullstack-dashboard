const express = require('express');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', authenticateToken, getPosts);
router.get('/:id', authenticateToken, getPost);
router.post('/', authenticateToken, upload.single('image'), createPost);
router.put('/:id', authenticateToken, upload.single('image'), updatePost);
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;
