import { Order } from '../models'

const ordersController = {
    async postOrder(req, res) {
        //sanitise using Joi
        const verifiedData = req.body
        if (!verifiedData) {
            return res
                .status(400)
                .json({ success: false, error: 'Missing data' })
        }
        try {
            const newOrder = new Order({
                iterations: [
                    {
                        items: verifiedData.items,
                        accepted_by: verifiedData.accepted_by,
                    },
                ],
                table_no: verifiedData.table_no,
                restaurant_id: verifiedData.restaurant_id,
            })
            const savedOrder = await newOrder.save()
            return res.status(201).json({
                message: 'Order Placed',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Error' })
        }
    },
    async addToOrder(req, res) {
        //sanitise using Joi
        const id = req.params.id
        const verifiedData = req.body
        if (!verifiedData) {
            return res
                .status(400)
                .json({ success: false, error: 'Missing data' })
        }
        try {
            const order = await Order.findById(id)
            if (!order) {
                return res
                    .status(400)
                    .json({ success: false, error: 'Incorrect Order Id' })
            }
            order.iterations.push({
                items: verifiedData.items,
                accepted_by: verifiedData.accepted_by,
            })
            const savedOrder = await order.save()
            return res.status(201).json({
                message: 'Order Placed',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Error' })
        }
    },
    async updateOrder(req, res) {
        //sanitise using Joi
        const id = req.params.id
        const verifiedData = req.body
        if (!verifiedData) {
            return res
                .status(400)
                .json({ success: false, error: 'Missing data' })
        }
        try {
            const order = await Order.findById(id)
            if (!order) {
                return res
                    .status(400)
                    .json({ success: false, error: 'Incorrect Order Id' })
            }
            Object.assign(order, verifiedData)
            const savedOrder = await order.save()
            return res.status(201).json({
                message: 'Order Placed',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Error' })
        }
    },
    async updateIteration(req, res) {
        //sanitise using Joi
        const order_id = req.params.order_id
        const iteration_id = req.params.iteration_id
        const verifiedData = req.body
        if (!verifiedData) {
            return res
                .status(400)
                .json({ success: false, error: 'Missing data' })
        }
        try {
            const order = await Order.findById(order_id)
            if (!order) {
                return res
                    .status(400)
                    .json({ success: false, error: 'Incorrect Order Id' })
            }
            var iteration = await order.iterations.id(iteration_id)
            Object.assign(iteration, verifiedData)
            const savedOrder = await order.save()
            return res.status(201).json({
                message: 'Order Placed',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Error' })
        }
    },
    async getOrders(req, res) {
        try {
            const count = await Order.count()
            let orders = []
            if (req.query.limit && req.query.page) {
                const limit = req.query.limit
                const offset = (req.query.page - 1) * limit
                orders = await Order.find()
                    .populate({
                        path: 'iterations',
                        populate: {
                            path: 'items',
                            populate: {
                                path: 'item_id',
                                model: 'MenuItem',
                            },
                        },
                    })
                    .limit(limit)
                    .skip(offset)
            } else {
                orders = await Order.find().populate({
                    path: 'iterations',
                    populate: {
                        path: 'items',
                        populate: {
                            path: 'item_id',
                            model: 'MenuItem',
                        },
                    },
                })
            }
            res.status(200).json({ status: true, data: orders, total: count })
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Error' })
        }
    },
    async getOrderById(req, res) {
        try {
            const id = req.params.id
            const order = await Order.findById(id).populate({
                path: 'iterations',
                populate: {
                    path: 'items',
                    populate: {
                        path: 'item_id',
                        model: 'MenuItem',
                    },
                },
            })
            res.status(200).json({ status: true, data: order })
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Error' })
        }
    },
    async deleteOrder(req, res, next) {
        try {
            const id = req.params.id
            const order = await Order.findByIdAndDelete(id)
            res.status(200).json({
                message: `Order deleted successfully`,
                status: true,
                data: order,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default ordersController
