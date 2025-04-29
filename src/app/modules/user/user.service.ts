import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUplader } from "../../../helpars/fileUploader";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const createAdmin = async (req: any) => {
  // console.log("File : ", req.file);
  console.log("Data : ", req.body);

  const file: IFile = req.file;

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
const createDoctor = async (req: any) => {
  // console.log("File : ", req.file);
  // console.log("Data : ", req.body);

  const file: IFile = req.file;

  if (file) {
    const uploadToCloudinary = await fileUplader.uploadToCloudinary(file);
    // console.log({ uploadToCloudinary });
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;

    console.log(req.body);
  }

  const data = req.body;

  // console.log(data);
  const hashPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.doctor.email,
    role: UserRole.DOCTOR,
    passsword: hashPassword,
  };

  const doctorData = data.doctor;

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const createDoctorData = await tx.doctor.create({
      data: doctorData,
    });

    return createDoctorData;
  });

  return result;
};
const createPatient = async (req: any) => {
  // console.log("File : ", req.file);
  // console.log("Data : ", req.body);

  const file: IFile = req.file;

  if (file) {
    const uploadToCloudinary = await fileUplader.uploadToCloudinary(file);
    console.log({ uploadToCloudinary });
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;

    // console.log(req.body);
  }

  const data = req.body;

  //   console.log(data);
  const hashPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.patient.email,
    role: UserRole.PATIENT,
    passsword: hashPassword,
  };

  const patientData = data.patient;

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const createPatientData = await tx.patient.create({
      data: patientData,
    });

    return createPatientData;
  });

  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  // console.log(options);
  const { limit, skip, page } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  // console.log(params.searchTerm);

  const andConditions: Prisma.UserWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTearm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // andConditions.push({
  //   isDeleted: false,
  // });
  // console.dir(andConditions, { depth: "infinity" });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
    // include: {
    //   admin: true,
    //   patient: true,
    //   doctor: true,
    // },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatus = async (
  id: string,
  data: { status: UserStatus }
) => {
  // console.log(data);
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userData) {
    throw new ApiError(status.NOT_FOUND, "User Not Found.");
  }

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return updateUserStatus;
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
};
