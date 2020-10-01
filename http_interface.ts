export interface IHttpClient {
  get: (path: string, params: any) => Promise<any>
  post: (path: string, params: any) => Promise<any>
  patch: (path: string, params: any) => Promise<any>
  delete: (path: string) => Promise<any>
}