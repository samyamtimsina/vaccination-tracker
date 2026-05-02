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

  console.log('validatonResult', validationResult);
  if (!validationResult.success) {
    // Return detailed Zod validation errors
    return res.status(400).json({
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { name, email, password, wardId, phoneNumber } = validationResult.data;

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
        phoneNumber
      },
    });

    // Don't send the password hash back in the response
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      wardId: newUser.wardId,
      phoneNumber: newUser.phoneNumber
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
  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

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
    if (user.status === 'PENDING') {
      // Logic for PENDING users: Initiate OTP verification

      // Generate a new OTP and set its expiry
      const otpCode = generateOtp();
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 5); // OTP expires in 5 minutes

      // Hash the OTP before storing it for security
      const hashedOtp = await bcrypt.hash(otpCode, 10); // Use a salt round of 10

      // Store the OTP in the database.
      // We will clear any existing OTPs for this user to ensure only the latest one is valid.
      await prisma.otp.deleteMany({
        where: { userId: user.id },
      });
      await prisma.otp.create({
        data: {
          otpCode: hashedOtp,
          expiresAt: expiryDate,
          userId: user.id,
        },
      });

      // Log the OTP to the console for development/testing purposes.
      // This part will be replaced by an actual SMS or email provider later.
      console.log(`[OTP] Sending OTP ${otpCode} to user with ID ${user.id} at email: ${user.email}`);

      // Return a success response indicating OTP is required.
      // Do NOT send the OTP itself back to the client.
      return res.status(200).json({
        message: 'Account pending. OTP verification required.',
        userId: user.id, // Send the user ID back so the client knows which user to verify
        status: user.status,
      });

    } else if (user.status === 'DISABLED') {
      // Logic for DISABLED users: Deny access
      return res.status(403).json({ message: 'Your account is currently disabled. Please contact support.' });

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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
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
    console.log(
      'Logging out user:',
      req.user ? `ID ${req.user.id}, Email: ${req.user.email}` : 'No user data'

    )
    console.log('Refresh token from cookies:', refreshToken);

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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export const verifyOtp = async (req, res) => {
  const { userId, otpCode } = req.body;

  // 1. Validate incoming data
  if (!userId || !otpCode) {
    return res.status(400).json({ message: 'User ID and OTP are required.' });
  }

  try {
    // 2. Find the OTP record for the given user
    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: parseInt(userId), // Ensure userId is an integer
      },
      include: {
        user: true, // Include the user data to update their status later
      },
      orderBy: {
        createdAt: 'desc', // Get the latest OTP if multiple exist (though the login endpoint deletes old ones)
      },
    });

    // Handle cases where no OTP record is found
    if (!otpRecord) {
      return res.status(404).json({ message: 'No pending OTP found for this account. Please log in again to generate a new one.' });
    }

    // 3. Check if the OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      // Delete the expired OTP to prevent future use and cleanup the database
      await prisma.otp.delete({
        where: { id: otpRecord.id },
      });
      return res.status(400).json({ message: 'OTP has expired. Please log in again to receive a new one.' });
    }

    // 4. Compare the submitted OTP with the stored hashed OTP
    const isOtpValid = await bcrypt.compare(String(otpCode), otpRecord.otpCode);
    if (!isOtpValid) {
      // You might choose to add a lockout mechanism here after a number of failed attempts
      return res.status(401).json({ message: 'Invalid OTP. Please try again.' });
    }

    // 5. If OTP is valid, activate the user's account and delete the OTP record
    const user = await prisma.user.update({
      where: { id: otpRecord.user.id },
      data: { status: 'ACTIVE' },
    });

    // Delete the OTP record since it has been successfully used
    await prisma.otp.delete({
      where: { id: otpRecord.id },
    });

    // 6. Issue a new access token and refresh token
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

    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day refresh token

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: expiresAt,
        device: 'unknown', // You might get this from the request headers
      },
    });

    // 7. Return the tokens to the client
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return res.status(200).json({
      message: 'Account successfully activated and logged in.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        wardId: user.wardId,
        phoneNumber: user.phoneNumber
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }

}
