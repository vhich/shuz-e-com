import Order from "../models/order.js";
import Product from "../models/product.js"; // Adjust based on your file name
import clientModel from "../models/users/clients.js";
import Stripe from "stripe";

// orderController.js

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  // Use the 'stripe' instance defined above
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      // Use findOneAndUpdate to match your custom 'orderId' string
      await Order.findOneAndUpdate(
        { orderId: orderId },
        {
          paymentStatus: "Paid", // Updated to match your String schema
          status: "Pending",
        },
      );
      console.log(`✅ Order ${orderId} successfully updated to PAID.`);
    } catch (error) {
      console.error(`❌ DB Update Error: ${error.message}`);
    }
  }
  res.json({ received: true });
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { items, clientId, orderId, customerDetails, total } = req.body;

    // Use findOneAndUpdate with upsert: true
    // This prevents the "Duplicate Key" error if the frontend calls this twice
    await Order.findOneAndUpdate(
      { orderId: orderId }, // Search by this
      {
        user: clientId || null,
        items,
        customerDetails,
        total,
        paymentMethod: "stripe",
        paymentStatus: "Unpaid",
        status: "Pending",
      },
      { upsert: true, new: true }, // Create if doesn't exist, update if it does
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    if (clientId && clientId !== "null") {
      await clientModel.findByIdAndUpdate(clientId, { cartData: {} });
    }

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { items, customerDetails, total, paymentMethod, clientId, orderId } =
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
      user: clientId || null,
      items,
      customerDetails,
      total,
      paymentMethod,
      date: Date.now(),
    });

    await newOrder.save();
    if (clientId && clientId !== "null") {
      await clientModel.findByIdAndUpdate(clientId, { cartData: {} });
    }

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
export const updatePayment = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    // 1. Fetch the order first to check its current state
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 3. Update the status in the database
    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({
      success: true,
      message: "Payment status updated!",
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

export const clientOrders = async (req, res) => {
  try {
    // Get it from req.clientId (the middleware set this)
    const clientId = req.clientId;

    if (!clientId) {
      return res.json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const orders = await Order.find({ user: clientId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
