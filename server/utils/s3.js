const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS with credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

// Filter for allowing only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images are allowed!'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME || 'sangabriel-portal-dev-bucket',
    acl: 'public-read', // Ensure bucket allows public read or manage signed URLs later
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `events/${Date.now().toString()}-${file.originalname}`);
    }
  })
});

const deleteFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME || 'sangabriel-portal-dev-bucket',
    Key: key
  };
  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    return false;
  }
};

module.exports = {
  uploadImage: upload,
  deleteFromS3
};
