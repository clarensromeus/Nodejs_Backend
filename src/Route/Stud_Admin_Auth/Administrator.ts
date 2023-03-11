/* // external imports of sources
import { Request, Response, NextFunction } from "express";
import CreateError from "http-errors";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import consola from "consola";
// internal crafted imports of sources
import AdminRegisteration from "../../Assets/AdminRegister";

const { info } = consola;

interface Istuds<T> {
  [index: string]: T;
}

const studs: Istuds<string>[] = [];

interface ISRegister<S> {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  image?: S;
}

const AdminRegister = async (
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

    const studentForm = await AdminRegisteration(statusKey);
    const studentInit = new studentForm();
    const addStudentInfo = studentInit.setAdminInfo(stud);
    const Student = studentInit.getAdminInfo();

    return res.status(200).json(Student);
  } catch (error) {
    throw CreateError.NotFound(`error from the request at ${error}`);
  } finally {
    info({
      message: "anyway the request tried to invoke",
    });
  }
};

export default AdminRegister;

// i'm using genSalt method to asynchronously generate the salt
// and after i use the hash method to hash the password
// like so --> hash(password,salt)
// generated already in the above code
 */
