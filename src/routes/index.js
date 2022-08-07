import express from 'express'
import {
    menuItemsController,
    categoriesController,
    restaurantUsersController,
} from '../controllers'
import {
    menuItemsValidation,
    categoriesValidation,
    restaurantUsersValidation,
} from '../middlewares/requestValidations'

const router = express.Router()

router.get('/menu-items', menuItemsValidation, menuItemsController.get)
router.get('/menu-items/:id', menuItemsController.getById)
router.post('/menu-items', menuItemsValidation, menuItemsController.post)
router.patch('/menu-items/:id', menuItemsValidation, menuItemsController.update)
router.delete('/menu-items/:id', menuItemsController.delete)

router.get('/categories', categoriesValidation, categoriesController.get)
router.get('/categories/:id', categoriesController.getById)
router.post('/categories', categoriesValidation, categoriesController.post)
router.patch('/categories/:id', categoriesValidation, categoriesController.update)
router.delete('/categories/:id', categoriesController.delete)

router.get('/restaurant-users', restaurantUsersValidation, restaurantUsersController.get)
router.get('/restaurant-users/:id', restaurantUsersController.getById)
router.post('/restaurant-users', restaurantUsersValidation, restaurantUsersController.post)
router.patch('/restaurant-users/:id', restaurantUsersValidation, restaurantUsersController.update)
router.delete('/restaurant-users/:id', restaurantUsersController.delete)

export default router
