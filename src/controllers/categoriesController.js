import { Categories, MenuItems } from '../models'

const categoriesController = {
    async get(req, res, next) {
        try {
            const data = await Categories.find(req.query)
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

            const options = { new: true }

            req.body.created_by = 'admin'
            req.body.updated_at = Date.now()

            if (req.body.is_active !== undefined) {
                const categoryData = await Categories.findById(id)
                if (categoryData.length !== 0) {
                    await updateMenuItemsStatus(categoryData, req.body, res)
                } else {
                    next({ message: `Category with ${id} doesn't exists` })
                }
            }

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
    },
}

const updateMenuItemsStatus = (categoryData, requestBody, res) => {
    MenuItems.find(
        { category: categoryData.category },
        (err, menuItemsData) => {
            menuItemsData.map((row) => {
                MenuItems.findByIdAndUpdate(
                    row.id,
                    { is_active: requestBody.is_active },
                    { new: true },
                    (error) => {
                        if (error) {
                            return res.status(500).json({
                                message: `unable to update menu items is_active status`,
                            })
                        }
                    }
                )
            })
        }
    )
}

export default categoriesController