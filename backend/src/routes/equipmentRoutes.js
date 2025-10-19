const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const equipmentSearchParamsValidator = require("../middleware/equipmentSearchParamsValidator");
const equipmentValidator = require("../middleware/equipmentValidator");
const equipmentController = require("../controllers/equipmentController");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg),
    });
  }
  next();
};

router.get("/", authMiddleware, equipmentSearchParamsValidator, validate, equipmentController.search);
router.post("/", authMiddleware, equipmentValidator, validate, equipmentController.add);
router.patch("/", authMiddleware, equipmentValidator, validate, equipmentController.update);
router.delete("/", authMiddleware, equipmentController.delete);

module.exports = router;