import { API_URL } from '../../main';

export class Fetch {

  callApi (
    method: string,
    headers: object,
    path: string,
    body = null
  ) {
    if (body) {
      return fetch(`${API_URL}${path}`, {
        method: method.toUpperCase(),
        headers: headers,
        body: JSON.stringify(body)
      });
    }
    return fetch(`${API_URL}${path}`, {
      method: method.toUpperCase(),
      headers: headers
    });
  }
}
