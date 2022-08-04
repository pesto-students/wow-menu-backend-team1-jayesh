import Joi from 'joi'
import { MenuItems } from '../models'

const menuItemsController = {
    async get(req, res, next) {
        const validationSchema = Joi.object({
            restaurant_code: Joi.string().required(),
            category: Joi.string(),
            is_available: Joi.bool(),
            is_active: Joi.bool(),
            is_veg: Joi.bool(),
            spicy: Joi.string(),
        })

        const { error } = await validationSchema.validate(req.query)
        if (error) {
            return next(error)
        }

        try {
            const data = await MenuItems.find()
            let finalData = {}
            let key = '';
            for(let i = 0; i < data.length; i++) {
                key = data[i]['category']
                if(key in finalData) {
                    finalData[key].push(data[i])
                }
                else {
                    finalData[key] = [data[i]]
                }
            }
            res.status(200).json({ status: true, data: finalData })
        } catch (error) {
            return next(error)
        }
    },

    async getById(req, res, next) {
        try {
            const data = await MenuItems.findById(req.params.id)
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async post(req, res, next) {
        const validationSchema = Joi.object({
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
            restaurant_code: Joi.number().required()
        })

        const { error } = await validationSchema.validate(req.body)
        if (error) {
            return next(error)
        }

        const data = new MenuItems({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discounted_price: req.body.discounted_price,
            category: req.body.category,
            is_available: req.body.is_available,
            is_active: req.body.is_active,
            is_veg: req.body.is_veg,
            spicy: req.body.spicy,
            image_url: req.body.image_url,
            created_by: 'admin', //todo get the created_by through the token
            restaurant_code: req.body.restaurant_code,
        })

        try {
            await data.save()
            res.status(201).json({
                message: 'Menu item successfully added',
                status: true,
                data: req.body,
            })
        } catch (error) {
            return next(error)
        }
    },

    async update(req, res, next) {
        try {
            const id = req.params.id
            const validationSchema = Joi.object({
                name: Joi.string(),
                description: Joi.string(),
                price: Joi.number(),
                discounted_price: Joi.number(),
                category: Joi.string(),
                is_available: Joi.bool(),
                is_active: Joi.bool(),
                is_veg: Joi.bool(),
                spicy: Joi.string(),
                image_url: Joi.string()
            })

            const { error } = await validationSchema.validate(req.body)
            if (error) {
                return next(error)
            }

            const options = { new: true }

            req.body.created_by = 'admin'  //todo get the created_by through the token

            const result = await MenuItems.findByIdAndUpdate(
                id,
                req.body,
                options
            )
            res.status(200).json({
                message: 'Menu item is updated successfully',
                status: true,
                data: result,
            })
        } catch (error) {
            return next(error)
        }
    },

    async delete(req, res, next) {
        try {
            const id = req.params.id
            const { name } = await MenuItems.findByIdAndDelete(id)
            res.status(200).json({
                message: `Menu item successfully deleted with name ${name}`,
                status: true,
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default menuItemsController
