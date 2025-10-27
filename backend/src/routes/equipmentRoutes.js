const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
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
router.post("/", authenticationMiddleware, authorizationMiddleware(["admin"]), equipmentValidator, validate, equipmentController.add);
router.patch("/", authenticationMiddleware, authorizationMiddleware(["admin"]), equipmentValidator, validate, equipmentController.update);
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(["admin"]), equipmentController.delete);

module.exports = router;