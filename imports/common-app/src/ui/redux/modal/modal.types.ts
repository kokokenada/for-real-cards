
export interface IModalState<PARAMS,RESULT> { // TODO: Add type paremeters like IModalState<PARAMS, RESULT>
  params:PARAMS,
  result:RESULT,
  component:any,
  lastEvent:string
}

export interface IModalActionPayload {
  component?:any,
  params?:any,
  result?:any
}



