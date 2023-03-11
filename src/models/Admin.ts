import * as mongoose from "mongoose";
import { AdminSchema } from "../schema/index";

// Register Types
interface IRegister<S> {
  _ID: mongoose.Types.ObjectId;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Image: S;
}

const { model } = mongoose;

export const RegisterModelAdmin = model<IRegister<string>>(
  "admin",
  AdminSchema
);
