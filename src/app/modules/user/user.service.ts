import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdmin = async (data: any) => {
  //   console.log(data);
  const hashPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    role: UserRole.ADMIN,
    passsword: hashPassword,
  };

  const adminData = data.admin;

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const createAdminData = await tx.admin.create({
      data: adminData,
    });

    return createAdminData;
  });

  return result;
};


export const userService = {
  createAdmin,
};
