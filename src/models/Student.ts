import * as mongoose from "mongoose";
import { SchemaRegister } from "../schema/index";

// Register Types
interface IRegister<S> {
  _ID: mongoose.Types.ObjectId;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
}

const { model } = mongoose;

export const RegisterModel = model<IRegister<string>>(
  "Register",
  SchemaRegister
);
