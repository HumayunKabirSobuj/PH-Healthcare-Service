import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllFromDB = async (params: any) => {
  //   console.log({ params });

  // [
  //   {
  //     name: {
  //       contains: params.searchTearm,
  //       mode: "insensitive",
  //     },
  //   },
  //   {
  //     email: {
  //       contains: params.searchTearm,
  //       mode: "insensitive",
  //     },
  //   },
  // ],

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
