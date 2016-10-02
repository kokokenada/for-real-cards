
export interface IAccountsAdminState {
  requestInprogress:boolean
}

export interface IAccountsAdminActionPayload {
  userId?:string,
  role?:string,
  add?:boolean,
}



