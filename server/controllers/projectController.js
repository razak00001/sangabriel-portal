const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const { createNotification } = require('../utils/notificationService');

exports.createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      projectManager: req.user._id,
      milestones: [
        { label: 'Design Approved', completed: false },
        { label: 'Contract Signed', completed: false },
        { label: 'Materials Ordered', completed: false },
        { label: 'Installation Scheduled', completed: false }
      ]
    });

    // Auto -> ACTIVE upon assignment
    if (project.designer) {
      project.status = 'ACTIVE';
    }
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
    } else if (req.user.role === 'Project Manager') {
      query = { projectManager: req.user._id };
    } else if (req.user.role === 'Designer') {
      query = { designer: req.user._id };
    } else if (req.user.role === 'Installer') {
      query = { installer: req.user._id };
    } else if (req.user.role === 'Customer') {
      query = { teamMembers: req.user._id };
    }

    const projects = await Project.find(query)
      .populate('projectManager designer installer teamMembers')
      .sort({ createdAt: -1 });
    res.send(projects);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('projectManager designer installer teamMembers files activityLogs');
    
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

exports.assignTeamMembers = async (req, res) => {
  try {
    const { designer, installer, teamMembers } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).send({ error: 'Project not found' });

    // Only Admin or PM can assign
    if (req.user.role !== 'Admin' && project.projectManager?.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Unauthorized to assign team members' });
    }

    const updates = {};
    if (designer) updates.designer = designer;
    if (installer) updates.installer = installer;
    if (teamMembers) updates.teamMembers = teamMembers;

    // Transition to ACTIVE if designer is assigned for the first time
    if (designer && !project.designer && project.status === 'DRAFT') {
      updates.status = 'ACTIVE';
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate('projectManager designer installer teamMembers');

    // Activity Log
    const log = new ActivityLog({
      projectId: project._id,
      user: req.user._id,
      action: 'Team Assigned',
      details: updates
    });
    await log.save();

    // Notify assigned users
    const newMembers = [designer, installer, ...(teamMembers || [])].filter(id => id && id.toString() !== req.user._id.toString());
    for (const memberId of newMembers) {
      await createNotification({
        recipient: memberId,
        sender: req.user._id,
        type: 'PROJECT_ASSIGNED',
        title: 'Assigned to Project',
        message: `You have been assigned to project "${project.title}"`,
        projectId: project._id
      });
    }

    res.send(updatedProject);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.toggleMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).send({ error: 'Project not found' });

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) return res.status(404).send({ error: 'Milestone not found' });

    milestone.completed = !milestone.completed;
    await project.save();

    // Log activity
    const log = new ActivityLog({
      projectId: project._id,
      user: req.user._id,
      action: 'Milestone Updated',
      details: { label: milestone.label, completed: milestone.completed }
    });
    await log.save();

    res.send(project);
  } catch (error) {
    res.status(400).send({ error: error.message });
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
    
    // Status transition rules
    const allowedTransitions = {
      'DRAFT': ['ACTIVE'],
      'ACTIVE': ['IN PROGRESS'],
      'IN PROGRESS': ['PENDING REVIEW'],
      'PENDING REVIEW': ['REVISION REQUESTED', 'COMPLETE'],
      'REVISION REQUESTED': ['IN PROGRESS'],
      'COMPLETE': ['BILLED'],
      'BILLED': ['ARCHIVED'],
      'ARCHIVED': []
    };

    if (!allowedTransitions[oldStatus].includes(status)) {
      // Allow Admin to override if needed, otherwise block
      if (req.user.role !== 'Admin') {
        return res.status(400).send({ error: `Invalid transition from ${oldStatus} to ${status}` });
      }
    }

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

    // Notify relevant users (Designer, Installer, Customer)
    const recipients = [];
    if (project.designer) recipients.push(project.designer);
    if (project.installer) recipients.push(project.installer);
    if (project.teamMembers) recipients.push(...project.teamMembers);
    
    for (const recipient of [...new Set(recipients)]) {
      if (recipient.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient,
          sender: req.user._id,
          type: 'STATUS_CHANGE',
          title: 'Project Status Updated',
          message: `Project "${project.title}" status changed to ${status}`,
          projectId: project._id
        });
      }
    }

    res.send(project);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.autoArchiveProjects = async () => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await Project.updateMany(
      { 
        status: 'BILLED', 
        updatedAt: { $lte: ninetyDaysAgo } 
      },
      { 
        status: 'ARCHIVED',
        archivedAt: new Date()
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Auto-archived ${result.modifiedCount} projects.`);
    }
  } catch (error) {
    console.error('Error auto-archiving projects:', error);
  }
};
