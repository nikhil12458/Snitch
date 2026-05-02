import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getSellerProducts,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

/* 
    @route POST /api/products
    @desc Create a new product
    @access Private (Seller only)
*/
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidator,
  createProduct,
);

/*
    @route GET /api/products/seller
    @desc Get products of the logged in seller
    @access Private (Seller only)
 */
router.get("/seller", authenticateSeller, getSellerProducts);

/*
    @route GET /api/products
    @desc Get all products (for buyers)
    @access Public
*/
router.get("/", getAllProducts);

export default router;
