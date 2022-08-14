import Joi from "joi";

async function usersValidation(req, res, next) {
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
      if (req.path === "/users" || req.path === "/users/") {
        return Joi.object({
          firstname: Joi.string(),
          lastname: Joi.string(),
          is_verified: Joi.bool(),
          email_id: Joi.string(),
          restaurant: Joi.string(),
        });
      } else {
        return Joi.object({
          id: Joi.string().required(),
          hashed_string: Joi.string().required(),
        });
      }
    }
    case "POST": {
      if (req.path === "/owner/login" || req.path === "/owner/login/") {
        return Joi.object({
          email_id: Joi.string().email().required(),
          password: Joi.string().required(),
        });
      } else if (req.path === "/user/login" || req.path === "/user/login/") {
        return Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        });
      } else {
        return Joi.object({
          firstname: Joi.string().required(),
          lastname: Joi.string().required(),
          password: Joi.string().required(),
          is_admin: Joi.bool(),
          role: Joi.string().required(),
          email_id: Joi.string().email(),
          username: Joi.string(),
          restaurant: Joi.string().required(),
        });
      }
    }
    case "PATCH": {
      return Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        password: Joi.string(),
      });
    }
    default: {
      res.status(400).json({ message: "Invalid request method" });
    }
  }
}

export default usersValidation;
