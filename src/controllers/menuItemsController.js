import { MenuItems } from "../models";

const menuItemsController = {
  async get(req, res, next) {
    try {
      let data;
      if (req.query.name !== undefined) {
        const val = req.query.name;
        req.query.name = {
          $regex: val,
          $options: "i",
        };
      }
      if (req.query.limit) {
        const { pageNo, limit } = req.query;
        data = await MenuItems.find(req.query)
          .skip((pageNo - 1) * limit)
          .limit(limit)
          .populate("category");
      } else {
        data = await MenuItems.find(req.query).populate("category");
      }
      res.status(200).json({ status: true, data: data });
    } catch (error) {
      return next(error);
    }
  },

  async groupByCategories(req, res, next) {
    try {
      let limit = 5;
      if (req.query.limit !== undefined) {
        limit = req.query.limit;
      }
      const menuItemsData = await MenuItems.find().populate("category");
      let result = {};
      for (let i = 0; i < menuItemsData.length; i++) {
        const val = menuItemsData[i];
        const category = val.category.name;
        if (result[category] === undefined) {
          result[category] = [val];
        } else {
          const categoryData = result[category];
          if (categoryData.length < limit) {
            result[category] = [...result[category], val];
          }
        }

        if (i === menuItemsData.length - 1) {
          res.status(200).json({ status: true, data: result });
        }
      }
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await MenuItems.findById(req.params.id);
      res.status(200).json({ status: true, data: data });
    } catch (error) {
      return next(error);
    }
  },

  async post(req, res, next) {
    const data = new MenuItems({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      discountedPrice: req.body.discountedPrice,
      category: req.body.category,
      isAvailable: req.body.isAvailable,
      isActive: req.body.isActive,
      isVeg: req.body.isVeg,
      spicy: req.body.spicy,
      imageUrl: req.body.imageUrl,
      createdBy: "admin", //todo get the createdBy through the token
      restaurant: req.body.restaurant,
    });

    try {
      await data.save();
      res.status(201).json({
        message: "Menu item successfully added",
        status: true,
        data: req.body,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      req.body.createdBy = "admin";
      req.body.updatedAt = Date.now();

      const result = await MenuItems.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({
        message: "Menu item is updated successfully",
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
      const { name } = await MenuItems.findByIdAndDelete(id);
      res.status(200).json({
        message: `Menu item successfully deleted with name ${name}`,
        status: true,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default menuItemsController;
