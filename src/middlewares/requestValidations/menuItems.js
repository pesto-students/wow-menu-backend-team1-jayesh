import Joi from 'joi'

async function menuItemsValidation(req, res, next) {
    const validationSchema = await getDataSchema(req, res)
    const userInput = req.method === 'GET' ? req.query : req.body
    const { error } = await validationSchema.validate(userInput)
    if (error) {
        return res.status(400).json({ message: error.message })
    }
    next()
}

function getDataSchema(req, res) {
    switch (req.method) {
        case 'GET': {
            return Joi.object({
                restaurant_code: Joi.string().required(),
                _id: Joi.string(),
                category: Joi.string(),
                is_available: Joi.bool(),
                is_active: Joi.bool(),
                is_veg: Joi.bool(),
                spicy: Joi.string(),
            })
        }
        case 'POST': {
            return Joi.object({
                name: Joi.string().required(),
                description: Joi.string().required(),
                price: Joi.number().required(),
                discounted_price: Joi.number(),
                category: Joi.string().required(),
                is_available: Joi.bool(),
                is_active: Joi.bool(),
                is_veg: Joi.bool(),
                spicy: Joi.string(),
                image_url: Joi.string(),
                restaurant_code: Joi.number().required(),
            })
        }
        case 'PATCH': {
            return Joi.object({
                name: Joi.string(),
                description: Joi.string(),
                price: Joi.number(),
                discounted_price: Joi.number(),
                category: Joi.string(),
                is_available: Joi.bool(),
                is_active: Joi.bool(),
                is_veg: Joi.bool(),
                spicy: Joi.string(),
                image_url: Joi.string(),
                restaurant_code: Joi.string().required(),
            })
        }
        default: {
            res.status(400).json({ message: 'Invalid request method' })
        }
    }
}

export default menuItemsValidation
