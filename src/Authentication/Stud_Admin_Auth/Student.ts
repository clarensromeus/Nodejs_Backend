// internal crafted imports of sources
import StudentRegisteration from "../../Assets/StudentRegister";
import { tokenAuth } from "../../utils/Auth";
import { IGetUserAuthInfoRequest } from "../../Assets";
// external imports of sources
import { Request, Response, NextFunction } from "express";
import CreateError from "http-errors";
import jwt from "jsonwebtoken";
import consola from "consola";
import bcryptjs from "bcryptjs";

const { info } = consola;

interface Istuds<T> {
  [index: string]: T;
}

type Idecode = object | string;

let decode: Idecode = {};

const studs: Istuds<string>[] = [];

interface ISRegister<S> {
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
}

export const StudentRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      Firstname,
      Lastname,
      Email,
      Password,
      ConfirmPassword,
    }: ISRegister<string> = await req.body;
    const statusKey = await req.params.status;
    console.log(statusKey);

    // creating a salt of 20 bytes at the maximum for protecting against brute-force attack
    const hash = await bcryptjs.genSalt(10);
    const PasswHash = await bcryptjs.hash(Password, hash);
    const ConfirmPasswHash = await bcryptjs.hash(ConfirmPassword, hash);

    // user credentials
    const stud = {
      student: {
        Firstname,
        Lastname,
        Email,
        Password: PasswHash,
        ConfirmPassword: ConfirmPasswHash,
      },
    };

    const studentForm = await StudentRegisteration(statusKey);
    const studentInit = new studentForm();
    const addStudentInfo = studentInit.setStudentInfo(stud);
    const Student = studentInit.getStudentInfo();

    return res.status(200).json(Student);
  } catch (error) {
    throw CreateError.NotFound(`error from the request at ${error}`);
    next(error);
  } finally {
    info({
      message: "anyway the request tried to invoke",
    });
  }
};

interface ISLogin<T> {
  username: T;
  password: T;
}

export const StudentLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password }: ISLogin<string> = await req.body;
    console.log(username, password);

    const token = await tokenAuth({ username, password }, username);

    console.log(` token is ${token}`);

    return res.status(200).json({ ACCESS_TOKEN: token });
  } catch (error) {
    CreateError.NotFound(`error is because of ${error}`);
    next(error);
  }
};

export const studentInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // res.status(200).json({ student: decode, name: "clarens" });
  res.status(200).json({ message: "runnig pretty well" });
  console.log(`data decryption is ${decode}`);
};

export const tokenVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * todo! what to note about the token
   * to retrieve use the token given by the client via the headers method
   */
  try {
    const authHeader = await req.headers["authorization"];
    // check if there's a header provided then cast the string containing the Bearer
    // and the token into an array then get the token at the indice 1 of the array
    const token = authHeader && authHeader.split(" ")[1];
    // check if is empty
    if (!token) return;

    const decodeToken = await jwt.verify(token, `${process.env.ACCESS_TOKEN}`);
    // if token exist add it to the request to access it through other middlewares
    if (decodeToken) {
      // req.user = decodeToken;
      decode = decodeToken;
      return res.status(200).json({ decode });
      next();
    }
  } catch (error) {
    throw new CreateError.Conflict(`get errored at ${error}`);
    next(error);
  }
};

// i'm using genSalt method to asynchronously generate the salt
// and after i use the hash method to hash the password
// like so --> hash(password,salt)
// generated already in the above code
