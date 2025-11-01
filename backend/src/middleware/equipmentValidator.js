module.exports = (req, res, next) => {
  const { condition, quantity, availability } = req.body;

  // Validate availability if provided and not null
  if (availability !== undefined && availability !== null) {
    if (availability !== 'true' && availability !== 'false') {
        return res.status(400).json({ error: "Availability must be 'true' or 'false'" });
    }}

  // Validate string fields
  const stringFields = { condition };
  for (const [key, value] of Object.entries(stringFields)) {
    if (value !== undefined && value !== null && typeof value !== 'string') {
      return res.status(400).json({ error: `${key} must be a string` });
    }
  }

  // Validate integer fields
  const integerFields = { quantity };
  for (const [key, value] of Object.entries(integerFields)) {
    if (value !== undefined && value !== null) {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue) || parsedValue < 0) {
        return res.status(400).json({ error: `${key} must be a positive integer` });
      }
    }
  }

  next();
};
