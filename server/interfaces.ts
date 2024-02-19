export interface IRegistrationBodyPost {
    user_name: string
    fist_name: string
    last_name: string
    user_img: string
    password: string
    email: string
    location: string
    linkedIn_user: string
    github_user: string
}

export interface ILoginPost {
    email: string,
    password: string
}