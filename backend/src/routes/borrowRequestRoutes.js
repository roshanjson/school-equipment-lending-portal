const express = require("express");
const router = express.Router();
const borrowRequestController = require("../controllers/borrowRequestController");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const { addBorrowRequestValidator, updateBorrowRequestValidator } = require("../middleware/borrowRequestValidator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg),
    });
  }
  next();
};

router.get("/", authenticationMiddleware, borrowRequestController.search);
router.post("/", authenticationMiddleware, borrowRequestController.add);
router.patch("/", authenticationMiddleware, borrowRequestController.update);
router.delete("/:id", authenticationMiddleware, borrowRequestController.delete);

module.exports = router;
