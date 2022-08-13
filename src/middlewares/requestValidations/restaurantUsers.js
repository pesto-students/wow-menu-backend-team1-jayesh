import Joi from "joi";

async function restaurantUsersValidation(req, res, next) {
  const validationSchema = await getDataSchema(req, res);
  const userInput = req.method === "GET" ? req.query : req.body;
  const { error } = await validationSchema.validate(userInput);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}

function getDataSchema(req, res) {
  switch (req.method) {
    case "GET": {
      return Joi.object({
        username: Joi.string(),
        is_admin: Joi.bool(),
        role: Joi.string(),
        created_by: Joi.string(),
        restaurant: Joi.string().required(),
      });
    }
    case "POST": {
      return Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        is_admin: Joi.bool(),
        role: Joi.string().required(),
        restaurant: Joi.string().required(),
        is_active: Joi.bool(),
      });
    }
    case "PATCH": {
      return Joi.object({
        password: Joi.string(),
        is_admin: Joi.bool(),
        role: Joi.string(),
        is_active: Joi.bool(),
      });
    }
    default: {
      res.status(400).json({ message: "Invalid request method" });
    }
  }
}

export default restaurantUsersValidation;
