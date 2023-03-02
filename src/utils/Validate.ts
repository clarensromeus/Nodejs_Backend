import * as joi from "joi";
import createError from "http-errors";

type IStudent<T> = T | number;

type StudentReg<S> = {
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: IStudent<S>;
  ConfirmPassword: IStudent<S>;
};

interface StudentLog<T> {
  username: T;
  password: T;
}

export const StudentLoginValidation = async <T>(
  username: T,
  password: T
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      username: joi.string().min(4).max(50).required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
          )
        )
        .max(50)
        .required(),
    });

    const validate = await schema.validate(
      { username, password },
      { presence: "required" }
    );
    return validate;
  } catch (error) {
    throw new createError.NotFound(`spot error at ${error}`);
  }
};

export const AdminLoginValidation = async () => {};

export const StudentRegisterValidation = async <T extends string>(
  credentials: StudentReg<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      Firstname: joi.string().alphanum().min(4).max(30).required(),
      Lastname: joi.string().alphanum().min(4).max(30).required(),
      Email: joi
        .string()
        .pattern(new RegExp(/^\b[\w-.]+@([\w-]+\.)+[\w-]{2,4}\b$/))
        .max(30),
      Password: joi
        .string()
        .pattern(
          new RegExp(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
          )
        )
        .required(),
      ConfirmPassword: joi.ref("Password"),
    });

    const validate = await schema.validate(credentials);

    return validate;
  } catch (error) {
    throw new createError.NotFound(`spot error at ${error}`);
  }
};

export const AdminRegisterValidation = async () => {};
