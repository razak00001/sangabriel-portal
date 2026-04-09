const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const Message = require('../models/Message');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let projectQuery = {};
    if (role === 'Project Manager') projectQuery = { projectManager: userId };
    else if (role === 'Designer') projectQuery = { designer: userId };
    else if (role === 'Installer') projectQuery = { installer: userId };
    else if (role === 'Customer') projectQuery = { teamMembers: userId };

    const activeProjects = await Project.countDocuments({ ...projectQuery, status: { $nin: ['COMPLETE', 'BILLED', 'ARCHIVED'] } });
    const inProgress = await Project.countDocuments({ ...projectQuery, status: 'IN PROGRESS' });
    const completed = await Project.countDocuments({ ...projectQuery, status: 'COMPLETE' });
    
    // Simple message count for now
    const messages = await Message.countDocuments({ 
      projectId: { $in: await Project.find(projectQuery).distinct('_id') } 
    });

    res.send([
      { name: 'Active Projects', value: activeProjects.toString(), icon: 'FolderKanban', color: 'var(--primary)' },
      { name: 'In Progress', value: inProgress.toString(), icon: 'Clock', color: 'var(--secondary)' },
      { name: 'Completed', value: completed.toString(), icon: 'CheckCircle2', color: '#10b981' },
      { name: 'Messages', value: messages.toString(), icon: 'MessageCircle', color: '#f59e0b' },
    ]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    // Get project IDs accessible to the user
    const projects = await Project.find(
      req.user.role === 'Admin' ? {} : 
      { $or: [
        { projectManager: userId }, 
        { designer: userId }, 
        { installer: userId }, 
        { teamMembers: userId }
      ]}
    ).distinct('_id');

    const activity = await ActivityLog.find({ projectId: { $in: projects } })
      .populate('user', 'name')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.send(activity);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getRecentProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    let query = {};
    if (req.user.role === 'Admin') query = {};
    else if (req.user.role === 'Project Manager') query = { projectManager: userId };
    else if (req.user.role === 'Designer') query = { designer: userId };
    else if (req.user.role === 'Installer') query = { installer: userId };
    else if (req.user.role === 'Customer') query = { teamMembers: userId };

    const projects = await Project.find(query)
      .populate('projectManager designer installer')
      .sort({ updatedAt: -1 })
      .limit(5);
    
    res.send(projects);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
