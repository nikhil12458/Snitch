import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = express.Router();

/*
    @route POST /api/cart/add/:productId/:variantId
    @desc Add a product variant to the cart
    @access Private (Buyer only)
    @arguments productId - ID of the product to add
    variantId - ID of the variant to add (optional, if product has variants
    quantity - Quantity to add (default: 1))
*/
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart);

/*
    @route GET /api/cart
    @desc Get the current user's cart
    @access Private (Buyer only)
*/

router.get("/", authenticateUser, getCart)

export default router;
