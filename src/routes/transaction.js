const router = require("express").Router();
const controllers = require("../middlewares/controllers");
const TransactionService = require("../services/transaction");
const fileUploder = require("../lib/uploader");
const { authorizedTokenAdmin } = require("../middlewares/authMiddlewareAdmin");
const { authorizedToken } = require("../middlewares/authMiddleware");

router.post(
  "/prescription",
  authorizedToken,
  fileUploder({
    destinationFolder: "prescriptions",
    fileType: "image",
    prefix: "POST",
  }).array("prescriptions"),
  controllers(TransactionService.newTransactionByPrescription)
);
router.get(
  "/",
  authorizedTokenAdmin,
  controllers(TransactionService.getAllTransaction)
);
router.post(
  "/prescription/new-items",
  authorizedTokenAdmin,
  controllers(TransactionService.addTransactionItemsByAdmin)
);
router.get(
  "/user-transaction",
  // authorizedTokenAdmin,
  controllers(TransactionService.getAllUserTransaction)
);
router.post(
  "/create-transaction",
  controllers(TransactionService.createTransaction)
);

module.exports = router;
