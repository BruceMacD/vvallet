import { fetcher } from "./fetcher";

const url = "https://api.github.com/users/:user"

export const github = async (user: string): Promise<any> => {
    const verification_url = url.replace(":user", user)
  
    return await fetcher(verification_url)
};