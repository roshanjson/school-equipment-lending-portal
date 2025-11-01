const jwt = require('jsonwebtoken');
const Token = require('../../src/models/Token');
const authMiddleware = require('../../src/middleware/authenticationMiddleware');

// Mock the required modules
jest.mock('jsonwebtoken');
jest.mock('../../src/models/Token', () => ({
  findOne: jest.fn()
}));

describe('Authentication Middleware', () => {
  let req;
  let res;
  let next;

  beforeAll(() => {
    // Set up process.env.JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    // Clean up environment variables
    delete process.env.JWT_SECRET;
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup req, res, and next objects
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should call next() when valid token is provided', async () => {
    // Arrange
    const mockToken = 'valid.jwt.token';
    const mockDecodedToken = { id: 1, role: 'student' };
    req.headers.authorization = `Bearer ${mockToken}`;
    
    jwt.verify.mockReturnValue(mockDecodedToken);
    Token.findOne.mockResolvedValue({ token: mockToken });

    // Act
    await authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    expect(Token.findOne).toHaveBeenCalledWith({ where: { token: mockToken } });
    expect(req.user).toEqual(mockDecodedToken);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should return 401 when no authorization header is provided', async () => {
    // Act
    await authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Access denied. No token provided.' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 when authorization header does not start with Bearer', async () => {
    // Arrange
    req.headers.authorization = 'NotBearer token123';

    // Act
    await authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Access denied. No token provided.' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 when token is not found in database', async () => {
    // Arrange
    const mockToken = 'valid.jwt.token';
    req.headers.authorization = `Bearer ${mockToken}`;
    
    jwt.verify.mockReturnValue({ id: 1 });
    Token.findOne.mockResolvedValue(null);

    // Act
    await authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Token invalid or expired' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 when jwt.verify throws an error', async () => {
    // Arrange
    const mockToken = 'invalid.jwt.token';
    req.headers.authorization = `Bearer ${mockToken}`;
    
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act
    await authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Invalid or expired token' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle database errors gracefully', async () => {
    // Arrange
    const mockToken = 'valid.jwt.token';
    req.headers.authorization = `Bearer ${mockToken}`;
    
    jwt.verify.mockReturnValue({ id: 1 });
    Token.findOne.mockRejectedValue(new Error('Database error'));

    // Act
    await authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Invalid or expired token' 
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should properly extract and verify token from authorization header', async () => {
    // Arrange
    const mockToken = 'valid.jwt.token';
    const mockDecodedToken = { id: 1, role: 'admin' };
    req.headers.authorization = `Bearer ${mockToken}`;
    
    jwt.verify.mockReturnValue(mockDecodedToken);
    Token.findOne.mockResolvedValue({ token: mockToken });

    // Act
    await authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    expect(Token.findOne).toHaveBeenCalledWith({ where: { token: mockToken } });
    expect(req.user).toEqual(mockDecodedToken);
    expect(next).toHaveBeenCalled();
  });
});