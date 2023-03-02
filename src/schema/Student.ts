import * as mongoose from "mongoose";

const { Schema } = mongoose;

// Register Types
interface IRegister<S> {
  _ID: mongoose.Types.ObjectId;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
}

export const SchemaRegister = new Schema<IRegister<string>>({
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
