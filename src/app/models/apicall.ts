export class ApiCall {
  path: string;
  method: string;
  types: Array<string>;
  data: any;

  constructor(
    method,
    path,
    types,
    data = null
  ) {
    this.method = method;
    this.path = path;
    this.types = types;
    this.data = data;
  }
}
