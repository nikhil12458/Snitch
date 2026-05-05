import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  validateAddToCart,
  validateIncrementCartItemQuantity,
  validateDecrementCartItemQuantity,
  validateRemoveFromCart,
} from "../validator/cart.validator.js";
import {
  addToCart,
  getCart,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeFromCart,
  createOrderController,
  verifyOrderController,
} from "../controllers/cart.controller.js";

const router = express.Router();

/*
    @route POST /api/cart/add/:productId/:variantId
    @desc Add a product variant to the cart
    @access Private (Buyer only)
    @arguments productId - ID of the product to add
    variantId - ID of the variant to add (optional, if product has variants
    quantity - Quantity to add (default: 1))
*/
router.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addToCart,
);

/*
    @route GET /api/cart
    @desc Get the current user's cart
    @access Private (Buyer only)
*/

router.get("/", authenticateUser, getCart);

/*
    @route patch /api/cart/quantity/increment/:productId/:variantId
    @desc Update the quantity of a product variant in the cart by incrementing it by 1
    @access Private (Buyer only)
    @arguments productId - ID of the product to update
    variantId - ID of the variant to update (optional, if product has variants)
    quantity - New quantity to set)
 */

router.patch(
  "/quantity/increment/:productId/:variantId",
  authenticateUser,
  validateIncrementCartItemQuantity,
  incrementCartItemQuantity,
);

/*
   @route patch /api/cart/quantity/decrement/:productId/:variantId
   @desc Update the quantity of a product variant in the cart by decrementing it by 1
   @access Private (Buyer only)
   @arguments productId - ID of the product to update
   variantId - ID of the variant to update (optional, if product has variants)
   quantity - New quantity to set)
 */

router.patch(
  "/quantity/decrement/:productId/:variantId",
  authenticateUser,
  validateDecrementCartItemQuantity,
  decrementCartItemQuantity,
);

/*
    @route DELETE /api/cart/remove/:productId/:variantId
    @desc Remove a product variant from the cart
    @access Private (Buyer only)
    @arguments productId - ID of the product to remove
    variantId - ID of the variant to remove (optional, if product has variants)
 */

router.delete(
  "/remove/:productId/:variantId",
  authenticateUser,
  validateRemoveFromCart,
  removeFromCart,
);

/*
  @route POST /api/cart/payment/create/order
 */

router.post("/payment/create/order", authenticateUser, createOrderController)

router.post("/payment/verify/order", authenticateUser, verifyOrderController)

export default router;
