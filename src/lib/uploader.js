const multer = require("multer");
const { nanoid } = require("nanoid");

const fileUploader = ({
<<<<<<< HEAD
  destinationFolder = "profile_pictures",
=======
  destinationFolder = "posts",
>>>>>>> 9d8c2003d40579a0d95987d4ce73c7527ccf27b7
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
