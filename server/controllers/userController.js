const User = require('../models/User');

// Get all users or filter by role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    
    let query = {};
    
    // If role is specified, filter by role
    if (role) {
      query.role = role;
    }
    
    // Role-based access control
    if (req.user.role === 'Admin') {
      // Admin can see all users
    } else if (req.user.role === 'Project Manager') {
      // PM can see all users
    } else if (req.user.role === 'Accounting') {
      // Accounting can see all users (read-only)
    } else {
      // Others can only see themselves
      query._id = req.user._id;
    }
    
    const users = await User.find(query)
      .select('-password') // Don't send passwords
      .sort({ createdAt: -1 });
    
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    
    // Check permissions
    if (req.user.role !== 'Admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).send({ error: 'Access denied' });
    }
    
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    
    // Only Admin can update users
    if (req.user.role !== 'Admin') {
      return res.status(403).send({ error: 'Only admins can update users' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    
    await user.save();
    
    // Return user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Only Admin can delete users
    if (req.user.role !== 'Admin') {
      return res.status(403).send({ error: 'Only admins can delete users' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    
    // Prevent deleting yourself
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).send({ error: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Toggle user status (Active/Inactive)
exports.toggleUserStatus = async (req, res) => {
  try {
    // Only Admin can toggle status
    if (req.user.role !== 'Admin') {
      return res.status(403).send({ error: 'Only admins can change user status' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    
    // Toggle status
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();
    
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const inactiveUsers = await User.countDocuments({ status: 'Inactive' });
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.send({
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole: usersByRole
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
