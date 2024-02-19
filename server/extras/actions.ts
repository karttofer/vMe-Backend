// Deps
import { PrismaClient } from "@prisma/client";

// Models
import { ICreateAccountPost } from "./models/requests";

export const CREATE_NEW_USER = async (
  {
    nick_name,
    last_name,
    user_img,
    password,
    email,
    location,
    linkedIn_user,
    github_user,
  }: ICreateAccountPost,
  prisma: PrismaClient
) => {
  try {
    await prisma.reviewer.create({
      data: {
        nick_name,
        last_name,
        user_img,
        password,
        email,
        location,
        linkedIn_user,
        github_user,
      },
    });
    console.log("Inserción exitosa");
  } catch (error) {
    console.error("Error durante la inserción:", error);
  } finally {
    await prisma.$disconnect();
  }
};
