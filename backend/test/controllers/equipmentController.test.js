const { search, add, update, delete: deleteEquipment } = require('../../src/controllers/equipmentController');
const Equipment = require('../../src/models/Equipment');
const { Op } = require('sequelize');

// Mock the Equipment model
jest.mock('../../src/models/Equipment', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe('Equipment Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup req and res objects
    req = {
      query: {},
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('search', () => {
    const mockEquipments = [
      { id: 1, name: 'Laptop', category: 'Electronics', condition: 'Good', quantity: 5, availability: true },
      { id: 2, name: 'Projector', category: 'Electronics', condition: 'Fair', quantity: 3, availability: true }
    ];

    test('should return all equipment with quantity > 0', async () => {
      Equipment.findAll.mockResolvedValue(mockEquipments);

      await search(req, res);

      expect(Equipment.findAll).toHaveBeenCalledWith({
        where: { quantity: { [Op.gt]: 0 } }
      });
      expect(res.json).toHaveBeenCalledWith(mockEquipments);
    });

    test('should handle search with query parameters', async () => {
      req.query = {
        name: 'Laptop',
        category: 'Electronics',
        condition: 'Good',
        availability: 'true'
      };

      Equipment.findAll.mockResolvedValue([mockEquipments[0]]);

      await search(req, res);

      expect(Equipment.findAll).toHaveBeenCalledWith({
        where: { quantity: { [Op.gt]: 0 } }
      });
      expect(res.json).toHaveBeenCalledWith([mockEquipments[0]]);
    });

    test('should handle database error', async () => {
      const error = new Error('Database error');
      Equipment.findAll.mockRejectedValue(error);

      await search(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('add', () => {
    const mockEquipment = {
      name: 'Laptop',
      category: 'Electronics',
      condition: 'Good',
      quantity: 5,
      availability: true
    };

    test('should add new equipment successfully', async () => {
      req.body = mockEquipment;
      Equipment.create.mockResolvedValue(mockEquipment);

      await add(req, res);

      expect(Equipment.create).toHaveBeenCalledWith(mockEquipment);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Equipment added',
        equipment: mockEquipment
      });
    });

    test('should handle database error when adding equipment', async () => {
      req.body = mockEquipment;
      const error = new Error('Database error');
      Equipment.create.mockRejectedValue(error);

      await add(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    const mockEquipment = {
      id: 1,
      condition: 'Fair',
      quantity: 4,
      availability: true,
      update: jest.fn()
    };

    test('should update equipment successfully', async () => {
      req.body = {
        id: 1,
        condition: 'Fair',
        quantity: 4,
        availability: true
      };

      Equipment.findByPk.mockResolvedValue(mockEquipment);
      mockEquipment.update.mockResolvedValue(mockEquipment);

      await update(req, res);

      expect(Equipment.findByPk).toHaveBeenCalledWith(1);
      expect(mockEquipment.update).toHaveBeenCalledWith({
        condition: 'Fair',
        quantity: 4,
        availability: true
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Equipment updated',
        equipment: mockEquipment
      });
    });

    test('should return 404 if equipment not found', async () => {
      req.body = { id: 999 };
      Equipment.findByPk.mockResolvedValue(null);

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Equipment not found' });
    });

    test('should handle database error when updating', async () => {
      req.body = { id: 1 };
      const error = new Error('Database error');
      Equipment.findByPk.mockRejectedValue(error);

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('delete', () => {
    const mockEquipment = {
      id: 1,
      destroy: jest.fn()
    };

    test('should delete equipment successfully', async () => {
      req.params = { id: 1 };
      Equipment.findByPk.mockResolvedValue(mockEquipment);
      mockEquipment.destroy.mockResolvedValue(true);

      await deleteEquipment(req, res);

      expect(Equipment.findByPk).toHaveBeenCalledWith(1);
      expect(mockEquipment.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipment deleted' });
    });

    test('should return 404 if equipment not found', async () => {
      req.params = { id: 999 };
      Equipment.findByPk.mockResolvedValue(null);

      await deleteEquipment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Equipment not found' });
    });

    test('should handle database error when deleting', async () => {
      req.params = { id: 1 };
      const error = new Error('Database error');
      Equipment.findByPk.mockRejectedValue(error);

      await deleteEquipment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});