const User = require('../models/User');

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query, 'name email role status');
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
