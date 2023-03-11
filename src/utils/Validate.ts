import * as joi from "joi";

type IStudent<T> = T | number;

type StudentReg<S> = {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: IStudent<S>;
  ConfirmPassword: IStudent<S>;
  Image?: S;
  SchoolLevel: S;
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
    throw new Error(`spot error at ${error}`);
  }
};

export const AdminLoginValidation = async <T>(
  username: T,
  password: T
): Promise<object> => {
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
    throw new Error(`spot error at ${error}`);
  }
};

export const StudentRegisterValidation = async <T extends string>(
  credentials: StudentReg<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      _ID_User: joi.string().alphanum().min(5).max(50).required(),
      Firstname: joi.string().alphanum().min(4).max(50).required(),
      Lastname: joi.string().alphanum().min(4).max(50).required(),
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
      Image: joi.string(),
      SchoolLevel: joi.string().alphanum().required(),
    });

    const validate = await schema.validate(credentials);

    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};

type IAdmin<T> = T | number;

type Admin<S> = {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: IAdmin<S>;
  ConfirmPassword: IAdmin<S>;
  Image?: S;
};

export const AdminRegisterValidation = async <T extends string>(
  credentials: Admin<T>
): Promise<Promise<object>> => {
  try {
    const schema = await joi.object().keys({
      _ID_User: joi.string().alphanum().min(6).max(50).required(),
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
      Image: joi.string(),
    });

    const validate = await schema.validate(credentials);

    return validate;
  } catch (error) {
    throw new Error(`spot error at ${error}`);
  }
};
