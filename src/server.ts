import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();
const port: number = +process.env.PORT!;

app.use('/api/users', userRoutes);

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});


app.listen(port, function () {
  console.log(`starting app on: ${port}`);
});


export default app;
