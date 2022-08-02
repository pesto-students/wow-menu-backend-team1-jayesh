import express from 'express'
import { menuItemsController } from '../controllers'

const router = express.Router()

router.get('/menu-items', menuItemsController.get)
router.get('/menu-items/:id', menuItemsController.getById)
router.post('/menu-items', menuItemsController.post)
router.patch('/menu-items/:id', menuItemsController.update)
router.delete('/menu-items/:id', menuItemsController.delete)

export default router
