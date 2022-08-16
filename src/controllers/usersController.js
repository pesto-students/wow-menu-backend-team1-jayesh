import { Users } from "../models";
import hashPasswordUtil from "../utils/hashPasswordUtil";

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

      req.body.updatedAt = Date.now();

      const result = await Users.findByIdAndUpdate(
        req.params.id,
        req.body,
        options,
      );
      result.password = undefined;
      res.status(200).json({
        message: `User data is successfully updated`,
        status: true,
        data: result,
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

  async verifyEmail(req, res) {
    try {
      const data = await Users.findById(req.query.id);
      if (req.query.hashedString === data.password) {
        await Users.findByIdAndUpdate(
          req.query.id,
          { isVerified: true },
          { new: true },
        );
        res.status(200).json({
          message: "Email is successfully verified",
        });
      } else {
        res.status(422).json({ message: "Clicked on invalid link" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Unable to verify email. Please try again later.",
      });
    }
  },

  async authenticate(req, res) {
    res.json({ data: req.user });
  },
};

export default usersController;
