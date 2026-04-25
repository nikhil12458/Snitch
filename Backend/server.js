import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { config } from "./src/config/config.js";

const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
