const prisma = require('../lib/prisma');
const { getImageUrl } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// ─── Get All Products ─────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const where = {
      ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }),
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { createdBy: { select: { id: true, name: true, nickname: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Get Single Product ───────────────────────────────────────────────────────
const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { createdBy: { select: { id: true, name: true, nickname: true } } },
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('getProduct error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Create Product ───────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const imageUrl = req.file ? getImageUrl(req.file.path) : null;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        category,
        imageUrl,
        createdById: req.user.id,
      },
      include: { createdBy: { select: { id: true, name: true, nickname: true } } },
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Update Product ───────────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });

    if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });
    if (existing.createdById !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let imageUrl = existing.imageUrl;
    if (req.file) {
      if (existing.imageUrl) {
        const oldPath = path.join(__dirname, '../../', existing.imageUrl.replace('/uploads/', 'uploads/'));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imageUrl = getImageUrl(req.file.path);
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(category !== undefined && { category }),
        imageUrl,
      },
      include: { createdBy: { select: { id: true, name: true, nickname: true } } },
    });

    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Delete Product ───────────────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });
    if (existing.createdById !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (existing.imageUrl) {
      const imgPath = path.join(__dirname, '../../', existing.imageUrl.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
