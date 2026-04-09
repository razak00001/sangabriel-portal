const Project = require('../models/Project');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

exports.getJobVolume = async (req, res) => {
  try {
    const volume = await Project.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.send(volume);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getStatusDistribution = async (req, res) => {
  try {
    const distribution = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    res.send(distribution);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getUserActivity = async (req, res) => {
  try {
    const activity = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          name: "$userInfo.name",
          role: "$userInfo.role",
          count: 1
        }
      }
    ]);
    res.send(activity);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
