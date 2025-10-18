import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();
const port: number = +process.env.PORT!;

if (process.env.NODE_ENV !== "test") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  });
  app.use(limiter);
}

app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", function (_req: Request, res: Response) {
  res.send("Hello World!");
});

app.listen(port, function () {
  console.log(`starting app on: ${port}`);
});

export default app;
