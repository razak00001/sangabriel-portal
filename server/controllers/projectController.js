const Project = require('../models/Project');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { createNotification } = require('../utils/notificationService');
const { sendEmail } = require('../utils/emailService');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  const { title, description, customerType, customerId, newCustomerName, newCustomerEmail } = req.body;
  
  let finalCustomerId = null;
  let clientNameStr = '';

  if (customerType === 'new') {
    if (!newCustomerName || !newCustomerEmail) {
      return next(new ErrorResponse('Please provide name and email for the new customer', 400));
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email: newCustomerEmail });
    if (existingUser) {
      return next(new ErrorResponse('A user with this email already exists', 400));
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 char temp password

    const user = await User.create({
      name: newCustomerName,
      email: newCustomerEmail,
      password: tempPassword,
      role: 'Customer'
    });

    finalCustomerId = user._id;
    clientNameStr = user.name;

    // Send Welcome Email with temporary credentials
    const welcomeHtml = `
      <h1>Welcome to San Gabriel Solutions</h1>
      <p>Hello ${user.name},</p>
      <p>A new project has been created for you. You can log in to our portal to track its progress.</p>
      <p><strong>Login URL:</strong> <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}">San Gabriel Portal</a></p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please log in and change your password as soon as possible.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to San Gabriel Portal - Your Account Details',
        html: welcomeHtml,
        text: `Welcome! Your temp password is: ${tempPassword}`
      });
    } catch (err) {
      console.error('Error sending welcome email:', err);
      // We don't fail the project creation if email fails
    }
  } else if (customerType === 'existing' && customerId) {
    const user = await User.findById(customerId);
    if (!user) {
      return next(new ErrorResponse('Selected customer not found', 404));
    }
    finalCustomerId = user._id;
    clientNameStr = user.name;
  } else {
    // Fallback if just clientName is provided (old way)
    clientNameStr = req.body.clientName;
  }

  const projectData = {
    title,
    description,
    clientName: clientNameStr,
    projectManager: req.user._id,
    milestones: [
      { label: 'Design Approved', completed: false },
      { label: 'Contract Signed', completed: false },
      { label: 'Materials Ordered', completed: false },
      { label: 'Installation Scheduled', completed: false }
    ]
  };

  if (finalCustomerId) {
    projectData.teamMembers = [finalCustomerId];
  }

  const project = new Project(projectData);

  // Auto -> ACTIVE upon assignment
  if (project.designer) {
    project.status = 'ACTIVE';
  }
  await project.save();

  // If we linked a customer, notify them
  if (finalCustomerId) {
    await createNotification({
      recipient: finalCustomerId,
      sender: req.user._id,
      type: 'ASSIGNMENT',
      title: 'New Project Created',
      message: `You have been added to a new project: "${project.title}"`,
      projectId: project._id
    });
  }

  // Log activity
  const log = new ActivityLog({
    projectId: project._id,
    user: req.user._id,
    action: 'Project Created',
    details: { title: project.title }
  });
  await log.save();

  res.status(201).json({
    success: true,
    data: project
  });
});

// Common logic for role-based project query
const getProjectQueryByRole = (user) => {
  if (user.role === 'Admin') return {};
  if (user.role === 'Project Manager') return { projectManager: user._id };
  if (user.role === 'Designer') return { designer: user._id };
  if (user.role === 'Installer') return { installer: user._id };
  if (user.role === 'Customer') return { teamMembers: user._id };
  return { _id: null };
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  const query = getProjectQueryByRole(req.user);

  const projects = await Project.find(query)
    .populate('projectManager designer installer teamMembers')
    .sort({ createdAt: -1 });


  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('projectManager designer installer teamMembers files activityLogs');
  
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Assign team members
// @route   POST /api/projects/:id/assign
// @access  Private
exports.assignTeamMembers = asyncHandler(async (req, res, next) => {
  const { designer, installer, teamMembers } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Only Admin or PM can assign
  if (req.user.role !== 'Admin' && project.projectManager?.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Unauthorized to assign team members', 403));
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
    { new: true, runValidators: true }
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
      type: 'ASSIGNMENT',
      title: 'Assigned to Project',
      message: `You have been assigned to project "${project.title}"`,
      projectId: project._id
    });
  }

  res.status(200).json({
    success: true,
    data: updatedProject
  });
});

// @desc    Toggle milestone progress
// @route   POST /api/projects/:id/milestone
// @access  Private
exports.toggleMilestone = asyncHandler(async (req, res, next) => {
  const { milestoneId } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  const milestone = project.milestones.id(milestoneId);
  if (!milestone) {
    return next(new ErrorResponse('Milestone not found', 404));
  }

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

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private
exports.updateProjectStatus = asyncHandler(async (req, res, next) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse('Project not found', 404));
    }

    const oldStatus = project.status;
    
    // Status transition checks
    project.status = status;
    await project.save();

    // Log activity
    try {
      const log = new ActivityLog({
        projectId: project._id,
        user: req.user._id,
        action: 'Status Updated',
        details: { from: String(oldStatus), to: String(status) }
      });
      await log.save();
    } catch (logError) {
      console.error('Activity log failure (non-blocking):', logError);
    }

    // Notify relevant users
    const recipients = [];
    if (project.projectManager) recipients.push(project.projectManager);
    if (project.designer) recipients.push(project.designer);
    if (project.installer) recipients.push(project.installer);
    if (project.teamMembers && Array.isArray(project.teamMembers)) {
      recipients.push(...project.teamMembers);
    }
    
    // Deduplicate by string ID
    const uniqueRecipientIds = [...new Set(recipients.filter(r => r).map(r => r.toString()))];

    for (const recipientId of uniqueRecipientIds) {
      if (recipientId !== req.user._id.toString()) {
        await createNotification({
          recipient: recipientId,
          sender: req.user._id,
          type: 'STATUS_CHANGE',
          title: 'Project Status Updated',
          message: `Project "${project.title}" status changed to ${status}`,
          projectId: project._id
        }).catch(err => console.error('Notification failure (non-blocking):', err));
      }
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('CRITICAL STATUS UPDATE FAILURE:', error);
    return next(new ErrorResponse(error.message || 'Internal Server Error during status update', 500));
  }
});

// @desc    Auto-archive billed projects after 90 days
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
