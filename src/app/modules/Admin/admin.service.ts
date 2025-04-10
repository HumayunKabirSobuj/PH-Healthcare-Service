import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllFromDB = async (params: any) => {
  console.log({ params });
  const result = await prisma.admin.findMany({
    where: {
      OR: [
        {
          name: {
            contains: params.searchTearm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTearm,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
};
