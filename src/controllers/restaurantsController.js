import { Restaurants, Users } from "../models";

const restaurantsController = {
  async get(req, res, next) {
    try {
      const data = await Restaurants.find(req.query);
      res.status(200).json({ status: true, data: data });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await Restaurants.findById(req.params.id);
      res.status(200).json({ status: true, data: data });
    } catch (error) {
      return next(error);
    }
  },

  async post(req, res, next) {
    const data = new Restaurants({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      gstNumber: req.body.gstNumber,
      gstPercentage: req.body.gstPercentage,
      totalTables: req.body.totalTables,
      createdBy: req.user._id,
    });

    try {
      const result = await data.save();
      const user = await Users.findById(req.body.createdBy);
      Object.assign(user, {
        restaurant: result.id,
      });
      await user.save();
      res.status(201).json({
        message: "Restaurant successfully added",
        status: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const options = { new: true };

      const result = await Restaurants.findByIdAndUpdate(id, req.body, options);
      res.status(200).json({
        message: "Restaurant successfully updated",
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
      const { name } = await Restaurants.findByIdAndDelete(id);
      res.status(200).json({
        message: `Restaurant ${name} successfully deleted`,
        status: true,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default restaurantsController;
