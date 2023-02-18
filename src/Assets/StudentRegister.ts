interface IstudentInfo<S> {
  firstname: S;
  lastname: S;
  email: S;
  password: S;
  confirmPassword: S;
}

interface IGetInfo {
  getStudentInfo: shortenStud<string>;
}

type shortenStud<T> = {
  (info: IstudentInfo<T>): void;
};

function AdminStudent<U>(statusKey: U) {
  return class Student implements IGetInfo {
    private studentInfo: Record<string, IstudentInfo<string>> = {};

    getStudentInfo(info: IstudentInfo<string>): void {}
  };
}

export default AdminStudent;
