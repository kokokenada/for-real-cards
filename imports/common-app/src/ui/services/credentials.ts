declare let localStorage:any;

export class Credentials {
  constructor(
    public username:string,
    public email:string,
    public password:string = null
  ) {

  }
  saveCredentials() {
    if (this.email && this.email.length>0)
      localStorage.setItem("account-tools.last_email", this.email);
    else
      localStorage.removeItem("account-tools.last_email");
    if (this.username && this.username.length>0)
      localStorage.setItem("account-tools.last_username", this.username);
    else
      localStorage.removeItem("account-tools.last_username");
  }
  
  private static cleanValue(key:string):string {
    let str = localStorage.getItem(key);
    if (!str || str==="null")
      return "";
    return str;
  }

  static getLastCredentials():Credentials {
    return new Credentials (
      Credentials.cleanValue('account-tools.last_username'),
      Credentials.cleanValue('account-tools.last_email')
    )
  }
}

