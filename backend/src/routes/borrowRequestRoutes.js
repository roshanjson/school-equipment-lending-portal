const express = require("express");
const router = express.Router();
const borrowRequestController = require("../controllers/borrowRequestController");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
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

router.get("/", authenticationMiddleware, authorizationMiddleware(["student", "staff", "admin"]), borrowRequestController.search);
router.post("/", authenticationMiddleware, authorizationMiddleware(["student", "staff", "admin"]), borrowRequestController.add);
router.patch("/", authenticationMiddleware, authorizationMiddleware(["student", "staff", "admin"]), borrowRequestController.update);
router.patch("/process", authenticationMiddleware, authorizationMiddleware(["staff", "admin"]), borrowRequestController.process);
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(["student", "staff", "admin"]), borrowRequestController.delete);

module.exports = router;
