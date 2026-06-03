import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    // Convert isSeller to boolean (handle string or boolean values)
    const sellerStatus = isSeller === true || isSeller === "true" ? true : false;

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: sellerStatus ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  await sendTokenResponse(user, res, "User logged in successfully");
};

export const googleCallback = async (req, res) => {
  try {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0]?.value;

    if (!email) {
      return res.redirect(`${config.FRONTEND_URL}/login?error=Email not provided by Google`);
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      console.log("Creating new Google user:", { email, displayName });
      user = await userModel.create({
        email,
        googleId: id,
        fullname: displayName,
        role: "buyer", // Set default role for Google users
      });
    } else {
      // Update Google ID if not already set
      if (!user.googleId) {
        user.googleId = id;
        await user.save();
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("Google OAuth successful for user:", user._id);

    // Redirect to frontend with a success indicator
    res.redirect(`${config.FRONTEND_URL}/?auth_success=true`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${config.FRONTEND_URL}/login?error=Authentication failed`);
  }
};

export const getMe = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Logout failed" });
  }
};
