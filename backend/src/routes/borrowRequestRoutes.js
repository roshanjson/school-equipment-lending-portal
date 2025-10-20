const express = require("express");
const router = express.Router();
const borrowRequestController = require("../controllers/borrowRequestController");
const authMiddleware = require("../middleware/authMiddleware");
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

router.get("/", authMiddleware, borrowRequestController.search);
router.post("/", authMiddleware, borrowRequestController.add);
router.patch("/", authMiddleware, borrowRequestController.update);
router.delete("/:id", authMiddleware, borrowRequestController.delete);

module.exports = router;
