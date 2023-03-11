// internal crafted imports of sources
import { StudentRegisteration, AdminRegisteration } from "../../Assets/index";
import { tokenAuth } from "../../utils/Auth";
import { IGetUserAuthInfoRequest } from "../../Assets";
import {
  StudentLoginValidation,
  StudentRegisterValidation,
  AdminRegisterValidation,
  AdminLoginValidation,
} from "../../utils/index";
import { RegisterModelStudent, RegisterModelAdmin } from "../../models/index";
import { SendPhone_Verification } from "../../utils/PhoneVerification";
import { sendMail } from "../../utils/SendMail";
import { isStudent, isStudentLogin } from "../../students";
import { isAdmin, isAdminLogin } from "../../administrator";
import { UseRandomStudent } from "../../SeedStudents";
// external imports of sources
import { Request, Response, NextFunction } from "express";
import CreateError from "http-errors";
import jwt from "jsonwebtoken";
import consola from "consola";
import bcryptjs from "bcryptjs";
import { promisify } from "util";
import { REDIS_CLIENT } from "../../constants";

const { info, success } = consola;

const BCRYPT_SALT = promisify(bcryptjs.genSalt).bind(bcryptjs);
const BCRYPT_HASH = promisify(bcryptjs.hash).bind(bcryptjs);
const BCRYPT_COMPARE = promisify(bcryptjs.compare).bind(bcryptjs);

interface ISRegister<S> {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Image?: S;
  SchoolLevel: S;
}

interface Credentials {
  DataStudent: ISRegister<string>;
  DataAdmin: Omit<ISRegister<string>, "SchoolLevel">;
}

export const StudentAdminRegister = async (
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
      Image,
    }: ISRegister<string> = await req.body;
    const statusKey = await req.params.status;
    console.log(statusKey);

    // creating a salt of 20 bytes at the maximum for protecting against brute-force attack
    //@ts-ignore
    const hash: number = await BCRYPT_SALT(10);
    //@ts-ignore
    const PasswHash = await BCRYPT_HASH(Password, hash);
    //@ts-ignore
    const ConfirmPasswHash = await BCRYPT_HASH(ConfirmPassword, hash);

    const Level: string[] = ["kindergaten", "primary school", "secondary"];
    const SchoolLevel: string = Level[Math.floor(Math.random() * Level.length)];

    // using this pattern for generating robust User credentials security for incoming and outcoming data
    const LettersFromFirstname: string = Firstname.substring(0, 3);
    const LettersFromLastname: string = Lastname.substring(Lastname.length - 3);
    const RandomDigits: number = Math.floor(Math.random() * 100_000);
    const Id_User: string = LettersFromFirstname.concat(
      RandomDigits.toString(),
      LettersFromLastname
    );

    // student credentials
    const credentials: Credentials = {
      DataStudent: {
        _ID_User: Id_User,
        Firstname,
        Lastname,
        Email,
        Password: PasswHash,
        ConfirmPassword: ConfirmPasswHash,
        Image,
        SchoolLevel,
      },
      DataAdmin: {
        _ID_User: Id_User,
        Firstname,
        Lastname,
        Email,
        Password: PasswHash,
        ConfirmPassword: ConfirmPasswHash,
        Image,
      },
    };

    const StudentInfo: ISRegister<string> = credentials["DataStudent"];
    const AdminInfo: Omit<ISRegister<string>, "SchoolLevel"> = credentials[
      "DataAdmin"
    ];

    if (isStudent({ __status: `${statusKey}`, Info: StudentInfo })) {
      console.log(" i am a student");
      // validate students credentials
      const Is_valid = await StudentRegisterValidation(
        credentials["DataStudent"]
      );
      // check if fields validation are ok
      if (Is_valid) {
        // @ts-ignore
        const { value } = Is_valid;
        // tokenize the student data
        const token = await tokenAuth(value, `${Firstname} ${Lastname}`);
        console.log(token);

        const studentForm = await StudentRegisteration(statusKey);
        const studentInit = new studentForm();
        console.log(SchoolLevel);

        const addStudentInfo = studentInit.setStudentInfo({
          student: credentials["DataStudent"],
        });
        const Student = studentInit.getStudentInfo();

        console.log(value);
        const Data = await RegisterModelStudent.create(value);
        // @ts-ignore
        await Data.save();

        console.log(value);

        return res.status(200).json({ data: Student, tokenStudent: token });
        next();
      }
    }

    if (isAdmin({ __status: `${statusKey}`, Info: AdminInfo })) {
      // validate students credentials
      const Is_Valid = await AdminRegisterValidation(credentials["DataAdmin"]);

      // check whether fields validation is ok
      if (Is_Valid) {
        //@ts-ignore
        const { value } = Is_Valid;
        // tokenize the admin data
        const token = await tokenAuth(value, `${Firstname} ${Lastname}`);
        console.log(token);

        const AdminForm = await AdminRegisteration(statusKey);
        const AdminInit = new AdminForm();
        const addAmin = await AdminInit.setAdminInfo({
          admin: credentials["DataAdmin"],
        });
        const Admin = await AdminInit.getAdminInfo();

        console.log(value);
        const Data = await RegisterModelAdmin.create(value);
        // @ts-ignore
        await Data.save();

        return res.status(200).json({ data: Admin, tokenAdmin: token });
        next();
      }
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

interface IStudentLogin<T> {
  __status: T;
  Data: { username: T; password: T };
}

export const StudentAdminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password }: ISLogin<string> = await req.body;

    const status = await req.params.status;

    const InfoStudent: IStudentLogin<string> = {
      __status: `${status}`,
      Data: { username: "", password: "" },
    };
    const InfoAdmin: IStudentLogin<string> = {
      __status: `${status}`,
      Data: { username: "", password: "" },
    };

    if (isStudentLogin(InfoStudent)) {
      const Is_valid = await StudentLoginValidation(username, password);

      const name: string[] = username.split(" ");
      const Studentcredentials = await REDIS_CLIENT.EXISTS(`${name[0]}`);
      // check whether the token exists
      if (Studentcredentials) {
        const credentials: string | null = await REDIS_CLIENT.GET(`${name[0]}`);
        const StudData: object = await JSON.parse(`${credentials}`);
        //@ts-ignore
        const { Password } = StudData;
        console.log(`${StudData}`);
        // const rs = await UseRandomStudent();
        const db = await RegisterModelStudent.findOne({
          Firstname: name[0],
          Lastname: name[1],
        })
          .where({ _ID_User: "pro82121ich" })
          .select("Firstname Lastname Password");
        console.log(db);

        const Firstname: string = name[0];
        const Lastname: string = name[1];
        //@ts-ignore
        const COMPARE_HASH = await BCRYPT_COMPARE(
          `${password}`,
          `${db?.Password}`
        );
        const FirstandLastname =
          Firstname === `${db?.Firstname}` && Lastname === `${db?.Lastname}`;

        console.log(FirstandLastname);
        console.log(COMPARE_HASH);
        if (db && COMPARE_HASH && FirstandLastname) {
          console.log(
            //@ts-ignore
            `successfully logged in name ${db.Firstname}and password ${db.Lastname}`
          );
          return res.status(200).json({
            Data: `login successfully ${db.Firstname} with ${db.Password}`,
            status,
          });
          next();
        } else {
          return res.status(200).json({
            Data: `username or password is not compatible`,
            status,
          });
        }
      }
    }

    if (isAdminLogin(InfoAdmin)) {
      const Is_valid = await AdminLoginValidation(username, password);
      // @ts-ignore
      const { value } = Is_valid;

      /* const token = Is_valid && (await tokenAuth(Is_valid, username)); */
      const name: string[] = username.split(" ");
      const Admincredentials = await REDIS_CLIENT.EXISTS(`${name[0]}`);
      // check whether the token exists
      if (Admincredentials) {
        const credentials: string | null = await REDIS_CLIENT.GET(`${name[0]}`);
        const AdminData: object = await JSON.parse(`${credentials}`);
        //@ts-ignore
        const { Password } = AdminData;
        // const rs = await UseRandomStudent();
        const db = await RegisterModelAdmin.findOne({
          Firstname: name[0],
          Lastname: name[1],
        })
          .where({ _ID_User: "rom60346ens" })
          .select("Firstname Lastname Password");
        console.log(db);

        const Firstname: string = name[0];
        const Lastname: string = name[1];
        //@ts-ignore
        const COMPARE_HASH = await BCRYPT_COMPARE(
          `${password}`,
          `${db?.Password}`
        );
        const FirstandLastname =
          Firstname === `${db?.Firstname}` && Lastname === `${db?.Lastname}`;

        console.log(FirstandLastname);
        console.log(COMPARE_HASH);

        if (db && COMPARE_HASH && FirstandLastname) {
          console.log(
            //@ts-ignore
            `successfully logged in name ${db.Firstname}and password ${db.Lastname}`
          );
          return res.status(200).json({
            Data: `login successfully ${db.Firstname} with ${db.Password}`,
            status,
          });
          next();
        } else {
          return res.status(200).json({
            Data: `username or password is not compatible`,
            status,
          });
        }
      }
    }
    // check if credentials are of good types
  } catch (error) {
    CreateError.NotFound(`error is because of ${error}`);
    next(error);
  }
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
      /* const cacheToken = (decode = decodeToken); */
      const cacheToken = decodeToken;
      const username: string = req.body.username.split(" ")[0];
      // cache student token on the server for one-time login access using redis db
      const tokenExist = await REDIS_CLIENT.EXISTS(`${username}`);
      if (!tokenExist) {
        await REDIS_CLIENT.SETEX(
          `${username}`,
          8035200,
          JSON.stringify(decodeToken)
        );
      }
      next();
    }
  } catch (error) {
    throw new CreateError.Conflict(`get errored at ${error}`);
    next(error);
  }
};

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
    //const { DESTINATION, SUBJECT, HTMLBODY, MESSAGE } = await req.body;
    // providing mail info
    await SendPhone_Verification();
    await res.status(200).json({
      message: success({ message: "sms sent with success", badge: true }),
    });
  } catch (error) {
    throw CreateError.Unauthorized(`${error}`);
  }
};

// i'm using genSalt method to asynchronously generate the salt
// and after i use the hash method to hash the password
// like so --> hash(password,salt)
// generated already in the above code
