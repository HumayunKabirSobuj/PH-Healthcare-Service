import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUplader } from "../../../helpars/fileUploader";
import { IFile } from "../../interfaces/file";

const createAdmin = async (req: any) => {
  // console.log("File : ", req.file);
  console.log("Data : ", req.body);

  const file:IFile = req.file;

  if (file) {
    const uploadToCloudinary = await fileUplader.uploadToCloudinary(file);
    console.log({ uploadToCloudinary });
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;

    // console.log(req.body);
  }

  const data = req.body;

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
