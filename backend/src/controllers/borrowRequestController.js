const BorrowRequest = require("../models/BorrowRequest");
const Equipment = require("../models/Equipment");
const User = require("../models/User");

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
    const { userId, equipmentId, borrowDate, returnDate, remarks } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    const request = await BorrowRequest.create({
      userId,
      equipmentId,
      borrowDate,
      returnDate,
      remarks,
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
    const { userId, equipmentId, id, status, returnDate, remarks } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    const request = await BorrowRequest.findByPk(id);
    if (!request) return res.status(404).json({ error: "Borrow request not found" });

    await request.update({ status, returnDate, remarks });
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
