const equipmentValidator = require('../../src/middleware/equipmentValidator');

describe('Equipment Validator', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Setup req, res, and next objects before each test
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('availability validation', () => {
    test('should pass when availability is "true"', () => {
      // Arrange
      req.body = { availability: 'true' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should pass when availability is "false"', () => {
      // Arrange
      req.body = { availability: 'false' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should fail when availability is invalid', () => {
      // Arrange
      req.body = { availability: 'yes' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Availability must be 'true' or 'false'"
      });
    });

    test('should pass when availability is undefined', () => {
      // Arrange
      req.body = {};

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('condition validation', () => {
    test('should pass when condition is a valid string', () => {
      // Arrange
      req.body = { condition: 'Good' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should pass when condition is undefined', () => {
      // Arrange
      req.body = {};

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should fail when condition is not a string', () => {
      // Arrange
      req.body = { condition: 123 };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'condition must be a string'
      });
    });

    test('should pass with empty string condition', () => {
      // Arrange
      req.body = { condition: '' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('quantity validation', () => {
    test('should pass when quantity is a valid positive integer', () => {
      // Arrange
      req.body = { quantity: '5' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should pass when quantity is zero', () => {
      // Arrange
      req.body = { quantity: '0' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should pass when quantity is undefined', () => {
      // Arrange
      req.body = {};

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should fail when quantity is negative', () => {
      // Arrange
      req.body = { quantity: '-1' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'quantity must be a positive integer'
      });
    });

    test('should fail when quantity is not a number', () => {
      // Arrange
      req.body = { quantity: 'abc' };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'quantity must be a positive integer'
      });
    });
  });

  describe('combined field validation', () => {
    test('should pass with all valid fields', () => {
      // Arrange
      req.body = {
        condition: 'Good',
        quantity: '10',
        availability: 'true'
      };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should pass with no fields', () => {
      // Arrange
      req.body = {};

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should fail with one invalid field among valid ones', () => {
      // Arrange
      req.body = {
        condition: 'Good',
        quantity: '-5', // Invalid
        availability: 'true'
      };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'quantity must be a positive integer'
      });
    });
  });

  describe('edge cases', () => {
    test('should handle whitespace in string fields', () => {
      // Arrange
      req.body = {
        condition: '  Good  ',
        quantity: '5',
        availability: 'true'
      };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should handle null values', () => {
      // Arrange
      req.body = {
        condition: null,
        quantity: null,
        availability: null
      };

      // Act
      equipmentValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});