// utils/inventoryHelper.js
import { createNotification } from "./notificationHelper.js";

export const checkStockLevels = async (req, product) => {
  // If product is missing or has no sizes, stop immediately
  if (!product || !product.sizes) return;

  const LOW_STOCK_LIMIT = 5;

  for (const sizeObj of product.sizes) {
    if (sizeObj.stock <= LOW_STOCK_LIMIT && sizeObj.stock > 0) {
      await createNotification(req, {
        title: "Low Stock Warning 👟",
        content: `${product.name} (Size: ${sizeObj.value}) has only ${sizeObj.stock} left!`,
        type: "system",
        priority: "medium",
      });
    } else if (sizeObj.stock === 0) {
      await createNotification(req, {
        title: "Item Sold Out! ❌",
        content: `${product.name} (Size: ${sizeObj.value}) is now out of stock.`,
        type: "alert",
        priority: "high",
      });
    }
  }
};
