import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllFromDB = async (params: any) => {
  const { searchTearm, ...filterData } = params;

  const andConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchAbleFields = ["name", "email"];
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
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
};
