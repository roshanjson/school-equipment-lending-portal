const equipmentSearchParamsValidator = require('../../src/middleware/equipmentSearchParamsValidator');

describe('Equipment Search Params Validator', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Setup req, res, and next objects before each test
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('availability validation', () => {
    test('should pass when availability is true', () => {
      // Arrange
      req.query = { availability: 'true' };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should pass when availability is false', () => {
      // Arrange
      req.query = { availability: 'false' };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should fail when availability is invalid', () => {
      // Arrange
      req.query = { availability: 'yes' };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Availability must be 'true' or 'false'"
      });
    });

    test('should pass when availability is undefined', () => {
      // Arrange
      req.query = {};

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('string fields validation', () => {
    const stringFields = ['name', 'category', 'condition'];

    stringFields.forEach(field => {
      test(`should pass when ${field} is a valid string`, () => {
        // Arrange
        req.query = { [field]: 'valid string' };

        // Act
        equipmentSearchParamsValidator(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });

      test(`should pass when ${field} is undefined`, () => {
        // Arrange
        req.query = {};

        // Act
        equipmentSearchParamsValidator(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });

      test(`should fail when ${field} is not a string`, () => {
        // Arrange
        req.query = { [field]: 123 };

        // Act
        equipmentSearchParamsValidator(req, res, next);

        // Assert
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: `${field} must be a string`
        });
      });
    });

    test('should pass with multiple valid string fields', () => {
      // Arrange
      req.query = {
        name: 'Laptop',
        category: 'Electronics',
        condition: 'Good'
      };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('quantity validation', () => {
    test('should pass when quantity is a valid positive integer string', () => {
      // Arrange
      req.query = { quantity: '5' };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should pass when quantity is undefined', () => {
      // Arrange
      req.query = {};

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should fail when quantity is negative', () => {
      // Arrange
      req.query = { quantity: '-1' };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'quantity must be a positive integer'
      });
    });

    test('should fail when quantity is not a number', () => {
      // Arrange
      req.query = { quantity: 'abc' };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'quantity must be a positive integer'
      });
    });
  });

  describe('combined validations', () => {
    test('should pass with all valid parameters', () => {
      // Arrange
      req.query = {
        name: 'Laptop',
        category: 'Electronics',
        condition: 'Good',
        quantity: '5',
        availability: 'true'
      };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should pass with no parameters', () => {
      // Arrange
      req.query = {};

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should fail with one invalid parameter among valid ones', () => {
      // Arrange
      req.query = {
        name: 'Laptop',
        category: 'Electronics',
        condition: 123, // Invalid: should be string
        quantity: '5',
        availability: 'true'
      };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'condition must be a string'
      });
    });
  });

  describe('edge cases', () => {
    test('should pass with empty string values', () => {
      // Arrange
      req.query = {
        name: '',
        category: '',
        condition: ''
      };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should pass with zero quantity', () => {
      // Arrange
      req.query = { quantity: '0' };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should handle whitespace in string fields', () => {
      // Arrange
      req.query = {
        name: '  Laptop  ',
        category: ' Electronics ',
        condition: ' Good '
      };

      // Act
      equipmentSearchParamsValidator(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});