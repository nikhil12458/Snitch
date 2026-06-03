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

  // const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", // CRITICAL: Must be consistent with all other cookie operations
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
    console.log("🔄 [googleCallback] Starting Google callback process...");
    
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0]?.value;

    if (!email) {
      console.error("❌ [googleCallback] Email not provided by Google");
      return res.redirect(`${config.FRONTEND_URL}/login?error=Email not provided by Google`);
    }

    console.log("🔄 [googleCallback] Email from Google:", email);
    
    // Find existing user or create new one
    let user = await userModel.findOne({ email });
    let isNewUser = !user;

    if (!user) {
      console.log("🆕 [googleCallback] Creating new Google user for email:", email);
      user = await userModel.create({
        email,
        googleId: id,
        fullname: displayName || email.split("@")[0],
        role: "buyer", // Set default role for Google users
      });
      console.log("✅ [googleCallback] New user created with ID:", user._id, "Role:", user.role);
    } else {
      console.log("👤 [googleCallback] Existing user found with ID:", user._id, "Email:", user.email, "Role:", user.role);
      console.log("🔐 [googleCallback] LOGGING IN existing user");
      
      // Update Google ID if not already set
      if (!user.googleId) {
        console.log("🔄 [googleCallback] Linking Google account to existing user");
        user.googleId = id;
        await user.save();
        console.log("✅ [googleCallback] User account linked with Google OAuth");
      } else {
        console.log("✅ [googleCallback] Google account already linked");
      }
    }

    // Verify user has role (critical for later queries)
    if (!user.role) {
      console.warn("⚠️ [googleCallback] User missing role field, setting to 'buyer'");
      user.role = "buyer";
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    console.log("🔑 [googleCallback] JWT token generated for user:", user._id);

    const isProduction = process.env.NODE_ENV === "production";

    // Set cookie with ALL required options
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("✅ [googleCallback] Token cookie set with options:", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: "7 days",
    });

    console.log(`✅ [googleCallback] Google OAuth successful (${isNewUser ? "NEW" : "EXISTING"} user) - User:`, {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      isNewUser,
    });

    // Redirect to frontend - the frontend will call getMe() during initialization
    // and will receive the token from the httpOnly cookie
    res.redirect(`${config.FRONTEND_URL}/?google_auth=success`);
  } catch (error) {
    console.error("❌ [googleCallback] Error in Google callback:", error);
    console.error("❌ [googleCallback] Error stack:", error.stack);
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
    const isProduction = process.env.NODE_ENV === "production";
    
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/", // CRITICAL: Must match the path used when setting the cookie
    });

    console.log("User logged out successfully");

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Logout failed" });
  }
};
