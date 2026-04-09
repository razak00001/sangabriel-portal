const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();

const defaultMilestones = [
  { label: 'Design Approved', completed: false },
  { label: 'Contract Signed', completed: false },
  { label: 'Materials Ordered', completed: false },
  { label: 'Installation Scheduled', completed: false }
];

async function repair() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sangabriel');
    console.log('Connected to MongoDB');

    const projects = await Project.find({ milestones: { $exists: false } });
    console.log(`Found ${projects.length} projects without milestones.`);

    for (const project of projects) {
      project.milestones = defaultMilestones;
      await project.save();
      console.log(`Updated project: ${project.title}`);
    }

    // Also update projects with empty milestones
    const emptyProjects = await Project.find({ milestones: { $size: 0 } });
    console.log(`Found ${emptyProjects.length} projects with empty milestones.`);
    for (const project of emptyProjects) {
       project.milestones = defaultMilestones;
       await project.save();
       console.log(`Updated project: ${project.title}`);
    }

    console.log('Repair complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

repair();
