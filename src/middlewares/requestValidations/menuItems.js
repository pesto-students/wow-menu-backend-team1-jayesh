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
            if (req.path === '/menu-items/group-by-category' || req.path === '/menu-items/group-by-category/') {
                return Joi.object({
                    restaurant: Joi.string().required(),
                    limit: Joi.number().greater(0)
                })
            }
            else {
                return Joi.object({
                    restaurant: Joi.string().required(),
                    name: Joi.string(),
                    id: Joi.string(),
                    category: Joi.string(),
                    is_available: Joi.bool(),
                    is_active: Joi.bool(),
                    is_veg: Joi.bool(),
                    spicy: Joi.string(),
                    page_no: Joi.number().greater(0),
                    limit: Joi.number().greater(0)
                }).and('page_no', 'limit')
            }
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
                restaurant: Joi.string().required(),
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
                restaurant: Joi.string(),
            })
        }
        default: {
            res.status(400).json({ message: 'Invalid request method' })
        }
    }
}

export default menuItemsValidation
