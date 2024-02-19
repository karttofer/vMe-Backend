// Deps
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
// Models
import { ICreateAccountPost } from "./models/requests";

export const CREATE_NEW_USER = (
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
  bcrypt.genSalt(10, (saltError, salt) => {
    if (saltError) throw saltError;
    bcrypt.hash(password, salt, async (hashError, hash) => {
      if (hashError) throw hashError;

      try {
        await prisma.reviewer.create({
          data: {
            nick_name,
            last_name,
            user_img,
            password: hash,
            email,
            location,
            linkedIn_user,
            github_user,
          },
        });
        console.log("CONGRATS, NEW USER ADDED");
      } catch (error) {
        console.error("FALTA ERROR:", error);
      } finally {
        await prisma.$disconnect();
      }
    });
  });
};
