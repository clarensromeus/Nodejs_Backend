interface IstudentInfo<S> {
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
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

function StudentRegisteration<T>(statusKey: T) {
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

export default StudentRegisteration;

// i am creating a class to get access to Student Registeration credentials
// and get them via the GetStudentInfo method declared in the class
