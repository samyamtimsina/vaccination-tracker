import { prisma } from '../utils/prisma.js';

export const getMe = (req, res) => {
  if (req.user) {
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
    res.status(200).json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    console.log('role', role);

    // Build the query options based on the `role` query parameter
    const whereClause = role ? { role: role } : {};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
      },
    });

    // Return the list of users
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
export const getWardUsers = async (req, res) => {
  try {
    const { role } = req.query;
    console.log('role', role)
    const wardId = req.user.wardId;

    const whereClause = {
      wardId: wardId,
      ...(role && { role: role }),
    };
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
      },
    });

    // Return the list of users
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // Validate request parameters
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID provided.',
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
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // CastError for invalid IDs will be caught here.
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
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
        message: 'Name and email are required',
      });
    }

    // Email uniqueness check
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use',
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
        createdAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) }, // or just `id` if string UUID
      data: { status }, // Prisma will accept enum string directly
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const disableUser = async (req, res) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const userId = parseInt(req.params.id);
  await prisma.user.update({
    where: { id: userId },
    data: { status: 'DISABLED' },
  });

  await prisma.refreshToken.deleteMany({ where: { userId } });

  res.json({ message: 'User disabled successfully' });
};
