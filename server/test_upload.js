const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

async function testUpload() {
  console.log("Testing AWS Upload without ACL...");
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `test/test-upload-${Date.now()}.txt`,
      Body: 'Hello world'
      // No ACL defined
    };
    await s3.upload(params).promise();
    console.log("SUCCESS: Upload worked perfectly.");
  } catch (err) {
    console.error("ERROR: Upload failed.");
    console.error(err.code, ":", err.message);
  }
}

testUpload();
