const authorize = require('../../src/middleware/authorizationMiddleware');

describe('Authorization Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Setup req, res, and next objects before each test
    req = {
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Role-based access control', () => {
    test('should allow access when user has the required role', () => {
      // Arrange
      const allowedRoles = ['admin', 'teacher'];
      const middleware = authorize(allowedRoles);
      req.user = { role: 'admin' };

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should allow access when user has one of multiple allowed roles', () => {
      // Arrange
      const allowedRoles = ['admin', 'teacher', 'staff'];
      const middleware = authorize(allowedRoles);
      req.user = { role: 'teacher' };

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should deny access when user role is not in allowed roles', () => {
      // Arrange
      const allowedRoles = ['admin', 'teacher'];
      const middleware = authorize(allowedRoles);
      req.user = { role: 'student' };

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: You don't have permission"
      });
    });
  });

  describe('Authentication validation', () => {
    test('should return 401 when user object is not present', () => {
      // Arrange
      const allowedRoles = ['admin'];
      const middleware = authorize(allowedRoles);
      req.user = null;

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized"
      });
    });

    test('should return 401 when user object is undefined', () => {
      // Arrange
      const allowedRoles = ['admin'];
      const middleware = authorize(allowedRoles);
      req.user = undefined;

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized"
      });
    });
  });

  describe('Edge cases', () => {
    test('should handle empty roles array', () => {
      // Arrange
      const allowedRoles = [];
      const middleware = authorize(allowedRoles);
      req.user = { role: 'admin' };

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: You don't have permission"
      });
    });

    test('should handle case-sensitive role comparison', () => {
      // Arrange
      const allowedRoles = ['Admin', 'Teacher'];
      const middleware = authorize(allowedRoles);
      req.user = { role: 'admin' }; // lowercase role

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: You don't have permission"
      });
    });

    test('should handle user object without role property', () => {
      // Arrange
      const allowedRoles = ['admin'];
      const middleware = authorize(allowedRoles);
      req.user = { id: 1 }; // user object without role

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: You don't have permission"
      });
    });
  });

  describe('Multiple middleware instances', () => {
    test('should work independently with different allowed roles', () => {
      // Arrange
      const adminOnly = authorize(['admin']);
      const teacherOnly = authorize(['teacher']);
      req.user = { role: 'admin' };

      // Act & Assert - Admin middleware
      adminOnly(req, res, next);
      expect(next).toHaveBeenCalled();
      next.mockClear();

      // Act & Assert - Teacher middleware
      teacherOnly(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    test('should handle multiple role combinations', () => {
      // Arrange
      const adminTeacher = authorize(['admin', 'teacher']);
      const staffStudent = authorize(['staff', 'student']);
      req.user = { role: 'teacher' };

      // Act & Assert - Admin/Teacher middleware
      adminTeacher(req, res, next);
      expect(next).toHaveBeenCalled();
      next.mockClear();

      // Act & Assert - Staff/Student middleware
      staffStudent(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});