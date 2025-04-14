import { Admin, Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";

const getAllFromDB = async (params: any, options: any) => {
  const { limit, skip, page } = paginationHelper.calculatePagination(options);

  const { searchTearm, ...filterData } = params;

  const andConditions: Prisma.AdminWhereInput[] = [];
  if (params.searchTearm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
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
          equals: filterData[key],
        },
      })),
    });
  }

  // console.dir(andConditions, { depth: "infinity" });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
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
  });

  const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id: id, // or id
    },
  });

  return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
  // const isExist = await prisma.admin.findUniqueOrThrow({
  //   where:{
  //     id
  //   }
  // })
  // // console.log(isExist);
  // if(!isExist){
  //   throw new Error("Admin Not Found")

  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  // }

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data, // data: data,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    const userDeletedData = await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });
  return result
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
