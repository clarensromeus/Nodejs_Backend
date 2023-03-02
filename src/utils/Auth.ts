import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const Access_Token = process.env.ACCESS_TOKEN;

export const tokenAuth = async (data: object, issuer: string) => {
  const token = await jwt.sign(data, `${Access_Token}`, {
    algorithm: "HS384",
    issuer,
    subject: "personal token",
  });

  return token;
};

// for the secret code i'm using nodejs crypto module by getting from the
// random Bytes and convert it to string to have a more secure and a better
// proffessional hash-looking token secret instead of a simple string
