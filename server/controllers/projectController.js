const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

exports.createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      coordinator: req.user._id // Default coordinator is the creator if not specified
    });
    await project.save();

    // Log activity
    const log = new ActivityLog({
      projectId: project._id,
      user: req.user._id,
      action: 'Project Created',
      details: { title: project.title }
    });
    await log.save();

    res.status(201).send(project);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let query = {};
    // Role-based filtering
    if (req.user.role === 'Admin') {
      query = {};
    } else if (req.user.role === 'Project Coordinator') {
      query = { coordinator: req.user._id };
    } else if (req.user.role === 'Designer') {
      query = { designer: req.user._id };
    } else if (req.user.role === 'Installer') {
      query = { installer: req.user._id };
    } else if (req.user.role === 'Customer') {
      query = { teamMembers: req.user._id };
    }

    const projects = await Project.find(query)
      .populate('coordinator designer installer teamMembers')
      .sort({ createdAt: -1 });
    res.send(projects);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('coordinator designer installer teamMembers files activityLogs');
    
    if (!project) {
      return res.status(404).send({ error: 'Project not found' });
    }

    // Role-based visibility check (simplified for now)
    // In a real app, verify if req.user is part of project members
    
    res.send(project);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).send({ error: 'Project not found' });
    }

    const oldStatus = project.status;
    project.status = status;
    await project.save();

    // Log activity
    const log = new ActivityLog({
      projectId: project._id,
      user: req.user._id,
      action: 'Status Updated',
      details: { from: oldStatus, to: status }
    });
    await log.save();

    res.send(project);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
