
export interface IModalState { // TODO: Add type paremeters like IModalState<PARAMS, RESULT>
  params:any,
  result:any,
  opening:boolean,
  closing:boolean,
  displaying:boolean,
  component:any;
}

export interface IModalActionPayload {
  component?:any,
  params?:any,
  result?:any
}



