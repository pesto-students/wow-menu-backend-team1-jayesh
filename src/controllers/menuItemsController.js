import { MenuItems, Categories } from '../models'

const menuItemsController = {
    async get(req, res, next) {
        try {
            let data
            if (req.query.limit) {
                const {page_no, limit} = req.query
                data = await MenuItems.find(req.query).skip((page_no - 1) * limit).limit(limit)
            }
            else {
                data = await MenuItems.find(req.query)
            }
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async groupByCategories(req, res, next) {
        try {
            let limit = 5
            if (req.query.limit !== undefined) {
                limit = req.query.limit
            }
            const menuItemsData = await MenuItems.find()
            let result = {}
            for (let i = 0; i < menuItemsData.length; i++) {
                const val = menuItemsData[i]
                const category = val.category
                if (result[category] === undefined) {
                    result[category] = []
                    result[category].push(val)
                }
                else {
                    const categoryData = result[category]
                    if (categoryData.length < limit) {
                        result[val.category].push(val)
                    }
                }

                if (i === (menuItemsData.length -1)) {
                    res.status(200).json({ status: true, data: result })
                }
            }
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
        await addCategories(req)

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

            req.body.created_by = 'admin'

            req.body.category !== undefined && (await addCategories(req))
            req.body.updated_at = Date.now()

            const result = await MenuItems.findByIdAndUpdate(id, req.body, {
                new: true,
            })
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
    },
}

const addCategories = async (req) => {
    const categoriesData = await Categories.find({
        category: req.body.category,
    })
    if (categoriesData.length === 0) {
        const data = new Categories({
            category: req.body.category,
            created_by: 'admin',
            restaurant_code: req.body.restaurant_code,
        })
        await data.save()
    }
}

export default menuItemsController
