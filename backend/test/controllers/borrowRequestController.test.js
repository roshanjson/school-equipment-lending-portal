const { search, add, update, delete: deleteRequest } = require('../../src/controllers/borrowRequestController');
const BorrowRequest = require('../../src/models/BorrowRequest');
const Equipment = require('../../src/models/Equipment');
const User = require('../../src/models/User');
const { Op, fn, col, where: sequelizeWhere } = require('sequelize');

// Mock the models
jest.mock('../../src/models/BorrowRequest', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock('../../src/models/Equipment', () => ({
  findByPk: jest.fn(),
}));

jest.mock('../../src/models/User', () => ({
  findByPk: jest.fn(),
}));

describe('Borrow Request Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup req and res objects
    req = {
      query: {},
      body: {},
      params: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('search', () => {
    const mockBorrowRequests = [
      {
        id: 1,
        userId: 1,
        equipmentId: 1,
        quantity: 2,
        borrowDate: '2025-11-01',
        returnDate: '2025-11-07',
        status: 'requested',
        Equipment: {
          id: 1,
          name: 'Laptop',
          category: 'Electronics',
          condition: 'Good',
          quantity: 5
        },
        User: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'student'
        }
      }
    ];

    test('should return all borrow requests', async () => {
      BorrowRequest.findAll.mockResolvedValue(mockBorrowRequests);

      await search(req, res);

      expect(BorrowRequest.findAll).toHaveBeenCalledWith({
        where: {},
        include: [
          {
            model: Equipment,
            attributes: ['id', 'name', 'category', 'condition', 'quantity'],
          },
          {
            model: User,
            attributes: ['id', 'name', 'email', 'role'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      expect(res.json).toHaveBeenCalledWith(mockBorrowRequests);
    });

    test('should search with query parameters', async () => {
      req.query = {
        userId: '1',
        equipmentId: '1',
        status: 'requested'
      };

      BorrowRequest.findAll.mockResolvedValue([mockBorrowRequests[0]]);

      await search(req, res);

      expect(BorrowRequest.findAll).toHaveBeenCalledWith({
        where: {
          userId: '1',
          equipmentId: '1',
          status: 'requested'
        },
        include: expect.any(Array),
        order: [['createdAt', 'DESC']],
      });
    });

    test('should handle database error', async () => {
      const error = new Error('Database error');
      BorrowRequest.findAll.mockRejectedValue(error);

      await search(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('add', () => {
    const mockRequestData = {
      equipmentId: 1,
      quantity: 2,
      borrowDate: '2025-11-01',
      returnDate: '2025-11-07'
    };

    const mockUser = {
      id: 1,
      name: 'Test User'
    };

    const mockEquipment = {
      id: 1,
      name: 'Laptop',
      quantity: 5
    };

    test('should create borrow request successfully when equipment is available', async () => {
      req.body = mockRequestData;
      req.user = { id: 1 };

      User.findByPk.mockResolvedValue(mockUser);
      Equipment.findByPk.mockResolvedValue(mockEquipment);
      BorrowRequest.findAll.mockResolvedValue([]); // No existing bookings
      BorrowRequest.create.mockResolvedValue({
        ...mockRequestData,
        userId: 1,
        status: 'requested'
      });

      await add(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(Equipment.findByPk).toHaveBeenCalledWith(mockRequestData.equipmentId);
      expect(BorrowRequest.create).toHaveBeenCalledWith({
        ...mockRequestData,
        userId: 1,
        status: 'requested'
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 404 if user not found', async () => {
      req.body = mockRequestData;
      req.user = { id: 999 };

      User.findByPk.mockResolvedValue(null);

      await add(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('should return 404 if equipment not found', async () => {
      req.body = mockRequestData;
      req.user = { id: 1 };

      User.findByPk.mockResolvedValue(mockUser);
      Equipment.findByPk.mockResolvedValue(null);

      await add(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Equipment not found' });
    });

    test('should return 400 if equipment is not available for the dates', async () => {
      req.body = mockRequestData;
      req.user = { id: 1 };

      User.findByPk.mockResolvedValue(mockUser);
      Equipment.findByPk.mockResolvedValue(mockEquipment);
      BorrowRequest.findAll.mockResolvedValue([
        { quantity: 4 } // Existing booking that takes most of the quantity
      ]);

      await add(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: `Equipment: ${mockEquipment.name} is not available for the dates ${mockRequestData.borrowDate} to ${mockRequestData.returnDate}`
      });
    });
  });

  describe('update', () => {
    const mockRequestData = {
      id: 1,
      userId: 1,
      equipmentId: 1,
      quantity: 2,
      borrowDate: '2025-11-01',
      returnDate: '2025-11-07',
      status: 'approved'
    };

    const mockRequest = {
      id: 1,
      update: jest.fn()
    };

    test('should update borrow request successfully', async () => {
      req.body = mockRequestData;

      User.findByPk.mockResolvedValue({ id: 1 });
      Equipment.findByPk.mockResolvedValue({ id: 1 });
      BorrowRequest.findByPk.mockResolvedValue(mockRequest);
      mockRequest.update.mockResolvedValue({ ...mockRequest, ...mockRequestData });

      await update(req, res);

      expect(mockRequest.update).toHaveBeenCalledWith({
        quantity: mockRequestData.quantity,
        borrowDate: mockRequestData.borrowDate,
        returnDate: mockRequestData.returnDate,
        status: mockRequestData.status
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Borrow request updated',
        request: expect.any(Object)
      });
    });

    test('should return 404 if request not found', async () => {
      req.body = mockRequestData;

      User.findByPk.mockResolvedValue({ id: 1 });
      Equipment.findByPk.mockResolvedValue({ id: 1 });
      BorrowRequest.findByPk.mockResolvedValue(null);

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Borrow request not found' });
    });
  });

  describe('delete', () => {
    const mockRequest = {
      id: 1,
      destroy: jest.fn()
    };

    test('should delete borrow request successfully', async () => {
      req.params = { id: 1 };
      
      BorrowRequest.findByPk.mockResolvedValue(mockRequest);
      mockRequest.destroy.mockResolvedValue(true);

      await deleteRequest(req, res);

      expect(BorrowRequest.findByPk).toHaveBeenCalledWith(1);
      expect(mockRequest.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Borrow request deleted' });
    });

    test('should return 404 if request not found', async () => {
      req.params = { id: 999 };
      
      BorrowRequest.findByPk.mockResolvedValue(null);

      await deleteRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Borrow request not found' });
    });

    test('should handle database error', async () => {
      req.params = { id: 1 };
      
      const error = new Error('Database error');
      BorrowRequest.findByPk.mockRejectedValue(error);

      await deleteRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});