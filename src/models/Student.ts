import * as mongoose from "mongoose";
import { StudentSchema } from "../schema/index";

// Register Types
interface IRegister<S> {
  _ID: mongoose.Types.ObjectId;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Image: S;
  SchoolLevel: S;
}

const { model } = mongoose;

export const RegisterModelStudent = model<IRegister<string>>(
  "Student",
  StudentSchema
);
