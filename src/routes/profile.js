const router = require("express").Router();
const fileUploader = require("../lib/uploader");
const { authorizedToken } = require("../middlewares/authMiddleware");
const controllers = require("../middlewares/controllers");
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
router.post("/tambahAl", authorizedToken, controllers(profileService.tambahAlamat));
router.post("/tambahNomorHp", controllers(profileService.tambahNomorHp));
router.post("/tambahJk", controllers(profileService.tambahJk));
router.post("/tambahTl", controllers(profileService.tambahTl));
router.get("/", controllers(profileService.getMyProfile));
router.get("/address", authorizedToken, controllers(profileService.getAddress));
router.get("/address-user", authorizedToken, controllers(profileService.getAddressByUserId));
router.delete("/address/:id/delete", authorizedToken, controllers(profileService.deleteAlamat))

module.exports = router;
