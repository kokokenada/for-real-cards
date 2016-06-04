declare let localStorage:any;

export class Credentials {
  constructor(
    public username:string,
    public email:string,
    public password:string = null
  ) {

  }
  saveCredentials() {
    localStorage.setItem("account-tools.last_email", this.email);
    localStorage.setItem("account-tools.last_username", this.username);
  }

  static getLastCredentials():Credentials {
    return new Credentials (
      localStorage.getItem('account-tools.last_username'),
      localStorage.getItem('account-tools.last_email')
    )
  }
}

