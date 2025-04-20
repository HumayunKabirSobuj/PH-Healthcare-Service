import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  console.log(userData);

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.passsword
  );

  console.log(isCorrectPassword);

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    { algorithm: "HS256", expiresIn: "15m" }
  );

  console.log(accessToken);
};

export const AuthServices = {
  loginUser,
};
