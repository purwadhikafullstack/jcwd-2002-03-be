const multer = require("multer");
const { nanoid } = require("nanoid");

const fileUploader = ({
  destinationFolder = "posts",
  prefix = "POST",
  fileType = "image",
}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log(file)
      cb(null, `${__dirname}/../public/${destinationFolder}`);
    },
    filename: (req, file, cb) => {
      const fileExtension = file.mimetype.split("/")[1];

      const filename = `${prefix}_${nanoid()}.${fileExtension}`;

      cb(null, filename);
    },
  });

  const uploader = multer({
    storage,
    dest: `${__dirname}/../public/posts`,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split("/")[0] !== fileType) {
        return cb(null, false);
      }

      cb(null, true);
    },
  });

  return uploader;
};

module.exports = fileUploader;
