import { faker } from "@faker-js/faker";

type IStatus = "student" | "admin";
type ISchoolLevel = "kindergaten" | "primary school" | "secondary";

const status: IStatus = "student";
const SchoolLevel: ISchoolLevel[] = [
  "kindergaten",
  "primary school",
  "secondary",
];

class Student<T> {
  Firstname: T;
  Lastname: T;
  Email: T;
  Password: T;
  ConfirmPassword: T;
  Status: IStatus;
  Image: T;
  SchoolLevel: ISchoolLevel;
}

type IStudent<T> = Promise<Record<string, Student<T>>>;

async function createRandomStudent(
  Data: Student<string>
): Promise<IStudent<string>> {
  const Student = await Data;
  return { student: Student };
}

export const UseRandomStudent = async () => {
  try {
    const Password = await faker.internet.password(
      16,
      true,
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    );
    const ConfirmPassword = await faker.internet.password(
      16,
      true,
      undefined,
      Password
    );

    const result = {
      Firstname: faker.name.firstName(),
      Lastname: faker.name.lastName(),
      Email: faker.internet.email(),
      Password,
      ConfirmPassword,
      Status: status,
      Image: faker.internet.avatar(),
      SchoolLevel: faker.helpers.arrayElement(SchoolLevel),
    };
    return await createRandomStudent(result);
  } catch (error) {
    throw new Error(`${error}`);
  }
};
