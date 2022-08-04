import Joi from 'joi'
import { Categories } from '../models'

const categoriesController = {
    async get(req, res, next) {
        const validationSchema = Joi.object({
            restaurant_code: Joi.string().required(),
            category: Joi.string(),
            is_active: Joi.bool(),
        })

        const { error } = await validationSchema.validate(req.query)
        if (error) {
            return next(error)
        }

        try {
            const data = await Categories.find()
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async getById(req, res, next) {
        try {
            const data = await Categories.findById(req.params.id)
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async post(req, res, next) {
        const validationSchema = Joi.object({
            category: Joi.string().required(),
            is_active: Joi.bool(),
            created_by: Joi.string().required(),
            restaurant_code: Joi.number().required(),
        })

        const { error } = await validationSchema.validate(req.body)
        if (error) {
            return next(error)
        }

        const data = new Categories({
            category: req.body.category,
            is_active: req.body.is_active,
            created_by: req.body.created_by,
            restaurant_code: req.body.restaurant_code,
        })

        try {
            await data.save()
            res.status(201).json({
                message: 'Category successfully added',
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
                category: Joi.string(),
                is_active: Joi.bool(),
                created_by: Joi.string()
            })

            const { error } = await validationSchema.validate(req.body)
            if (error) {
                return next(error)
            }

            const options = { new: true }

            const result = await Categories.findByIdAndUpdate(
                id,
                req.body,
                options
            )
            res.status(200).json({
                message: 'Category successfully updated',
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
            const { category } = await Categories.findByIdAndDelete(id)
            res.status(200).json({
                message: `Category ${category} successfully deleted`,
                status: true,
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default categoriesController
