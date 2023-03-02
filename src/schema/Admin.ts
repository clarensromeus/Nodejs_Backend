import * as mongoose from "mongoose";

const { Schema, Types } = mongoose;

// Login Types
interface IAdmin<T> {
  username: T;
  password: T;
}

type UpAdmin<T> = {
  [P in keyof T as `${Capitalize<string & P>}`]: T[P];
};

// Register Types
interface IRegister<S> {
  _ID: mongoose.Types.ObjectId;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
}

// Login Schema
export const Login = new Schema<UpAdmin<IAdmin<string>>>({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
    trim: true,
  },
});

// Register Schema
export const Register = new Schema<IRegister<string>>({
  _ID: mongoose.Schema.Types.ObjectId,
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
});
