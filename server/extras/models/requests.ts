/*
 USER ROUTES
*/
export interface ILoginPost {
  email: string;
  password: string;
}

export interface IUserEditPost {
  last_name: string;
  nick_name: string;
  github_user: string;
  linkedIn_user: string;
  user_img: string;
  user_unique_token: string;
}
/*
 CREATE ROUTES
*/
export interface ICreateAccountPost {
  nick_name: string;
  fist_name: string;
  last_name: string;
  user_img: string;
  password: string;
  email: string;
  location: string;
  linkedIn_user: string;
  github_user: string;
}
export interface IResetPasswordMagicLinkPost {
  email: string;
}
export interface IResetPasswordPost {
  user_unique_token: string;
  new_password: string;
}
/*
  RUN
 */
export interface RunInterface {
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