import { prisma } from '../utils/prisma.js';

export const getMe = (req, res) => {
  console.log('req.user', req.user)
  if (req.user) {
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      phoneNumber: req.user.phoneNumber,
      status: req.user.status,
      wardId: req.user.wardId

    };
    res.status(200).json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
export const getAllUsers = async (req, res) => {
  try {

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        phoneNumber: true,
        wardId: true,
        status: true,
        email: true,
        Child: true,
        Mother: true,
        createdVaccinationRecords: true,
        administeredVaccinations: true,
        AuditLogs: true,
        createdWeightRecords: true,
        administeredWeightRecords: true,
        verifiedChildren: true,
        createdTDDoses: true,
        administeredTDDoses: true
      }
    });
    res.status(200).json({ users })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
    console.log('error', error)
  }
}
export const getUsers = async (req, res) => {
  console.log('Fetching users with role filter:', req.query.role);
  try {
    const { role } = req.query;

    // Build the query options based on the `role` query parameter
    const whereClause = role ? { role: role } : {};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        role: true,
        wardId: true,
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
  console.log('Fetching ward users for wardId:', req.user.wardId);
  try {
    const { role } = req.query;
    console.log('role', role)
    const wardId = req.user.wardId;

    const whereClause = {
      wardId: wardId,
      ...(role && { role: role }),
      status: 'ACTIVE',
    };
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        role: true,
        wardId: true,
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
    const { name, email, role, status, phoneNumber } = req.body;

    // A more flexible validation approach
    if (!name && !email && !role && !status && !phoneNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields provided for update.',
      });
    }

    // Prepare the data object for the update, only including fields that were provided
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    // Email uniqueness check (still a good idea)
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use.',
        });
      }
    }

    // Perform the update with the dynamic data object
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData, // Now using the flexible updateData object
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true, // Add other fields you want to return
        phoneNumber: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);

    // You can check for specific Prisma errors for more granular responses
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { role } = req.user;

    // Only SUPER_ADMIN can perform this action.
    if (role !== 'SUPER_ADMIN') {
      console.log('Unauthorized attempt to change user status by', role);
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Only allow manual status changes to 'PENDING' or 'DISABLED'.
    const allowedStatuses = ['PENDING', 'DISABLED'];
    if (!allowedStatuses.includes(status)) {
      console.log(!allowedStatuses.includes(status), 'status')
      console.log('Invalid status provided:', status);
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const userId = parseInt(id);

    // Update the user's status.
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    // If the user is being disabled, also delete their refresh tokens.
    if (status === 'DISABLED') {
      await prisma.refreshToken.deleteMany({ where: { userId } });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
