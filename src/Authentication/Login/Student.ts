import { Request, Response, NextFunction } from "express";
import CreateError from "http-errors";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

interface ISlogin<S> {
  username: S;
  password: S;
  statusKey: S;
}

const LoginStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password }: { username: string; password: string } =
    await req.body;
};

export default LoginStudent;
