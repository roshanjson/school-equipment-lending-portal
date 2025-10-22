const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
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

router.get("/", authenticationMiddleware, equipmentSearchParamsValidator, validate, equipmentController.search);
router.post("/", authenticationMiddleware, equipmentValidator, validate, equipmentController.add);
router.patch("/", authenticationMiddleware, equipmentValidator, validate, equipmentController.update);
router.delete("/", authenticationMiddleware, equipmentController.delete);

module.exports = router;