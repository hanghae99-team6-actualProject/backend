const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const env = require('../env')

const s3 = new aws.S3({
  accessKeyId: env.AWS_S3_KEY,
  secretAccessKey: env.AWS_S3_PRIVATE_KEY,
  region: "ap-northeast-2"
});

const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "mingijuk/avatar"
  }),
  limits: {
    fileSize: 1000 * 1000 * 10
  }
});
const uploadAvatar = multerAvatar.single("formData");

module.exports = { uploadAvatar }

