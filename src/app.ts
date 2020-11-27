import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
