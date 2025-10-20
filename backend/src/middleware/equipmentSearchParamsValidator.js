module.exports = (req, res, next) => {
  const { name, category, condition, quantity, availability } = req.query;

  // Validate availability if provided
  if (availability !== undefined) {
    if (availability !== 'true' && availability !== 'false') {
        return res.status(400).json({ error: "Availability must be 'true' or 'false'" });
    }}

  // Validate string fields
  const stringFields = { name, category, condition };
  for (const [key, value] of Object.entries(stringFields)) {
    if (value !== undefined && typeof value !== 'string') {
      return res.status(400).json({ error: `${key} must be a string` });
    }
  }

  // Validate integer fields
  const integerFields = { quantity };
  for (const [key, value] of Object.entries(integerFields)) {
    if (value !== undefined && typeof value !== 'integer' && parseInt(value, 10) >= 0) {
      return res.status(400).json({ error: `${key} must be a positive integer` });
    }
  }

  next();
};
