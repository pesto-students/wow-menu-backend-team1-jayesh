import Joi from 'joi'

async function categoriesValidation(req, res, next) {
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
                category: Joi.string(),
                is_active: Joi.bool(),
            })
        }
        case 'POST': {
            return Joi.object({
                category: Joi.string().required(),
                is_active: Joi.bool(),
                restaurant_code: Joi.number().required(),
            })
        }
        case 'PATCH': {
            return Joi.object({
                category: Joi.string(),
                is_active: Joi.bool(),
                restaurant_code: Joi.string().required(),
            })
        }
        default: {
            res.status(400).json({ message: 'Invalid request method' })
        }
    }
}

export default categoriesValidation