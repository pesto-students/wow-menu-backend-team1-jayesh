import { Order } from '../models'

const ordersController = {
    async getOrders(req, res) {
        try {
            let orders
            if (req.query.limit) {
                const { page, limit } = req.query
                orders = await Order.find(req.query)
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
                    .skip((page - 1) * limit)
            } else {
                orders = await Order.find(req.query).populate({
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
            res.status(200).json({ status: true, data: orders })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message },
            })
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
            if (!order)
                return res.status(404).json({
                    success: false,
                    error: { message: 'Order Not Found' },
                })
            res.status(200).json({ status: true, data: order })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message },
            })
        }
    },
    async postOrder(req, res) {
        try {
            const newOrder = new Order({
                iterations: [
                    {
                        items: req.body.items,
                        accepted_by: req.body.accepted_by,
                    },
                ],
                table_no: req.body.table_no,
                restaurant_id: req.body.restaurant_id,
            })
            const savedOrder = await newOrder.save()
            return res.status(201).json({
                message: 'Order saved successfully',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message },
            })
        }
    },
    async addToOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id)
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Order Not Found' },
                })
            }
            order.iterations.push({
                items: req.body.items,
                accepted_by: req.body.accepted_by,
            })
            const savedOrder = await order.save()
            return res.status(201).json({
                message: 'Order Updated successfully',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message },
            })
        }
    },
    async updateOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id)
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Order Not Found' },
                })
            }
            Object.assign(order, req.body)
            const savedOrder = await order.save()
            return res.status(201).json({
                message: 'Order Updated successfully',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message },
            })
        }
    },
    async updateIteration(req, res) {
        //sanitise using Joi
        const order_id = req.params.order_id
        const iteration_id = req.params.iteration_id
        const data = req.body
        if (!data) {
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
            Object.assign(iteration, data)
            const savedOrder = await order.save()
            return res.status(201).json({
                message: 'Order Iteration updated successfully',
                status: true,
                data: savedOrder,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message },
            })
        }
    },
    async deleteOrder(req, res) {
        try {
            const id = req.params.id
            const order = await Order.findByIdAndDelete(id)
            res.status(200).json({
                message: `Order deleted successfully`,
                status: true,
                data: order,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message },
            })
        }
    },
}

export default ordersController
