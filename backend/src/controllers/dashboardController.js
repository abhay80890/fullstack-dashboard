const prisma = require('../lib/prisma');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalProducts,
      publishedPosts,
      recentPosts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.product.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true, nickname: true, avatar: true } } },
      }),
    ]);

    const monthlyUsers = await getMonthlyUsersData();

    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalPosts, totalProducts, publishedPosts },
        recentPosts,
        monthlyUsers,
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMonthlyUsersData = async () => {
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
    const monthName = d.toLocaleString('default', { month: 'short' });
    monthlyUsersMap[key] = { name: monthName, month: new Date(d.getFullYear(), d.getMonth(), 1), users: 0 };
  }

  users.forEach(user => {
    const uDate = new Date(user.createdAt);
    const key = `${uDate.getFullYear()}-${String(uDate.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyUsersMap[key]) {
      monthlyUsersMap[key].users++;
    }
  });

  return Object.values(monthlyUsersMap).sort((a, b) => a.month - b.month).map(item => ({ name: item.name, users: item.users }));
};

const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalPosts, totalProducts, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.product.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, nickname: true, email: true, role: true, avatar: true, createdAt: true },
      }),
    ]);
    
    const monthlyUsers = await getMonthlyUsersData();

    res.json({ success: true, data: { stats: { totalUsers, totalPosts, totalProducts }, recentUsers, monthlyUsers } });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getDashboardStats, getAdminStats };
