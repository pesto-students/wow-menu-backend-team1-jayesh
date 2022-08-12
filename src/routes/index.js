import express from 'express'
import {
    menuItemsController,
    categoriesController,
    restaurantUsersController,
    ownersController,
    ordersController,
    billsController,
} from '../controllers'
import {
    menuItemsValidation,
    categoriesValidation,
    restaurantUsersValidation,
    ownersValidation,
    ordersValidation,
    billsValidation,
} from '../middlewares/requestValidations'
import { authLocal } from '../../config/auth/passport'
import { authJwt } from '../middlewares/authorization'

const router = express.Router()

router.get('/menu-items', menuItemsValidation, menuItemsController.get)
router.get('/menu-items/group-by-category', menuItemsValidation, menuItemsController.groupByCategories)
router.get('/menu-items/:id', menuItemsController.getById)
router.post('/menu-items', menuItemsValidation, menuItemsController.post)
router.patch('/menu-items/:id', menuItemsValidation, menuItemsController.update)
router.delete('/menu-items/:id', menuItemsController.delete)

router.get('/categories', categoriesValidation, categoriesController.get)
router.get('/categories/:id', categoriesController.getById)
router.post('/categories', categoriesValidation, categoriesController.post)
router.patch(
    '/categories/:id',
    categoriesValidation,
    categoriesController.update
)
router.delete('/categories/:id', categoriesController.delete)

router.get(
    '/restaurant-users',
    restaurantUsersValidation,
    restaurantUsersController.get
)
router.get('/restaurant-users/:id', restaurantUsersController.getById)
router.post(
    '/restaurant-users',
    restaurantUsersValidation,
    restaurantUsersController.post
)
router.patch(
    '/restaurant-users/:id',
    restaurantUsersValidation,
    restaurantUsersController.update
)
router.delete('/restaurant-users/:id', restaurantUsersController.delete)

router.get('/owners', ownersValidation, authJwt, ownersController.get)
router.get('/verify/mail', ownersValidation, ownersController.verifyEmail)
router.get('/owners/:id', ownersController.getById)
router.post('/owners', ownersValidation, ownersController.post)
router.patch('/owners/:id', ownersValidation, ownersController.update)
router.delete('/owners/:id', ownersController.delete)
router.post('/owner/login', ownersValidation, authLocal, ownersController.authenticate)

router.get('/orders', ordersValidation, ordersController.getOrders)
router.get('/orders/:id', ordersController.getOrderById)
router.post('/orders', ordersValidation, ordersController.postOrder)
router.patch('/orders/:id/add', ordersValidation, ordersController.addToOrder)
router.patch('/orders/:id', ordersValidation, ordersController.updateOrder)
router.patch(
    '/orders/:order_id/iteration/:iteration_id',
    ordersValidation,
    ordersController.updateIteration
)
router.delete('/orders/:id', ordersController.deleteOrder)

router.get('/bills', billsValidation, billsController.getBills)
router.get('/bills/:id', billsController.getBillById)
router.post('/bills', billsValidation, billsController.postBill)
router.patch('/bills/:id', billsValidation, billsController.updateBill)
router.delete('/bills/:id', billsController.deleteBill)

export default router
