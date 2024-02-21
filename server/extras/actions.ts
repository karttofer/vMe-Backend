//TODO See all the messages? We need to delete the status from the file and put them in the messages files
// Deps
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { createTransport } from "nodemailer";

// Messages
import {
  USER_NO_FOUND,
  USER_WRONG_PASSWORD,
  THIRD_PARTY_ERROR,
  P2003_PRISMA,
} from "./messages/errors";
import { USER_FOUND, MAGIC_LINK_RESET_PASSWORD_SENT } from "./messages/sucess";
import { USER_ACTION_REPEATED_CAN_CONTINUE } from "./messages/alerts";

// Models
import {
  ICreateAccountPost,
  ILoginPost,
  IResetPasswordMagicLinkPost,
} from "./models/requests";

// Helpers
import { crypt } from "../helpers/bcrypt";

// Configs
import { mailBody } from "./bodys/mail";

const SALT = Number(process.env.PASSWORD_SALT);

/**
 * @description Create an user
 * @param destructuredParams Registrarion user info
 * @param prisma  PrismaClient
 * @returns Object
 */
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
  bcrypt.genSalt(SALT, (saltError, salt) => {
    if (saltError) throw saltError;
    bcrypt.hash(password, salt, async (hashError, hash) => {
      if (hashError) throw hashError;

      try {
        await prisma.reviewer.create({
          data: {
            user_unique_token: crypt(SALT, `${nick_name}-${email}`),
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

/**
 * @description Login
 * @param LoginInfo User login information
 * @param prisma PrismaLClient
 * @returns Object
 */
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

/**
 * @description Send magic link to reset password
 * @param ResetPassInfo
 * @param prisma
 * @returns Object
 */
export const SEND_MAGIC_LINK_RESET_PASSWORD = async (
  ResetPassInfo: IResetPasswordMagicLinkPost,
  prisma: PrismaClient
) => {
  const user = await prisma.reviewer.findUnique({
    where: {
      email: ResetPassInfo.email,
    },
  });

  if (!user) {
    return { error_message: USER_NO_FOUND, code: 404 };
  }
  /**
   * I prefer to use bcrypt to create a salt token
   */
  const updatedData = {
    user_id: user.user_unique_token,
    token: crypt(SALT, user.email),
    expireToken: new Date(Date.now() + 1 * 60 * 60 * 1000),
  };
  //TODO we need to make a better system for actions, allowing the user to make repeat actions
  try {
    const existAction = await prisma.reviewerActions.findUnique({
      where: {
        user_id: updatedData.user_id,
      },
    });

    !existAction
      ? await prisma.reviewerActions.create({
          data: updatedData,
        })
      : console.log({
          info_message: USER_ACTION_REPEATED_CAN_CONTINUE,
          code: 200,
        });
  } catch (error) {
    /**
     * COMMON ERRORS
     */
    if (error.code === "P2003") {
      return { error_message: P2003_PRISMA, code: 500 };
    }

    return { error_message: error, code: 500 };
  }

  /**
   * SEND MAGIC LINK TO RESET PASSWORD
   */
  const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_POST,
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.BREVO_KEY,
    },
  });

  const mailConfig = {
    from: process.env.MAIL_SENDER,
    to: ResetPassInfo.email,
    subject: "CodeReviewMe - Reset password",
    html: mailBody(updatedData.token, updatedData.user_id),
  };

  transporter.sendMail(mailConfig, (error) => {
    return { error_message: THIRD_PARTY_ERROR, error };
  });

  return { sucess_message: MAGIC_LINK_RESET_PASSWORD_SENT, code: 200 };
};
