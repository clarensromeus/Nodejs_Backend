interface IadminInfo<S> {
  _ID_User: S;
  Firstname: S;
  Lastname: S;
  Email: S;
  Password: S;
  ConfirmPassword: S;
  Image?: S;
}

interface IGetInfo<T> {
  setAdminInfo: addAmin<T>;
  getAdminInfo: shortenAdmin;
}

type shortenAdmin = {
  (): object;
};

type addAmin<T> = {
  (stud: Record<string, IadminInfo<T>>): void;
};

export function AdminRegisteration<U, T>(statusKey: U) {
  return class Admin implements IGetInfo<T> {
    private AdminInfo: Record<string, IadminInfo<T>> = {};

    public setAdminInfo(stud: Record<string, IadminInfo<T>>): void {
      this.AdminInfo = stud;
    }

    public getAdminInfo(): object {
      return this.AdminInfo;
    }
  };
}

export default AdminRegisteration;
