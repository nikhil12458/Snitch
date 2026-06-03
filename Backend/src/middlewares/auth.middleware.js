import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  console.log("cookie header :" ,req.headers.cookie)
  console.log("cookies :" ,req.cookies)
  const token = req.cookies?.token;

  if (!token) {
    console.warn("⚠️ [authenticateUser] No token found in cookies");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("🔐 [authenticateUser] Token found, verifying JWT...");
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log("✅ [authenticateUser] JWT verified for user ID:", decoded.id);
    
    const user = await userModel.findById(decoded.id);

    if (!user) {
      console.error("❌ [authenticateUser] User not found in database for ID:", decoded.id);
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("✅ [authenticateUser] User found and authenticated:", {
      id: user._id,
      email: user.email,
      role: user.role,
    });
    
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ [authenticateUser] Error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const authenticateSeller = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.warn("⚠️ [authenticateSeller] No token found in cookies");
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    console.log("🔐 [authenticateSeller] Token found, verifying JWT...");
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log("✅ [authenticateSeller] JWT verified for user ID:", decoded.id);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      console.error("❌ [authenticateSeller] User not found in database for ID:", decoded.id);
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (user.role !== "seller") {
      console.warn("⚠️ [authenticateSeller] User found but role is not 'seller', role:", user.role);
      return res.status(403).json({ message: "Forbidden" });
    }

    console.log("✅ [authenticateSeller] Seller authenticated:", {
      id: user._id,
      email: user.email,
      role: user.role,
    });

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ [authenticateSeller] Error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
