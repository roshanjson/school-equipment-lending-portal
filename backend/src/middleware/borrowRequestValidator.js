const { body } = require("express-validator");

exports.addBorrowRequestValidator = [
  body("userId")
    .notEmpty().withMessage("userId is required")
    .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),

  body("equipmentId")
    .notEmpty().withMessage("equipmentId is required")
    .isInt({ gt: 0 }).withMessage("equipmentId must be a positive integer"),

  body("quantity")
    .notEmpty().withMessage("quantity is required")
    .isInt({ gt: 0 }).withMessage("equipmentId must be a positive integer"),

  body("borrowDate")
    .notEmpty().withMessage("borrowDate is required")
    .isISO8601().withMessage("borrowDate must be a valid date"),

  body("returnDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("returnDate must be a valid date")
];

exports.updateBorrowRequestValidator = [
  body("status")
    .optional()
    .isIn(["requested", "pending", "approved", "rejected", "returned"])
    .withMessage("Invalid status"),

  body("returnDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("returnDate must be a valid date")
];
