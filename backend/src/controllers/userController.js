const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { getImageUrl } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// ─── Get My Profile ───────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true,
        avatar: true, bio: true, createdAt: true,
        _count: { select: { posts: true, products: true } },
      },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Update My Profile ────────────────────────────────────────────────────────
const updateMe = async (req, res) => {
  try {
    const { name, bio, currentPassword, newPassword } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new one' });
      }
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, createdAt: true },
    });

    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) {
    console.error('updateMe error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Upload Avatar ────────────────────────────────────────────────────────────
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Delete old avatar if exists
    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (currentUser.avatar) {
      const oldPath = path.join(__dirname, '../../', currentUser.avatar.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const imageUrl = getImageUrl(req.file.path);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: imageUrl },
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true },
    });

    res.json({ success: true, message: 'Avatar uploaded successfully', data: user });
  } catch (error) {
    console.error('uploadAvatar error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true, name: true, email: true, role: true,
          avatar: true, createdAt: true,
          _count: { select: { posts: true, products: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getMe, updateMe, uploadAvatar, getUsers };
