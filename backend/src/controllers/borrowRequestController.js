const BorrowRequest = require("../models/BorrowRequest");
const Equipment = require("../models/Equipment");
const User = require("../models/User");
const { Op, fn, col, where: sequelizeWhere, literal } = require("sequelize");

exports.search = async (req, res) => {
  try {
    const { userId, equipmentId, status } = req.query;

    const where = {};
    if (userId) where.userId = userId;
    if (equipmentId) where.equipmentId = equipmentId;
    if (status) where.status = status;

    const borrowRequest = await BorrowRequest.findAll({ where,
      include: [
        {
          model: Equipment,
          attributes: ["id", "name", "category", "condition", "quantity"],
        },
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
     });
    res.json(borrowRequest);
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    console.log(req.body)
    const { equipmentId, quantity, borrowDate, returnDate } = req.body;

    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    const borrowRequests = await BorrowRequest.findAll({ 
        where: {
            equipmentId: equipmentId,
            [Op.and]: [
                sequelizeWhere(fn('DATE', col('borrowDate')), { [Op.lte]: returnDate }),
                sequelizeWhere(fn('DATE', col('returnDate')), { [Op.gte]: borrowDate }),
    ]
        }
    });

    const totalBorrowedQuantity = borrowRequests.reduce((sum, req) => sum + req.quantity, 0);
    if (quantity > equipment.quantity - totalBorrowedQuantity)
    {
      return res
        .status(400)
        .json({ error: `Equipment: ${equipment.name} is not available for the dates ${borrowDate} to ${returnDate}` });
    }

    const request = await BorrowRequest.create({
      userId,
      equipmentId,
      quantity,
      borrowDate,
      returnDate,
      status: "requested",
    });

    res.status(201).json({ message: "Borrow request created", request });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { userId, equipmentId, id, quantity, borrowDate, returnDate, status } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    const request = await BorrowRequest.findByPk(id);
    if (!request) return res.status(404).json({ error: "Borrow request not found" });

    await request.update({ quantity, borrowDate, returnDate, status });
    res.json({ message: "Borrow request updated", request });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await BorrowRequest.findByPk(id);
    if (!request) return res.status(404).json({ error: "Borrow request not found" });

    await request.destroy();
    res.json({ message: "Borrow request deleted" });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};
