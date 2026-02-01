import Order from "../models/order.js";
import Product from "../models/product.js"; // Adjust based on your file name

export const placeOrder = async (req, res) => {
  try {
    const { orderId, items, customerDetails, total, paymentMethod, userId } =
      req.body;

    // 1. Check stock availability for ALL items before saving anything
    for (const item of items) {
      const product = await Product.findById(item._id);

      // Find the specific size object in the sizes array
      const sizeEntry = product.sizes.find((s) => s.value === item.size);

      if (!sizeEntry || sizeEntry.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Oops! ${product.name} (Size ${item.size}) just ran out of stock.`,
        });
      }
    }

    // 2. Create the Order
    const newOrder = new Order({
      orderId,
      user: userId || null,
      items,
      customerDetails,
      total,
      paymentMethod,
    });

    await newOrder.save();

    // 3. Update Stock (The Decrement)
    // We use Promise.all to run all updates simultaneously for speed
    await Promise.all(
      items.map(async (item) => {
        await Product.updateOne(
          {
            _id: item._id,
            "sizes.value": item.size, // Locate the specific product and the specific size
          },
          {
            $inc: { "sizes.$.stock": -item.quantity }, // The $ is a positional operator for the matched size
          },
        );
      }),
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during checkout" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // 1. Fetch the order first to check its current state
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 2. RESTOCK LOGIC: Trigger if changing TO 'Cancelled' from any other status
    if (status === "Cancelled" && order.status !== "Cancelled") {
      // Map through items in the order and increment the stock
      const restockPromises = order.items.map(async (item) => {
        return Product.updateOne(
          {
            _id: item._id,
            "sizes.value": item.size, // Locate the specific size
          },
          {
            $inc: { "sizes.$.stock": item.quantity }, // Increment by the ordered quantity
          },
        );
      });

      await Promise.all(restockPromises);
      console.log(`Inventory Restocked for Order: ${orderId}`);
    }

    // 3. Update the status in the database
    order.status = status;
    await order.save();

    res.json({
      success: true,
      message:
        status === "Cancelled"
          ? "Order cancelled and items restocked"
          : "Status updated",
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const clientCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email } = req.body; // Verify with email for guest security

    const order = await Order.findOne({
      orderId,
      "customerDetails.email": email,
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // SECURITY: Only allow cancellation if status is "Pending"
    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel. Order is already ${order.status.toLowerCase()}.`,
      });
    }

    // 1. RESTOCK the inventory
    await Promise.all(
      order.items.map(async (item) => {
        await Product.updateOne(
          { _id: item._id, "sizes.value": item.size },
          { $inc: { "sizes.$.stock": item.quantity } },
        );
      }),
    );

    // 2. Update Order Status
    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order is cancelled.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// controllers/orderController.js
export const trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.query; // Get from search query

    const order = await Order.findOne({
      orderId: orderId.toUpperCase(),
      "customerDetails.email": email.toLowerCase(),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found with those details.",
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order." });
  }
};

// controllers/orderController.js
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};
