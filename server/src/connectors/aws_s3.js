require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};

const s3Server = process.env.AWS_S3_SERVER;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials,
  endpoint: s3Server,
  forcePathStyle: true,
});

function uploadFile(data, fileName, folder) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: folder + "/" + fileName,
      Body: fs.createReadStream(data.path),
      ACL: "public-read",
    };

    s3client
      .send(new PutObjectCommand(params))
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}

module.exports = { uploadFile };
