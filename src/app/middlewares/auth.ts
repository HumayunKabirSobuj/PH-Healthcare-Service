import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import config from "../../config";
import ApiError from "../errors/ApiError";
import status from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "You are not authorized!");
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      // console.log(verifiedUser);

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(status.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
