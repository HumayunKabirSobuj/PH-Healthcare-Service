import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUplader } from "../../../helpars/fileUploader";

const createAdmin = async (req: any) => {
  // console.log("File : ", req.file);
  console.log("Data : ", req.body.data);

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUplader.uploadToCloudinary(file);
    // console.log({uploadToCloudinary});
    req.body.data.admin.profilePhoto = (uploadToCloudinary as any)?.secure_url;

    console.log(req.body.data);
  }

  //   console.log(data);
  // const hashPassword = await bcrypt.hash(data.password, 12);

  // const userData = {
  //   email: data.admin.email,
  //   role: UserRole.ADMIN,
  //   passsword: hashPassword,
  // };

  // const adminData = data.admin;

  // const result = await prisma.$transaction(async (tx) => {
  //   await tx.user.create({
  //     data: userData,
  //   });
  //   const createAdminData = await tx.admin.create({
  //     data: adminData,
  //   });

  //   return createAdminData;
  // });

  // return result;
};
export const userService = {
  createAdmin,
};
