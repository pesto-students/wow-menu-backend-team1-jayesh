import express from 'express'
import {
    menuItemsController,
    categoriesController,
    restaurantUsersController,
} from '../controllers'

const router = express.Router()

router.get('/menu-items', menuItemsController.get)
router.get('/menu-items/:id', menuItemsController.getById)
router.post('/menu-items', menuItemsController.post)
router.patch('/menu-items/:id', menuItemsController.update)
router.delete('/menu-items/:id', menuItemsController.delete)

router.get('/categories', categoriesController.get)
router.get('/categories/:id', categoriesController.getById)
router.post('/categories', categoriesController.post)
router.patch('/categories/:id', categoriesController.update)
router.delete('/categories/:id', categoriesController.delete)

router.get('/restaurant-users', restaurantUsersController.get)
router.get('/restaurant-users/:id', restaurantUsersController.getById)
router.post('/restaurant-users', restaurantUsersController.post)
router.patch('/restaurant-users/:id', restaurantUsersController.update)
router.delete('/restaurant-users/:id', restaurantUsersController.delete)

export default router
