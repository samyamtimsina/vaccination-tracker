import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

//Middleware: check JWT
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        wardId: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    //  enforce active
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }
    // if (allowedRoles && !allowedRoles.includes(req.user.role)) {
    //     return res.status(403).json({ message: "Forbidden: Insufficient role" });
    //   }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

//Middleware: check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is ACTIVE
    if (req.user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    // Check if role matches
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Access denied: insufficient role' });
    }

    next();
  };
};
