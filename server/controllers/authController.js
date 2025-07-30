import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

const jwtSecret = process.env.JWT_SECRET;

//Register
export const register = async (req, res) => {
  const { name, email, password, role, wardId } = req.body;
  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
        wardId,
      },
    });
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Registration failed', details: err.message });
  }
};

//Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        wardId: user.wardId,
      },
      jwtSecret,
      { expiresIn: '7d' },
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        wardId: user.wardId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};
