const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signup, login, logout, deleteAccount } = require('../../src/controllers/authController');

// Mock the models
jest.mock('../../src/models/User', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

jest.mock('../../src/models/Token', () => ({
  create: jest.fn(),
  destroy: jest.fn()
}));

// Get the mocked models
const User = require('../../src/models/User');
const Token = require('../../src/models/Token');

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req;
  let res;
  
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
    
    // Setup req and res objects
    req = {
      body: {},
      headers: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('signup', () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    };

    test('should create a new user successfully', async () => {
      req.body = mockUserData;
      const hashedPassword = 'hashedPassword123';
      
      // Mock user not existing and successful creation
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue({ ...mockUserData, password: hashedPassword });

      await signup(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockUserData.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: hashedPassword
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered',
        user: expect.objectContaining({
          name: mockUserData.name,
          email: mockUserData.email,
          role: mockUserData.role,
          password: hashedPassword
        })
      });
    });

    test('should return 409 if user already exists', async () => {
      req.body = mockUserData;
      User.findOne.mockResolvedValue({ id: 1, ...mockUserData });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
      expect(User.create).not.toHaveBeenCalled();
    });

    test('should return 500 on database error', async () => {
      req.body = mockUserData;
      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      id: 1,
      ...mockCredentials,
      role: 'student'
    };

    test('should login user successfully', async () => {
      req.body = mockCredentials;
      const mockToken = 'mockJWTToken';
      
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);
      Token.create.mockResolvedValue({ token: mockToken });

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockCredentials.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(mockCredentials.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, role: mockUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: mockToken
      });
    });

    test('should return 404 if user not found', async () => {
      req.body = mockCredentials;
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    test('should return 401 if password is invalid', async () => {
      req.body = mockCredentials;
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    test('should logout user successfully', async () => {
      const mockToken = 'Bearer validToken123';
      req.headers.authorization = mockToken;
      Token.destroy.mockResolvedValue(1);

      await logout(req, res);

      expect(Token.destroy).toHaveBeenCalledWith({ where: { token: 'validToken123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });

    test('should return 401 if no token provided', async () => {
      req.headers.authorization = null;

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(Token.destroy).not.toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    test('should delete user account successfully', async () => {
      const mockUser = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };
      req.user = { id: 1 };
      
      User.findByPk.mockResolvedValue(mockUser);
      Token.destroy.mockResolvedValue(true);

      await deleteAccount(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(Token.destroy).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User account deleted successfully' });
    });

    test('should return 404 if user not found', async () => {
      req.user = { id: 999 };
      User.findByPk.mockResolvedValue(null);

      await deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(Token.destroy).not.toHaveBeenCalled();
    });

    test('should return 500 on database error', async () => {
      req.user = { id: 1 };
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      await deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});