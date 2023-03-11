import * as mongoose from "mongoose";

const { Schema } = mongoose;

// Register Types
interface IRegister<S> {
  _ID_User: string;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Image?: S;
  SchoolLevel: S;
}

export const SchemaRegister = new Schema<IRegister<string>>({
  _ID_User: { type: String, required: true, trim: true },
  Firstname: {
    type: String,
    required: true,
    trim: true,
  },
  Lastname: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
  },
  Password: {
    type: String,
    required: true,
    trim: true,
  },
  ConfirmPassword: { type: String, required: true, trim: true },
  Image: { type: String, trim: true },
  SchoolLevel: { type: String, trim: true },
});
