import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { promisify } from "util";

dotenv.config();

const BCRYPT_TOKEN = promisify(jwt.sign).bind(jwt);

const Access_Token = process.env.ACCESS_TOKEN;

export const tokenAuth = async (data: object, issuer: string) => {
  // const token = await jwt.sign(data, `${Access_Token}`, {
  //@ts-ignore
  const token = await BCRYPT_TOKEN(data, `${Access_Token}`, {
    algorithm: "HS384",
    issuer,
    subject: "personal token",
  });

  return token;
};

// for the secret code i'm using nodejs crypto module by getting from the
// random Bytes and convert it to string to have a more secure and a better
// proffessional hash-looking token secret instead of a simple string
