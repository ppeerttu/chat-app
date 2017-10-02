
export class Fetch {

  callApi (
    method: string,
    headers: object,
    path: string,
    body = null
  ) {
    if (body) {
      return fetch(`http://localhost:3000/${path}`, {
        method: method.toUpperCase(),
        headers: headers,
        body: JSON.stringify(body)
      });
    }
    return fetch(`http://localhost:3000/${path}`, {
      method: method.toUpperCase(),
      headers: headers
    });
  }
}
