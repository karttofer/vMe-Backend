import * as bcrypt from "bcrypt";

export const crypt = (saltMount: number, toBeSalt: string) => {
  const salt = bcrypt.genSaltSync(saltMount);
  const hash = bcrypt.hashSync(toBeSalt, salt);

  return hash;
};
