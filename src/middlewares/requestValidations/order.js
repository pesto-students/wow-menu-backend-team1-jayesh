import Joi from "joi";
async function orderValidation(req, res, next) {
  const validationSchema = await getDataSchema(req, res);
  const userInput = req.method === "GET" ? req.query : req.body;
  const { error } = await validationSchema.validate(userInput);
  if (error) {
    return res
      .status(400)
      .json({ status: false, error: { message: error.message } });
  }
  next();
}

function getDataSchema(req, res) {
  switch (req.method) {
    case "GET": {
      return Joi.object({
        restaurant_id: Joi.string().required(),
        id: Joi.string(),
        page: Joi.number().greater(0),
        limit: Joi.number(),
      }).and("page", "limit");
    }
    case "POST": {
      return Joi.object({
        items: Joi.array()
          .items(
            Joi.object({
              item: Joi.string(),
              quantity: Joi.number(),
            }),
          )
          .required(),
        instruction: Joi.string().allow(""),
        table_no: Joi.number().required(),
        restaurant_id: Joi.string().required(),
      });
    }
    case "PATCH": {
      return Joi.object({
        items: Joi.array().items(
          Joi.object({
            item: Joi.string(),
            quantity: Joi.number(),
          }),
        ),
        instruction: Joi.string().allow(""),
        status: Joi.string(),
        table_no: Joi.number(),
        restaurant_id: Joi.number(),
      });
    }
    case "PUT": {
      res.status(405).json({
        status: false,
        error: { message: "Method Not Allowed" },
      });
      break;
    }
    default: {
      res.status(422).json({
        status: false,
        error: { message: "Invalid request method" },
      });
    }
  }
}

export default orderValidation;
