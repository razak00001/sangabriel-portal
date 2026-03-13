const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Only Admin can create other Admins/Coordinators/etc.
    // In a real scenario, we'd have a check here.
    // For now, allow registration for demonstration purposes.
    
    const user = new User({ name, email, password, role });
    await user.save();
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    
    if (user.status !== 'Active') {
      return res.status(401).send({ error: 'Account is deactivated' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.send(req.user);
};
