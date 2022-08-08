import { RestaurantUsers } from '../models'
import hashPasswordUtil from '../utils/hashPasswordUtil'
import HashPasswordUtil from '../utils/hashPasswordUtil'

const restaurantUsersController = {
    async get(req, res, next) {
        try {
            const data = await RestaurantUsers.find(req.query)
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async getById(req, res, next) {
        try {
            const data = await RestaurantUsers.findById(req.params.id)
            res.status(200).json({ status: true, data: data })
        } catch (error) {
            return next(error)
        }
    },

    async post(req, res, next) {
        const data = new RestaurantUsers({
            username: req.body.username,
            password: hashPasswordUtil(req.body.password),
            is_admin: req.body.is_admin,
            role: req.body.role,
            created_by: 'admin',
            restaurant_code: req.body.restaurant_code,
        })

        try {
            await data.save()
            res.status(201).json({
                message: 'User successfully added',
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

            if (typeof req.body.password !== 'undefined') {
                req.body.password = await HashPasswordUtil(req.body.password)
            }

            const result = await RestaurantUsers.findByIdAndUpdate(
                id,
                req.body,
                options
            )
            res.status(200).json({
                message: 'User is updated successfully',
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
            const { username } = await RestaurantUsers.findByIdAndDelete(id)
            res.status(200).json({
                message: `User successfully deleted with name ${username}`,
                status: true,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default restaurantUsersController
