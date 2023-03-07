type IData<T> = {
  Firstname: T;
  Lastname: T;
  Email: T;
  Password: T;
  ConfirmPassword: T;
};

interface Admin<T> {
  __status: "admin" | string;
  data: IData<T>;
}

interface Student<S> {
  __status: "student" | string;
  data: IData<S>;
}

type Student_or_Admin<T> = Admin<T> | Student<T>;

export const isStudent = (
  data: Student_or_Admin<string>
): data is Student<string> => {
  return data.__status === "student";
};
