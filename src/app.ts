import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/user/user.route";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";
const app: Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

export default app;
