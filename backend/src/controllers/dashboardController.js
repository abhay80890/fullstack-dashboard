const prisma = require('../lib/prisma');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalProducts,
      publishedPosts,
      recentUsers,
      recentPosts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.product.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, avatar: true } } },
      }),
    ]);

    // Monthly user signups for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const monthlyUsersMap = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date(sixMonthsAgo);
      d.setMonth(sixMonthsAgo.getMonth() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyUsersMap[key] = { month: new Date(d.getFullYear(), d.getMonth(), 1), count: 0 };
    }

    users.forEach(user => {
      const uDate = new Date(user.createdAt);
      const key = `${uDate.getFullYear()}-${String(uDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyUsersMap[key]) {
        monthlyUsersMap[key].count++;
      }
    });

    const monthlyUsers = Object.values(monthlyUsersMap).sort((a, b) => a.month - b.month);

    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalPosts, totalProducts, publishedPosts },
        recentUsers,
        recentPosts,
        monthlyUsers,
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getDashboardStats };
