interface IstudentInfo<S> {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Image?: S;
  SchoolLevel: S;
}

interface IGetInfo<T> {
  setStudentInfo: addStud<T>;
  getStudentInfo: shortenStud;
}

type shortenStud = {
  (): object;
};

type addStud<T> = {
  (stud: Record<string, IstudentInfo<T>>): void;
};

export function StudentRegisteration<T>(statusKey: T) {
  return class Student implements IGetInfo<T> {
    private studentInfo: Record<string, IstudentInfo<T>> = {};

    public setStudentInfo(stud: Record<string, IstudentInfo<T>>): void {
      this.studentInfo = stud;
    }

    public getStudentInfo(): object {
      return this.studentInfo;
    }
  };
}

// i am creating a class to get access to Student Registeration credentials
// and get them via the GetStudentInfo method declared in the class
