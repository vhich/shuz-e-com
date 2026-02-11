import clientModel from "../models/users/clients.js";
import Product from "../models/product.js";

// UPDATE OR ADD ITEM
export const updateCart = async (req, res) => {
  try {
    const { clientId, cartKey, productId, size, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.json({ success: false, message: "Product not found" });

    const finalPrice =
      product.discount > 0
        ? product.price - product.price * (product.discount / 100)
        : product.price;

    const userData = await clientModel.findById(clientId);
    let cartData = userData.cartData || {};

    cartData[cartKey] = {
      _id: productId, // Keeping it as _id to match frontend
      name: product.name,
      image: product.image, // Save the full array/string, let frontend handle index
      price: finalPrice,
      size,
      quantity,
    };

    await clientModel.findByIdAndUpdate(clientId, { cartData });
    res.json({ success: true, message: "Cart Updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// DELETE ITEM
export const deleteFromCart = async (req, res) => {
  try {
    const { cartKey } = req.body;
    const clientId = req.clientId;
    const userData = await clientModel.findById(clientId);
    let cartData = userData.cartData;

    delete cartData[cartKey];

    await clientModel.findByIdAndUpdate(clientId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};
