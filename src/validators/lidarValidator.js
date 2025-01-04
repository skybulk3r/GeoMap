const Joi = require('joi');

const lidarDataSchema = Joi.object({
  flightId: Joi.string().uuid().required(),
  data: Joi.object({
    points: Joi.array().items(
      Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        z: Joi.number().required(),
        intensity: Joi.number()
      })
    ).required(),
    metadata: Joi.object({
      timestamp: Joi.date().iso().required(),
      resolution: Joi.number().positive(),
      sensor: Joi.string()
    }).required()
  }).required()
});

function validateLidarData(req, res, next) {
  const { error } = lidarDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = { validateLidarData };