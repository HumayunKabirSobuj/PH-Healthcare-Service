import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

import router from "./app/routes";
import status from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/admin", AdminRoutes);

app.use("/api/v1", router);

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   // console.log('error occured...');
//   res.status(status.INTERNAL_SERVER_ERROR).json({
//     success: false,
//     message: err.message || "something went wrong",
//     error: err,
//   });
// });

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found",
    },
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

export default app;
