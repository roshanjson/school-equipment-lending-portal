const Equipment = require("../models/Equipment");
const { Op } = require("sequelize");

exports.search = async (req, res) => {
  try {
    const { name, category, condition, availability } = req.query;

    const where = {};
    if (name) where.name = name;
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (availability !== undefined) where.availability = availability === 'true';

    const equipments = await Equipment.findAll({ where: { quantity: { [Op.gt]: 0 }} });
    res.json(equipments);
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const { name, category, condition, quantity, availability } = req.body;
    const equipment = await Equipment.create({name, category, condition, quantity, availability: availability ?? true});
    res.status(201).json({ message: "Equipment added", equipment });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.query;
    const equipment = await Equipment.findByPk(id);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    const { condition, quantity, availability } = req.body;
    await equipment.update({ condition, quantity, availability });
    res.json({ message: "Equipment updated", equipment });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.query;
    const equipment = await Equipment.findByPk(id);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });

    await equipment.destroy();
    res.json({ message: "Equipment deleted" });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
};