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
