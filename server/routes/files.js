const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');
const { auth } = require('../middleware/auth');

const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

// S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Multer Setup
let storage;
if (process.env.S3_BUCKET_NAME) {
  storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `projects/${req.body.projectId || 'untagged'}/${Date.now()}-${file.originalname}`);
    }
  });
} else {
  // Fallback to local storage for dev
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });
}

const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), fileController.uploadFile);
router.get('/project/:projectId', auth, fileController.getProjectFiles);
router.delete('/:id', auth, fileController.deleteFile);

module.exports = router;
