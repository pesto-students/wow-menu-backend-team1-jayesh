import { Users } from "../models";
import hashPasswordUtil from "../utils/hashPasswordUtil";

const usersController = {
  async get(req, res, next) {
    try {
      const data = await Users.find(req.query);
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
      is_admin,
      role,
      email_id,
      username,
      is_verified,
      restaurant,
    } = req.body;

    const data = new Users({
      firstname,
      lastname,
      password,
      is_admin,
      role,
      email_id,
      username,
      is_verified,
      restaurant,
    });

    try {
      const result = await data.save();
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

      req.body.updated_at = Date.now();

      const result = await Users.findByIdAndUpdate(
        req.params.id,
        req.body,
        options,
      );
      res.status(200).json({
        message: `Owner's data is successfully updated`,
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
        message: `Owner ${firstname} ${lastname} is successfully deleted`,
        status: true,
      });
    } catch (error) {
      return next(error);
    }
  },

  async verifyEmail(req, res) {
    try {
      const data = await Users.findById(req.query.id);
      if (req.query.hashed_string === data.password) {
        await Users.findByIdAndUpdate(
          req.query.id,
          { is_verified: true },
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
    res.json({ token: req.user });
  },
};

export default usersController;
