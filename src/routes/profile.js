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
router.post("/tambahAl", controllers(profileService.tambahAlamat));
router.post("/tambahNomorHp", controllers(profileService.tambahNomorHp));
router.post("/tambahJk", controllers(profileService.tambahJk));
router.post("/tambahTl", controllers(profileService.tambahTl));
router.get("/", controllers(profileService.getMyProfile));
router.get("/address", controllers(profileService.getAddress));

module.exports = router;
