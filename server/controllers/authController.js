import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { registerSchema, loginSchema } from '../schemas/userSchema.js';

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
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'ward_officer',
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
    // Handle specific Prisma unique constraint error for email
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ error: 'This email is already in use.' });
    }

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
    // Return detailed Zod validation errors
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

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        wardId: user.wardId,
      },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    //sending token in and htttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

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
    res
      .status(500)
      .json({ error: 'Login failed unexpectedly.', details: error.message });
  }
};
export const logout = (req, res) => {
  // Clear the token cookie by setting its expiration to a past date
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Sets the expiration to the epoch (January 1, 1970)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  // Send a success response
  res.status(200).json({ message: 'Logged out successfully' });
};
