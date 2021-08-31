export interface CRUD {
  list: (limit: number, page: number) => Promise<any>;
  create: (resource: any) => Promise<any>;
  put: (id: string, resource: any) => Promise<any>;
  show: (id: string) => Promise<any>;
  delete: (id: string) => Promise<any>;
  patch: (id: string, resource: any) => Promise<any>;
}

export interface Result {
  code: number,
  status: string,
  message: string,
  data?: any,
  meta?: any
}