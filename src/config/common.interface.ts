export interface CRUD {
  list: (limit: number, page: number) => Promise<any>;
  create: (resource: any) => Promise<any>;
  put: (id: string, resource: any) => Promise<string>;
  show: (id: string) => Promise<any>;
  delete: (id: string) => Promise<string>;
  patch: (id: string, resource: any) => Promise<string>;
}

export interface Result {
  code: number,
  status: string,
  message: string,
  data?: any,
  meta?: any
}