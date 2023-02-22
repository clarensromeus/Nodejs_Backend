import * as joi from "joi";
import createError from "http-errors";

type IStudent<S> = S | number;

interface Student<S> {
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: IStudent<S>;
  ConfirmPassword: IStudent<S>;
}

export const StudentLoginValidation = async <T>(
  username: T,
  password: T
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      username: joi.string().alphanum().min(4).max(30),
      password: joi.string().alphanum().min(4).max(30),
    });

    const validate = await schema.validate(
      { username, password },
      { presence: "required" }
    );
    return validate;
  } catch (error) {
    throw new createError.NotFound(error);
  }
};

export const AdminLoginValidation = async () => {};

export const StudentRegisterValidation = async <T>(
  credentials: Student<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      Firstname: joi.string().alphanum().min(4).max(30),
      Lastname: joi.string().alphanum().min(4).max(30),
      Email: joi.string().alphanum().min(4).max(30),
      Password: joi
        .string()
        .pattern(new RegExp(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/)),
    });

    const validate = await schema.validate(credentials);

    return validate;
  } catch (error) {
    throw new createError.NotFound(error);
  }
};

export const AdminRegisterValidation = async () => {};
