const { body } = require("express-validator");

exports.addBorrowRequestValidator = [
  body("userId")
    .notEmpty().withMessage("userId is required")
    .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),

  body("equipmentId")
    .notEmpty().withMessage("equipmentId is required")
    .isInt({ gt: 0 }).withMessage("equipmentId must be a positive integer"),

  body("borrowDate")
    .notEmpty().withMessage("borrowDate is required")
    .isISO8601().withMessage("borrowDate must be a valid date"),

  body("returnDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("returnDate must be a valid date"),

  body("remarks")
    .optional({ checkFalsy: true })
    .isString().withMessage("remarks must be a string")
    .isLength({ max: 255 }).withMessage("remarks can be up to 255 characters only"),
];

exports.updateBorrowRequestValidator = [
  body("status")
    .optional()
    .isIn(["requested", "pending", "approved", "rejected", "returned"])
    .withMessage("Invalid status"),

  body("returnDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("returnDate must be a valid date"),

  body("remarks")
    .optional({ checkFalsy: true })
    .isString().withMessage("remarks must be a string")
    .isLength({ max: 255 }).withMessage("remarks can be up to 255 characters only"),
];
