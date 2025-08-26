import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { registerSchema, loginSchema } from '../schemas/userSchema.js';
import crypto from 'crypto';

// Get the JWT secret from environment variables and ensure it's present
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

// Register a new user
export const register = async (req, res) => {
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    // Return detailed Zod validation errors
    return res.status(400).json({
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { name, email, password, wardId } = validationResult.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Step 2: If a user is found, return a 409 error
    if (existingUser) {
      return res.status(409).json({ error: 'This email is already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'WARD_OFFICER',
        status: 'PENDING',
        wardId,
      },
    });

    // Don't send the password hash back in the response
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      wardId: newUser.wardId,
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({
      error: 'Registration failed unexpectedly.',
      details: error.message,
    });
  }
};

// Login a user

export const login = async (req, res) => {
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { email, password } = validationResult.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Enforce active status
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    // --- Generate short-lived access token (15 mins) ---
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        wardId: user.wardId,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // --- Generate refresh token ---
    const refreshToken = crypto.randomUUID(); // secure random token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day refresh token

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // --- Send tokens in HTTP-only cookies ---
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    // --- Send response ---
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        wardId: user.wardId,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({
      error: 'Login failed unexpectedly.',
      details: error.message,
    });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0), path: '/' });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0), path: '/' });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};



export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    // Check if refresh token exists in DB and is not expired
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = tokenRecord.user;

    // Check user status
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: `Account is ${user.status}` });
    }

    // Generate new short-lived access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        wardId: user.wardId,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};
