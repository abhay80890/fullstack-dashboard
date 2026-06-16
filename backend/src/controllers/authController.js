const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Generate tokens
const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

// ─── Register ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, nickname, email, password } = req.body;

    if (!name || !nickname || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, nickname, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const existingNickname = await prisma.user.findUnique({ where: { nickname } });
    if (existingNickname) {
      return res.status(409).json({ success: false, message: 'Nickname already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, nickname, email, password: hashedPassword },
      select: { id: true, name: true, nickname: true, email: true, role: true, avatar: true, createdAt: true },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: `Please log in using your ${user.authProvider} account` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword, accessToken, refreshToken },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken(stored.userId);
    const newRefreshToken = generateRefreshToken(stored.userId);

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: stored.userId, expiresAt } });

    res.json({ success: true, data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── OAuth Callbacks ────────────────────────────────────────────────────────────

const handleOAuthLogin = async (email, name, nickname, provider, avatar, res) => {
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    let finalNickname = nickname;
    if (finalNickname) {
      const existingNickname = await prisma.user.findUnique({ where: { nickname: finalNickname } });
      if (existingNickname) finalNickname = null; // nullify if taken
    }
    
    user = await prisma.user.create({
      data: { name, nickname: finalNickname, email, authProvider: provider, avatar },
    });
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

  const { password: _, ...userWithoutPassword } = user;
  
  return res.json({
    success: true,
    message: 'Login successful',
    data: { user: userWithoutPassword, accessToken, refreshToken },
  });
};

const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code required' });

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.CLIENT_URL}/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      console.error('Google token error:', tokenData);
      return res.status(400).json({ success: false, message: 'Failed to exchange token' });
    }

    // Fetch user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();
    if (!userData.email) return res.status(400).json({ success: false, message: 'No email provided by Google' });

    await handleOAuthLogin(userData.email, userData.name, userData.email.split('@')[0], 'google', userData.picture, res);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const githubCallback = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code required' });

    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      console.error('GitHub token error:', tokenData);
      return res.status(400).json({ success: false, message: 'Failed to exchange token' });
    }

    // Fetch user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();
    
    // Fetch emails (GitHub email might be private)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const emailsData = await emailsResponse.json();
    const primaryEmail = emailsData.find(e => e.primary)?.email || emailsData[0]?.email;
    
    if (!primaryEmail) return res.status(400).json({ success: false, message: 'No email provided by GitHub' });

    await handleOAuthLogin(primaryEmail, userData.name || userData.login, userData.login, 'github', userData.avatar_url, res);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { register, login, refreshToken, logout, googleCallback, githubCallback };
