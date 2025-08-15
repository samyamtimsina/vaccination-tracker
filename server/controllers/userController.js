
import { prisma } from '../utils/prisma.js';

export const getMe = (req, res) => {
  console.log('called getMe');
  if (req.user) {
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
    res.json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


export const getUserProfile = async (req, res) => {
    console.log('called getUserProfile');

    try {
        // Validate request parameters
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID provided.'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                wardId: true,
                // Removed the stats for children and vaccination records.
            }
        });

        if (!user) {
            console.log(`User with ID ${userId} not found.`);
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        console.log('User profile fetched successfully.');
        res.status(200).json({
            status: 'success',
            data: user
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        console.log('error',error)
        // CastError for invalid IDs will be caught here.
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};




export const updateUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { name, email } = req.body; // Only updatable fields in your schema

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and email are required'
      });
    }

    // Email uniqueness check
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email }, // Only these fields can be updated
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};