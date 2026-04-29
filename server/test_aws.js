const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

async function testAWS() {
  console.log("Testing AWS Credentials...");
  console.log("Access Key ID:", process.env.AWS_ACCESS_KEY_ID);
  console.log("Bucket:", process.env.S3_BUCKET_NAME);
  
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      MaxKeys: 1
    };
    const data = await s3.listObjectsV2(params).promise();
    console.log("SUCCESS: AWS credentials are valid and bucket is accessible.");
    console.log("Objects:", data.Contents.length);
  } catch (err) {
    console.error("ERROR: Failed to access AWS S3.");
    console.error(err.code, ":", err.message);
  }
}

testAWS();
