// Deps
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

// Messages
import { USER_NO_FOUND, USER_WRONG_PASSWORD } from "./messages/errors";
import { USER_FOUND } from "./messages/sucess";
// Models
import { ICreateAccountPost, ILoginPost } from "./models/requests";

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

export const LOGIN = async (LoginInfo: ILoginPost, prisma: PrismaClient) => {
  const user = await prisma.reviewer.findUnique({
    where: {
      email: LoginInfo.email,
    },
  });

  if (user === null) {
    return { error_message: USER_NO_FOUND };
  }

  const passwordComparation = await bcrypt.compare(
    LoginInfo.password,
    user.password
  );

  if (!passwordComparation) {
    return { error_message: USER_WRONG_PASSWORD };
  }

  return { success_message: USER_FOUND };
};
