import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl;

export class Fetch {

  callApi (
    method: string,
    headers: object,
    path: string,
    body = null
  ) {
    const head: Headers = new Headers();
    const keys = Object.keys(headers);
    keys.map(key => {
      head.append(key, headers[key]);
    });
    if (body) {
      return fetch(`${API_URL}/api/${path}`, {
        method: method.toUpperCase(),
        headers: head,
        body: JSON.stringify(body)
      });
    }
    return fetch(`${API_URL}/api/${path}`, {
      method: method.toUpperCase(),
      headers: head
    });

  }
}
