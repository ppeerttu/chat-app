
import { Fetch } from './fetch';

const fetch = new Fetch();

function getHeaders(base: object) {
  let jwtHeader;
  if (window.localStorage) {
    let token = window.localStorage.getItem('token');
    if (token) {
      jwtHeader = {
        'Authorization': `Bearer ${token}`
      };
    }
  } else {
    throw new Error('LocalStorage unsupported!');
  }

  return Object.assign({}, base, jwtHeader);
}

function request(method, path, data) {
  let baseHeaders = {
    'Content-Type': 'application/json'
  };
  return fetch.callApi(method, getHeaders(baseHeaders), path, data);
}

/**
 * Redux Middleware for handling asynchronous API call flow
 */
export default () => next => action => {
  if (!action.apiCall) {
    return next(action);
  }

  const {method, path, types, data} = action.apiCall;

  if (!method) {
    throw new Error('API request method should be defined.');
  }
  if (!path) {
    throw new Error('API request path should be defined.');
  }
  if (!types || types.length < 3) {
    throw new Error(`Define API request types as:
                    [requestType, successType, errorType].`);
  }

  // Transform base apiCall action to normal action handled by reducers
  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction.apiCall;
    return finalAction;
  }

  // If response contains auth token, store it to localstorage and remove it
  // from forwarded action data
  function filterToken(data) {
    const actionData = Object.assign({}, data);
    if (actionData.type == 'LOGIN_SUCCESS' || actionData.type == 'TOKEN_REQUEST_SUCCESS') {
      if (window.localStorage) {
        window.localStorage.setItem('token', actionData.res.token);
        delete actionData.res.token;
      } else {
        throw new Error('LocalStorage unsupported!');
      }
    } else if (actionData.type == 'LOGOUT_SUCCESS') {
      if (window.localStorage) {
        window.localStorage.removeItem('token');
      }
    }
    return actionData;
  }

  const [requestType, successType, errorType] = types;
  // Forwards requestType action down the middleware stack
  next(actionWith({type: requestType, data: data}));
  return request(method, path, data).then(
    res => {
      let type;
      if (res.status >= 400) {
        type = errorType;
        return res.text().then(textData => {
          return next(actionWith(filterToken({
            res: textData,
            type: type
          })));
        });
      } else {
        type = successType;
        return res.json().then(jsonData => {
          return next(actionWith(filterToken({
            res: jsonData,
            type: type
          })));
        });
      }
    }).catch(err => {
      console.error(err);
      return next(actionWith(filterToken({
        error: 'Not able to connect to the service',
        type: errorType
      })));
    })
};
