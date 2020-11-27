import express, { Request, Response } from "express";
import cors from "cors";
const app = express();

app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(8000, () => {
    console.log("Server started on port: 8000");
});
