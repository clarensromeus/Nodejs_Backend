import { faker } from "@faker-js/faker";

type IStatus = "admin" | "student";

const status: IStatus = "admin";

class Admin<T> {
  Firstname: T;
  Lastname: T;
  Email: T;
  Password: T;
  ConfirmPassword: T;
  Status: IStatus;
  Image: T;
}

type IAdmin<T> = Promise<Record<string, Admin<T>>>;

async function createRandomAdmin(Data: Admin<string>): Promise<IAdmin<string>> {
  const Admin = await Data;
  return { student: Admin };
}

export const UseRandomAdmin = async (): Promise<Promise<{}>> => {
  try {
    const Password = faker.internet.password(
      16,
      true,
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    );
    const ConfirmPassword = faker.internet.password(
      16,
      true,
      undefined,
      Password
    );

    const result = await {
      Firstname: faker.name.firstName(),
      Lastname: faker.name.lastName(),
      Email: faker.internet.email(),
      Password,
      ConfirmPassword,
      Status: status,
      Image: faker.internet.avatar(),
    };

    return createRandomAdmin(result);
  } catch (error) {
    throw new Error(`${error}`);
  }
};
