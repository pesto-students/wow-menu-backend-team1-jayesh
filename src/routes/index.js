import express from "express";
import {
  menuItemsController,
  categoriesController,
  ordersController,
  billsController,
  usersController,
  razorpayController,
} from "../controllers";

import {
  menuItemsValidation,
  categoriesValidation,
  ordersValidation,
  billsValidation,
  usersValidation,
} from "../middlewares/requestValidations";

import { authLocalOwner } from "../../config/auth/ownerPassport";
import { authLocalUser } from "../../config/auth/userPassport";
import { authJwt } from "../middlewares/authorization";

const router = express.Router();

router.get("/menu-items", menuItemsValidation, menuItemsController.get);
router.get(
  "/menu-items/group-by-category",
  menuItemsValidation,
  menuItemsController.groupByCategories,
);
router.get("/menu-items/:id", menuItemsController.getById);
router.post("/menu-items", menuItemsValidation, menuItemsController.post);
router.patch(
  "/menu-items/:id",
  menuItemsValidation,
  menuItemsController.update,
);
router.delete("/menu-items/:id", menuItemsController.delete);

router.get("/categories", categoriesValidation, categoriesController.get);
router.get("/categories/:id", categoriesController.getById);
router.post("/categories", categoriesValidation, categoriesController.post);
router.patch(
  "/categories/:id",
  categoriesValidation,
  categoriesController.update,
);
router.delete("/categories/:id", categoriesController.delete);

router.get("/users", usersValidation, authJwt, usersController.get);
router.get("/verify/mail", usersValidation, usersController.verifyEmail);
router.get("/user/:id", usersController.getById);
router.patch("/user/:id", usersValidation, usersController.update);
router.patch("/owner/:id", usersValidation, usersController.update);
router.delete("/user/:id", usersController.delete);

router.post("/signup", usersValidation, usersController.post);
router.post(
  "/login/owner",
  usersValidation,
  authLocalOwner,
  usersController.authenticate,
);
router.post(
  "/login/user",
  usersValidation,
  authLocalUser,
  usersController.authenticate,
);

router.get("/orders", ordersValidation, ordersController.getOrders);
router.get("/orders/:id", ordersController.getOrderById);
router.post("/orders", ordersValidation, ordersController.postOrder);
router.patch("/orders/:id/add", ordersValidation, ordersController.addToOrder);
router.patch("/orders/:id", ordersValidation, ordersController.updateOrder);
router.patch(
  "/orders/:order_id/iteration/:iteration_id",
  ordersValidation,
  ordersController.updateIteration,
);
router.delete("/orders/:id", ordersController.deleteOrder);

router.get("/bills", billsValidation, billsController.getBills);
router.get("/bills/:id", billsController.getBillById);
router.post("/bills", billsValidation, billsController.postBill);
router.patch("/bills/:id", billsValidation, billsController.updateBill);
router.delete("/bills/:id", billsController.deleteBill);

router.get("/razorpay/:id", razorpayController.getPaymentDetail);
router.post("/razorpay/verify", razorpayController.verify);

export default router;
