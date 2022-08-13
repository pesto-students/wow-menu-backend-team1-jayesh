import { Orders } from "../models";
import { Bills } from "../models";

const getUniqueItems = (order) => {
  const filterIterations = order.iterations.filter(
    (odr) => odr.status !== "Rejected",
  );
  const orderItems = filterIterations
    .map((odr) => {
      return odr.items;
    })
    .flat();
  const itemMaps = new Map();
  orderItems.forEach((item) => {
    const modifiedItem = {
      // item: mongoose.Types.ObjectId(item.item_id.id),
      item_id: item.item.id,
      name: item.item.name,
      quantity: item.quantity,
      price: item.item.price,
    };
    if (!itemMaps.has(modifiedItem.item_id))
      itemMaps.set(modifiedItem.item_id, modifiedItem);
    else {
      const prevItem = itemMaps.get(modifiedItem.item_id);
      itemMaps.set(modifiedItem.item_id, {
        ...modifiedItem,
        quantity: parseInt(modifiedItem.quantity) + parseInt(prevItem.quantity),
      });
    }
  });
  return [...itemMaps.values()];
};

const billsController = {
  async getBills(req, res) {
    //need to check restaurant id when restaurant model is done
    try {
      let bills;
      if (req.query.limit) {
        const { page, limit } = req.query;
        bills = await Bills.find(req.query)
          .limit(limit)
          .skip((page - 1) * limit);
      } else {
        bills = await Bills.find(req.query);
      }
      res.status(200).json({ status: true, data: bills });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },
  async getBillById(req, res) {
    try {
      const id = req.params.id;
      const bill = await Bills.findById(id);
      if (!bill)
        return res.status(404).json({
          success: false,
          error: { message: "Bill Not Found" },
        });
      res.status(200).json({ status: true, data: bill });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },
  async postBill(req, res) {
    try {
      const id = req.body.order_id;
      const order = await Orders.findById(id).populate({
        path: "iterations",
        populate: {
          path: "items",
          populate: {
            path: "item",
            model: "MenuItem",
          },
        },
      });

      if (!order)
        return res.status(404).json({
          success: false,
          error: { message: "Order Not Found" },
        });
      const bill = await Bills.find({ order_id: id });
      if (bill.length !== 0)
        return res.status(422).json({
          success: false,
          error: {
            message: "A Bill with same Order already exists",
          },
        });
      const items = getUniqueItems(order);
      const totalQty = items.reduce((acc, curr) => {
        return parseInt(acc) + parseInt(curr.quantity);
      }, 0);
      const subtotal = parseFloat(
        items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0),
      ).toFixed(2);
      const gst = parseFloat((5 * subtotal) / 100).toFixed(2); //after Restaurant Model need to bring details and get gst % from there
      const totalAmt = parseFloat(subtotal + 2 * gst).toFixed(2);
      const newBill = new Bills({
        order_id: id,
        table_no: order.table_no,
        restaurant_id: order.restaurant_id,
        created_by: "",
        items: items,
        total_quantity: totalQty,
        subtotal: subtotal,
        cgst: gst,
        sgst: gst,
        total: totalAmt,
      });
      const savedBill = await newBill.save();
      return res.status(201).json({
        message: "Bill saved successfully",
        status: true,
        data: savedBill,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },
  async updateBill(req, res) {
    try {
      const bill = await Bills.findById(req.params.id);
      if (!bill) {
        return res.status(404).json({
          success: false,
          error: { message: "Bill Not Found" },
        });
      }
      Object.assign(bill, req.body);
      const savedBill = await bill.save();
      return res.status(201).json({
        message: "Bill Updated successfully",
        status: true,
        data: savedBill,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },
  async deleteBill(req, res) {
    try {
      const id = req.params.id;
      const bill = await Bills.findByIdAndDelete(id);
      res.status(200).json({
        message: `Bill deleted successfully`,
        status: true,
        data: bill,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },
};

export default billsController;
