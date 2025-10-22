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

    const borrowRequest = await BorrowRequest.findAll({ where });
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

    if (borrowRequests.length !== 0) return res.status(404).json({ error: `Equipment: ${equipment.name} is not available for the dates ${borrowDate} to ${returnDate}` });

    const totalBorrowedQuantity = borrowRequests.reduce((sum, req) => sum + req.quantity, 0);
    console.log(`borrowRequests: ${borrowRequests.length}`)
    console.log(`Total Borrowed Quantity: ${totalBorrowedQuantity}`)
    if (quantity > equipment.quantity - totalBorrowedQuantity)
    {
      return res
        .status(400)
        .json({ error: `Requested number of units of equipment is not available` });
    }

    //const remainingQuantity = equipment.quantity - quantity;
    //await equipment.update({ quantity: remainingQuantity });

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
    const { userId, equipmentId, id, status, returnDate } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    const request = await BorrowRequest.findByPk(id);
    if (!request) return res.status(404).json({ error: "Borrow request not found" });

    await request.update({ status, returnDate});
    res.json({ message: "Borrow request updated", request });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.param;
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
