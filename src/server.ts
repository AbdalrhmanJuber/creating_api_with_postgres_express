import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();
const port: number = +process.env.PORT!;

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});


app.listen(port, function () {
  console.log(`starting app on: ${port}`);
});
