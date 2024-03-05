// Messages
import { PrismaClient } from "@prisma/client";
import { USER_NO_FOUND } from "../extras/messages/errors";
import { USER_FOUND } from "../extras/messages/sucess";

export const userExistSingleValidation = async (key: string, value: string, prisma: PrismaClient) => {
    const user = await prisma.reviewer.findUnique({
         // @ts-ignore: Actually this is valid and working well
        where: {
            [`${key}`]: value,
        },
    });

    if (!user) {
        return { error_message: USER_NO_FOUND, code: 404 };
    }

    return { success_message: USER_FOUND, code: 200 };
}