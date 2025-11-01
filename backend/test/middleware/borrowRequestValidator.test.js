const { addBorrowRequestValidator, updateBorrowRequestValidator } = require('../../src/middleware/borrowRequestValidator');
const { validationResult } = require('express-validator');

describe('Borrow Request Validator', () => {
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

  // Helper function to run middleware and get validation results
  const runValidation = async (middleware, req) => {
    await Promise.all(middleware.map(validation => validation(req, {}, () => {})));
    return validationResult(req);
  };

  describe('addBorrowRequestValidator', () => {
    test('should pass validation with valid request data', async () => {
      // Arrange
      req.body = {
        userId: 1,
        equipmentId: 2,
        quantity: 3,
        borrowDate: '2025-11-01',
        returnDate: '2025-11-07'
      };

      // Act
      const result = await runValidation(addBorrowRequestValidator, req);

      // Assert
      expect(result.isEmpty()).toBe(true);
    });

    describe('userId validation', () => {
      test('should fail when userId is missing', async () => {
        // Arrange
        req.body = {
          equipmentId: 1,
          quantity: 2,
          borrowDate: '2025-11-01'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('userId is required');
      });

      test('should fail when userId is not a positive integer', async () => {
        // Arrange
        req.body = {
          userId: -1,
          equipmentId: 1,
          quantity: 2,
          borrowDate: '2025-11-01'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('userId must be a positive integer');
      });
    });

    describe('equipmentId validation', () => {
      test('should fail when equipmentId is missing', async () => {
        // Arrange
        req.body = {
          userId: 1,
          quantity: 2,
          borrowDate: '2025-11-01'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('equipmentId is required');
      });

      test('should fail when equipmentId is not a positive integer', async () => {
        // Arrange
        req.body = {
          userId: 1,
          equipmentId: 0,
          quantity: 2,
          borrowDate: '2025-11-01'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('equipmentId must be a positive integer');
      });
    });

    describe('quantity validation', () => {
      test('should fail when quantity is missing', async () => {
        // Arrange
        req.body = {
          userId: 1,
          equipmentId: 2,
          borrowDate: '2025-11-01'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('quantity is required');
      });

      test('should fail when quantity is not a positive integer', async () => {
        // Arrange
        req.body = {
          userId: 1,
          equipmentId: 2,
          quantity: -1,
          borrowDate: '2025-11-01'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('equipmentId must be a positive integer');
      });
    });

    describe('date validation', () => {
      test('should fail when borrowDate is missing', async () => {
        // Arrange
        req.body = {
          userId: 1,
          equipmentId: 2,
          quantity: 3
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('borrowDate is required');
      });

      test('should fail when borrowDate is invalid', async () => {
        // Arrange
        req.body = {
          userId: 1,
          equipmentId: 2,
          quantity: 3,
          borrowDate: 'invalid-date'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('borrowDate must be a valid date');
      });

      test('should fail when returnDate is invalid', async () => {
        // Arrange
        req.body = {
          userId: 1,
          equipmentId: 2,
          quantity: 3,
          borrowDate: '2025-11-01',
          returnDate: 'invalid-date'
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(false);
        expect(result.array()[0].msg).toBe('returnDate must be a valid date');
      });

      test('should pass when returnDate is null', async () => {
        // Arrange
        req.body = {
          userId: 1,
          equipmentId: 2,
          quantity: 3,
          borrowDate: '2025-11-01',
          returnDate: null
        };

        // Act
        const result = await runValidation(addBorrowRequestValidator, req);

        // Assert
        expect(result.isEmpty()).toBe(true);
      });
    });
  });

  describe('updateBorrowRequestValidator', () => {
    test('should pass validation with valid status', async () => {
      // Arrange
      req.body = {
        status: 'approved'
      };

      // Act
      const result = await runValidation(updateBorrowRequestValidator, req);

      // Assert
      expect(result.isEmpty()).toBe(true);
    });

    test('should fail with invalid status', async () => {
      // Arrange
      req.body = {
        status: 'invalid-status'
      };

      // Act
      const result = await runValidation(updateBorrowRequestValidator, req);

      // Assert
      expect(result.isEmpty()).toBe(false);
      expect(result.array()[0].msg).toBe('Invalid status');
    });

    test('should pass with valid returnDate', async () => {
      // Arrange
      req.body = {
        returnDate: '2025-11-07'
      };

      // Act
      const result = await runValidation(updateBorrowRequestValidator, req);

      // Assert
      expect(result.isEmpty()).toBe(true);
    });

    test('should fail with invalid returnDate', async () => {
      // Arrange
      req.body = {
        returnDate: 'invalid-date'
      };

      // Act
      const result = await runValidation(updateBorrowRequestValidator, req);

      // Assert
      expect(result.isEmpty()).toBe(false);
      expect(result.array()[0].msg).toBe('returnDate must be a valid date');
    });

    test('should pass with no optional fields', async () => {
      // Arrange
      req.body = {};

      // Act
      const result = await runValidation(updateBorrowRequestValidator, req);

      // Assert
      expect(result.isEmpty()).toBe(true);
    });

    test('should pass with all valid optional fields', async () => {
      // Arrange
      req.body = {
        status: 'approved',
        returnDate: '2025-11-07'
      };

      // Act
      const result = await runValidation(updateBorrowRequestValidator, req);

      // Assert
      expect(result.isEmpty()).toBe(true);
    });
  });
});