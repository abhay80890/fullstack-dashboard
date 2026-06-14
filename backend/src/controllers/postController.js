const prisma = require('../lib/prisma');
const { getImageUrl } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// ─── Get All Posts ────────────────────────────────────────────────────────────
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const published = req.query.published;

    const where = {
      ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }] }),
      ...(published !== undefined && { published: published === 'true' }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: { author: { select: { id: true, name: true, nickname: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getPosts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Get Single Post ──────────────────────────────────────────────────────────
const getPost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { author: { select: { id: true, name: true, nickname: true, avatar: true } } },
    });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('getPost error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Create Post ──────────────────────────────────────────────────────────────
const createPost = async (req, res) => {
  try {
    const { title, content, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const imageUrl = req.file ? getImageUrl(req.file.path) : null;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published === 'true' || published === true,
        imageUrl,
        authorId: req.user.id,
      },
      include: { author: { select: { id: true, name: true, nickname: true, avatar: true } } },
    });

    res.status(201).json({ success: true, message: 'Post created successfully', data: post });
  } catch (error) {
    console.error('createPost error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Update Post ──────────────────────────────────────────────────────────────
const updatePost = async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!existing) return res.status(404).json({ success: false, message: 'Post not found' });
    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let imageUrl = existing.imageUrl;
    if (req.file) {
      // Delete old image
      if (existing.imageUrl) {
        const oldPath = path.join(__dirname, '../../', existing.imageUrl.replace('/uploads/', 'uploads/'));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imageUrl = getImageUrl(req.file.path);
    }

    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published: published === 'true' || published === true }),
        imageUrl,
      },
      include: { author: { select: { id: true, name: true, nickname: true, avatar: true } } },
    });

    res.json({ success: true, message: 'Post updated successfully', data: post });
  } catch (error) {
    console.error('updatePost error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Delete Post ──────────────────────────────────────────────────────────────
const deletePost = async (req, res) => {
  try {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Post not found' });
    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete associated image
    if (existing.imageUrl) {
      const imgPath = path.join(__dirname, '../../', existing.imageUrl.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('deletePost error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
