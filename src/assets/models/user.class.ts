
export class User {
  token: string;
  user: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;

  constructor(obj?: any) {
    this.token = obj ? obj.token : '';
    this.user = obj ? obj.user : '';
    this.username = obj ? obj.username : '';
    this.first_name = obj ? obj.first_name : '';
    this.last_name = obj ? obj.last_name : '';
    this.email = obj ? obj.email : '';
  }

  public toJSON() {
    return {
      token: this.token,
      user: this.user,
      username: this.username,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
    };
  }
}