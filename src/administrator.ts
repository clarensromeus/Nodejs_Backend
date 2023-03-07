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

interface student<S> {
  __status: "student" | string;
  data: IData<S>;
}

type Student_or_Admin<T> = Admin<T> | student<T>;

export const isAdmin = (
  data: Student_or_Admin<string>
): data is Admin<string> => {
  return data.__status == "admin";
};
