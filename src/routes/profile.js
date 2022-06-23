const router = require("express").Router();
const fileUploader = require("../lib/uploader");
const controllers = require("../middleware/controllers");
const profileService = require("../services/profile");
router.post("/edit-nama", controllers(profileService.editNama));
router.post(
  "/edit-profilepicture",
  fileUploader({
    destinationFolder: "profile_pictures",
    fileType: "image",
    prefix: "POST",
  }).single("update_image_file"),
  controllers(profileService.editProfilePicture)
);
router.post("/tambahJk", controllers(profileService.tambahJk));
router.post("/tambahTl", controllers(profileService.tambahTl));
router.get("/", controllers(profileService.getMyProfile));

module.exports = router;
