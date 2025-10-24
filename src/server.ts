import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import dotenv from "dotenv";
import { validateEnv } from "./config/env";
import { connectDB } from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";
import morgan from "morgan";
import { apiRateLimit } from "./config/rateLimits";

dotenv.config();

// Validate environment variables on startup
validateEnv();

const app: express.Application = express();
const port: number = +process.env.PORT!;

app.use(apiRateLimit);
app.use(express.json());

const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", function (_req: Request, res: Response) {
  res.send("Hello World!");
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Connect to database and start server
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(port, function () {
      console.log(`🚀 Server started on port: ${port}`);
    });
  });
} else {
  app.listen(port, function () {
    console.log(`🧪 Test server started on port: ${port}`);
  });
}

export default app;
