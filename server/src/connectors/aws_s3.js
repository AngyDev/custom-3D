require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};

const s3Server = process.env.AWS_S3_SERVER;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3client = new AWS.S3({
  credentials,
  endpoint: s3Server,
  s3ForcePathStyle: true,
});

function uploadFile(data, fileName, folder) {
  return new Promise((resolve, reject) => {
    s3client.upload(
      {
        Bucket: bucketName,
        Key: folder + "/" + fileName,
        Body: fs.createReadStream(data.path),
        ACL: "public-read",
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

module.exports = { uploadFile };
