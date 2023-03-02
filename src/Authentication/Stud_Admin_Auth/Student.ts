// internal crafted imports of sources
import { StudentRegisteration } from "../../Assets/StudentRegister";
import { tokenAuth } from "../../utils/Auth";
import { IGetUserAuthInfoRequest } from "../../Assets";
import {
  StudentLoginValidation,
  StudentRegisterValidation,
} from "../../utils/index";
import { RegisterModel } from "../../models/index";
import { SendPhone_Verification } from "../../utils/PhoneVerification";
import { sendMail } from "../../utils/SendMail";
// external imports of sources
import { Request, Response, NextFunction } from "express";
import CreateError from "http-errors";
import jwt from "jsonwebtoken";
import consola from "consola";
import bcryptjs from "bcryptjs";
import { promisify } from "util";
import passport from "passport";

const { info } = consola;

const BCRYPT_SALT = promisify(bcryptjs.genSalt).bind(bcryptjs);
const BCRYPT_HASH = promisify(bcryptjs.hash).bind(bcryptjs);
const BCRYPT_COMPARE = promisify(bcryptjs.compare).bind(bcryptjs);

type Idecode = object | string;

let decode: Idecode = {};

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

    // const Is_valid = StudentRegisterValidation()

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

    // store credentials to the database

    const Is_valid = await StudentRegisterValidation(stud["student"]);

    if (Is_valid) {
      const studentForm = await StudentRegisteration(statusKey);
      const studentInit = new studentForm();

      const addStudentInfo = studentInit.setStudentInfo(stud);
      const Student = studentInit.getStudentInfo();
      //@ts-ignore
      const { value } = Is_valid;
      const student = await RegisterModel.create(value);
      // @ts-ignore
      await student.save();

      console.log(value);

      return res.status(200).json(Student);
      next();
    }
  } catch (error) {
    throw CreateError.NotFound(`error from the request at ${error}`);
    next(error);
  } finally {
    info({
      message: "anyway the request is invoked",
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

    // check if credentials are of good types
    const Is_valid = await StudentLoginValidation(username, password);
    consola.warn({ message: Is_valid });

    const token = Is_valid && (await tokenAuth(Is_valid, username));
    // const token = await tokenAuth({ username, password }, username);
    console.log(token);

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
};

export const tokenVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Todo ! what to note about the token
   * to retrieve use the token given by the client via the headers method
   */
  try {
    const authHeader = await req.headers["authorization"];
    // check if there's a header provided then cast the string containing the Bearer
    // and the token into an array then get the token at the indice 1 of the array
    const token = authHeader && authHeader.split(" ")[1];
    // check if token is empty
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

// FACEBOOK Authentication steps
// /auth/facebook route
export async function FACEBOOK_LOGIN() {
  try {
    await passport.authenticate("facebook", {
      scope: ["public_profile", "email"],
      session: false, // manage session with REDIS and Localstorage instead
    });
  } catch (error) {
    throw Error(`${error}`);
  }
}

// route for returning failure or success message
// /auth/facebook/callback
export async function FACEBOOK_CALLBACK() {
  await passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
    async function (req: Request, res: Response) {
      // Successful authentication, redirect home.
      try {
        res.redirect("/home");
      } catch (error) {
        throw Error(`${error}`);
      }
    };
}

// GOOGLE Auth
// login/Google route
export async function GOOGLE_LOGIN() {
  try {
    await passport.authenticate("google");
  } catch (error) {
    throw Error(`${error}`);
  }
}

// route for returning failure or success callback
// auth/google/callback
export async function GOOGLE_CALLBACK() {
  await passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
    async function (req: Request, res: Response) {
      try {
        res.redirect("/");
      } catch (error) {
        throw Error(`${error}`);
      }
    };
}

// GITHUB Auth
// auth/github route
export async function GITHUB_LOGIN() {
  try {
    await passport.authenticate("github");
  } catch (error) {
    throw Error(`${error}`);
  }
}
// route for returning failure or success callback
// auth/github/callback
export async function GITHUB_CALLBACK() {
  await passport.authenticate("github", { failureRedirect: "/github/fail" }),
    async function (req, res) {
      // Successful authentication, redirect home.
      try {
        res.redirect("/");
      } catch (error) {
        throw Error(`${error}`);
      }
    };
}

// SENDMAIL with nodemailer
export const SendingMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { DESTINATION, SUBJECT, HTMLBODY, MESSAGE } = await req.body;
    // providing mail info
    await sendMail(DESTINATION, SUBJECT, HTMLBODY, MESSAGE);
    res
      .status(200)
      .json({ message: `message sent successfully to ${DESTINATION}` });
  } catch (error) {
    throw new Error(`${error}`);
  }
};

// SEND PHONE VERIFICATION
export const SendPhoneVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // REDIS_CLIENT.SET("username", req.body.username);

  try {
    const { DESTINATION, SUBJECT, HTMLBODY, MESSAGE } = await req.body;
    // providing mail info
    await SendPhone_Verification();
  } catch (error) {
    throw CreateError.Unauthorized(`${error}`);
  }
};

// i'm using genSalt method to asynchronously generate the salt
// and after i use the hash method to hash the password
// like so --> hash(password,salt)
// generated already in the above code
