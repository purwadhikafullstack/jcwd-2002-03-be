const router = require("express").Router();
const controllers = require("../middlewares/controllers");
const TransactionService = require("../services/transaction");
const fileUploder = require("../lib/uploader");
const { authorizedTokenAdmin } = require("../middlewares/authMiddlewareAdmin");
const { authorizedToken } = require("../middlewares/authMiddleware");
const { rejectTransaction } = require("../services/transaction");

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
  authorizedToken,
  controllers(TransactionService.getAllUserTransaction)
);
router.post(
  "/create-transaction",
  authorizedToken,
  controllers(TransactionService.createTransaction)
);
router.patch(
  "/:TransactionId/transaction-status",
  authorizedTokenAdmin,
  controllers(TransactionService.approveTransaction)
);

router.patch("/reject/exp-date", authorizedToken, controllers(TransactionService.rejectTransactionAutomaticByUserId))
module.exports = router;
