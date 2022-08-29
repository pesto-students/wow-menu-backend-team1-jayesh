import { Users } from "../models";
import hashPasswordUtil from "../utils/hashPasswordUtil";
import generateJWTToken from "../utils/generateJWTTokenUtil";

const usersController = {
  async get(req, res, next) {
    try {
      const data = await Users.find(req.query).select("-password");
      res.status(200).json({ status: true, data: data });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await Users.findById(req.params.id);
      res.status(200).json({ status: true, data: data });
    } catch (error) {
      return next(error);
    }
  },

  async post(req, res, next) {
    const {
      firstname,
      lastname,
      password,
      isAdmin,
      role,
      emailId,
      username,
      isVerified,
      restaurant,
    } = req.body;

    const data = new Users({
      firstname,
      lastname,
      password,
      isAdmin,
      role,
      emailId,
      username,
      isVerified,
      restaurant,
      // createdBy: req.user._id,
    });

    try {
      const result = await data.save();
      result.password = undefined;
      res.status(201).json({
        message: "User successfully added",
        status: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const options = { new: true };

      if (typeof req.body.password !== "undefined") {
        req.body.password = await hashPasswordUtil(req.body.password);
      }

      const result = await Users.findByIdAndUpdate(
        req.params.id,
        req.body,
        options,
      );
      const token = generateJWTToken(result.password);
      result.password = undefined;
      const response = { userDetails: result, token };
      res.status(200).json({
        message: `User data is successfully updated`,
        status: true,
        data: response,
      });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const { firstname, lastname } = await Users.findByIdAndDelete(id);
      res.status(200).json({
        message: `User ${firstname} ${lastname} is successfully deleted`,
        status: true,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default usersController;
