import Joi from "joi";

async function menuItemsValidation(req, res, next) {
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
      if (
        req.path === "/menu-items/group-by-category" ||
        req.path === "/menu-items/group-by-category/"
      ) {
        return Joi.object({
          limit: Joi.number().greater(0),
        });
      } else {
        return Joi.object({
          name: Joi.string(),
          id: Joi.string(),
          category: Joi.string(),
          isAvailable: Joi.bool(),
          isActive: Joi.bool(),
          isVeg: Joi.bool(),
          spicy: Joi.string(),
          pageNo: Joi.number().greater(0),
          limit: Joi.number().greater(0),
        }).and("pageNo", "limit");
      }
    }
    case "POST": {
      return Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        discountedPrice: Joi.number(),
        category: Joi.string().required(),
        isAvailable: Joi.bool(),
        isActive: Joi.bool(),
        isVeg: Joi.bool().required(),
        spicy: Joi.string(),
        imageUrl: Joi.string(),
      });
    }
    case "PATCH": {
      return Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        discountedPrice: Joi.number(),
        category: Joi.string(),
        isAvailable: Joi.bool(),
        isActive: Joi.bool(),
        isVeg: Joi.bool(),
        spicy: Joi.string(),
        imageUrl: Joi.string(),
      });
    }
    default: {
      res.status(400).json({ message: "Invalid request method" });
    }
  }
}

export default menuItemsValidation;
