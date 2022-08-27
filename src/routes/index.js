import express from "express";
import {
  menuItemsController,
  categoriesController,
  ordersController,
  billsController,
  usersController,
  restaurantsController,
  razorpayController,
  authController,
  notificationController,
} from "../controllers";

import {
  menuItemsValidation,
  categoriesValidation,
  ordersValidation,
  billsValidation,
  usersValidation,
  restaurantsValidation,
  authValidation,
} from "../middlewares/requestValidations";

import { authLocalOwner } from "../../config/auth/ownerPassport";
import { authLocalUser } from "../../config/auth/userPassport";
import { authAccessToken } from "../middlewares/authorization/accessToken";
import { authRefreshToken } from "../middlewares/authorization/refreshToken";

const router = express.Router();

router.get(
  "/menu-items",
  authAccessToken,
  menuItemsValidation,
  menuItemsController.get,
);
router.get(
  "/menu-items/group-by-category",
  authAccessToken,
  menuItemsValidation,
  menuItemsController.groupByCategories,
);
router.get("/menu-items/:id", authAccessToken, menuItemsController.getById);
router.post(
  "/menu-items",
  authAccessToken,
  menuItemsValidation,
  menuItemsController.post,
);
router.patch(
  "/menu-items/:id",
  authAccessToken,
  menuItemsValidation,
  menuItemsController.update,
);
router.delete("/menu-items/:id", authAccessToken, menuItemsController.delete);

router.get(
  "/categories",
  authAccessToken,
  categoriesValidation,
  categoriesController.get,
);
router.get("/categories/:id", authAccessToken, categoriesController.getById);
router.post(
  "/categories",
  authAccessToken,
  categoriesValidation,
  categoriesController.post,
);
router.patch(
  "/categories/:id",
  authAccessToken,
  categoriesValidation,
  categoriesController.update,
);
router.delete("/categories/:id", authAccessToken, categoriesController.delete);

router.get("/users", authAccessToken, usersValidation, usersController.get);
router.get("/user/:id", authAccessToken, usersController.getById);
router.patch(
  "/user/:id",
  authAccessToken,
  usersValidation,
  usersController.update,
);
router.patch(
  "/owner/:id",
  authAccessToken,
  usersValidation,
  usersController.update,
);
router.delete("/user/:id", authAccessToken, usersController.delete);

router.get("/restaurants", restaurantsValidation, restaurantsController.get);
router.get("/restaurant/:id", restaurantsController.getById);
router.post("/restaurant", restaurantsValidation, restaurantsController.post);
router.patch(
  "/restaurant/:id",
  restaurantsValidation,
  restaurantsController.update,
);
router.delete("/restaurant/:id", restaurantsController.delete);

router.post("/signup", usersValidation, usersController.post);
router.post(
  "/login/owner",
  authValidation,
  authLocalOwner,
  authController.authenticate,
);
router.post(
  "/login/user",
  authValidation,
  authLocalUser,
  authController.authenticate,
);
router.get("/verify/mail", authValidation, authController.verifyEmail);
router.get("/accesstoken", authRefreshToken, authController.refreshAccessToken);
router.post("/logout", authAccessToken, authValidation, authController.logout);

router.get("/orders", ordersValidation, ordersController.getOrders);
router.get("/orders/:id", ordersController.getOrderById);
router.post("/orders", ordersValidation, ordersController.postOrder);
router.patch("/orders/:id/add", ordersValidation, ordersController.addToOrder);
router.patch(
  "/orders/:id/accept",
  ordersValidation,
  ordersController.acceptAll,
);
router.patch(
  "/orders/:id/complete",
  ordersValidation,
  ordersController.completeAll,
);
router.patch("/orders/:id", ordersValidation, ordersController.updateOrder);
router.patch(
  "/orders/:orderId/iteration/:iterationId",
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

router.post(
  "/callWaiter/:restaurantId/:tableNo",
  notificationController.callWaiter,
);
router.post(
  "/payByCash/:restaurantId/:tableNo",
  notificationController.payByCash,
);

export default router;
