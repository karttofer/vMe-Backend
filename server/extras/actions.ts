//TODO See all the messages? We need to delete the status from the file and put them in the messages files
// Deps
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { createTransport } from "nodemailer";

// Compilers
import { getQuickJS } from "quickjs-emscripten"
// Messages
import {
  USER_NO_FOUND,
  USER_WRONG_PASSWORD,
  THIRD_PARTY_ERROR,
  P2003_PRISMA,
  TOKEN_NOT_FOUND,
  CANT_BE_THE_SAME_PASSWORD,
} from "./messages/errors";
import {
  USER_FOUND,
  MAGIC_LINK_RESET_PASSWORD_SENT,
  TOKEN_CONTINUE_WORKING_WELL,
  SUCCESS_USER_CHANGE_PASSWORD,
  USER_EDITED_INFORMATION_CORRECTLY
} from "./messages/sucess";
import { USER_ACTION_REPEATED_CAN_CONTINUE } from "./messages/alerts";

// Models
import {
  ICreateAccountPost,
  ILoginPost,
  IResetPasswordMagicLinkPost,
  IResetPasswordPost,
  IUserEditPost
} from "./models/requests";

// Helpers
import { crypt } from "../helpers/bcrypt";
import { userExistSingleValidation } from "../helpers/validations";

// Configs
import { mailBody } from "./bodys/mail";

const SALT = Number(process.env.PASSWORD_SALT);

/**
 * @description Create an user
 * @param destructuredParams Object
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
      } catch (error) {
        console.error("FALTA ERROR:", error);
      } finally {
        await prisma.$disconnect();
      }
    });
  });
};

/**
 * @description Login the user, allow to enter to the app
 * @param LoginInfo Object { email: string password: string }
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

  return { success_message: USER_FOUND, user_info: user.user_unique_token };
};

/**
 * @description Send magic link to reset password
 * @param ResetPassInfo Object { email: string }
 * @param prisma PrismaClient
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
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
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

  return { sucess_message: `${MAGIC_LINK_RESET_PASSWORD_SENT} - TO - ${ResetPassInfo.email}`, code: 200 };
};

//TODO: remember the actions, we need a better system to handle thiss
/**
 * @description Verify if reset password token is expired
 * @param token String
 * @param prisma PrismaClient
 */
export const VERIFY_MAGIC_LINK_RESET_PASSWORD_EXPIRED = async (
  token: string,
  prisma: PrismaClient
) => {
  const tokenExist = await prisma.reviewerActions.findUnique({
    where: {
      token,
    },
  });

  if (!tokenExist) {
    return {
      error_message: TOKEN_NOT_FOUND,
      token_valid: false,
      code: 404,
    };
  }

  return {
    error_message: TOKEN_CONTINUE_WORKING_WELL,
    token_valid: true,
    code: 200,
  };
};

/**
 * @description Reset user password
 * @param userNewPassInf - Object
 * @param prisma - PrismaClient
 * @returns
 */
export const RESET_PASSWORD = async (
  { user_unique_token, new_password }: IResetPasswordPost,
  prisma: PrismaClient
) => {
  const user = await prisma.reviewer.findUnique({
    where: {
      user_unique_token,
    },
  });

  if (!user) {
    return { error_message: USER_NO_FOUND, code: 404 };
  }

  const passwordComparation = await bcrypt.compare(new_password, user.password);

  if (passwordComparation) {
    return { error_message: CANT_BE_THE_SAME_PASSWORD, code: 409 };
  }

  bcrypt.genSalt(SALT, (saltError, salt) => {
    if (saltError) throw saltError;
    bcrypt.hash(new_password, salt, async (hashError, hash) => {
      if (hashError) throw hashError;
      try {
        prisma.reviewer.update({
          where: {
            user_unique_token,
          },
          data: {
            password: hash,
          },
        });

        return {
          success_message: SUCCESS_USER_CHANGE_PASSWORD,
          code: 200,
        };
      } catch (error) {
        console.error("FALTA ERROR:", error);
      } finally {
        await prisma.$disconnect();
        console.error("PRISMA IS OFF");
      }
    });
  });
};

export const EDIT_USER_INFORMATION = async (userInfoToChange: IUserEditPost, prisma: PrismaClient) => {
  const userExist = await userExistSingleValidation('user_unique_token', userInfoToChange.user_unique_token, prisma)

  if (userExist.code !== 200) {
    return userExist.error_message
  }

  try {
    await prisma.reviewer.update({
      where: {
        user_unique_token: userInfoToChange.user_unique_token
      },
      data: {
        ...userInfoToChange
      }
    })
  } catch (error) {
    console.error("FALTA ERROR:", error);
  }

  return {
    success_message: USER_EDITED_INFORMATION_CORRECTLY,
    code: 200,
  }
}


//@TODO Add Mocha/Chai
interface RunInterface {
  fs: Array<{
    name: string,
    code: string
  }>,
  test: Array<{
    name: string,
    input: string,
    expected: string
  }>
}
export const RUN_Simple = async (runConfig: RunInterface, prisma?: PrismaClient) => {
  const QuickJS = await getQuickJS();
  const vm = QuickJS.newContext();

  const fnHandle = vm.newFunction("log", (...args) => {
    const nativeArgs = args.map(vm.dump)
    return console.log(nativeArgs)
  })

  // Native object that helps the user
  vm.setProp(vm.global, "log", fnHandle)
  fnHandle.dispose()

  const runTest = (description, testFunction) => {
    try {
      testFunction();
      console.log('✓', description);
    } catch (error) {
      console.error('✗', description);
      console.error('  ', error.message);
    }
  };

  const dynamicFunctions = runConfig.fs

  const dynamicTestCases = runConfig.test

  dynamicFunctions.forEach((func) => {
    vm.evalCode(func.code);
  });

  dynamicTestCases.forEach((testCase) => {
    runTest(`${testCase.name} - Test Case`, () => {
      const result: any = vm.evalCode(`${testCase.name}(${JSON.stringify(testCase.input)})`);
      const output = vm.dump(result.value);

      if (result.error) {
        throw new Error(vm.dump(result.error));
      }

      if (output !== testCase.expected) {
        throw new Error(`Expected "${testCase.expected}", but got ${output}`);
      }
    });
  });

  vm.dispose();
};