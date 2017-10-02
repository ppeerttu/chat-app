import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../store/store';
import { ApiCall } from '../models/apicall';

@Injectable()
export class UserActions {
  static LOGIN_REQUEST = 'LOGIN_REQUEST';
  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
  static LOGIN_FAILED = 'LOGIN_FAILED';

  static LOGOUT_REQUEST = 'LOGOUT_REQUEST';
  static LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
  static LOGOUT_FAILED = 'LOGOUT_FAILED';

  static TOKEN_REQUEST = 'TOKEN_REQUEST';
  static TOKEN_REQUEST_SUCCESS = 'TOKEN_REQUEST_SUCCESS';
  static TOKEN_REQUEST_FAILED = 'TOKEN_REQUEST_FAILED';

  constructor(private ngRedux: NgRedux<AppState>) {}

  login(userName: string, password: string) {
    const apiCall = new ApiCall(
      'post',
      'users/login',
      [UserActions.LOGIN_REQUEST, UserActions.LOGIN_SUCCESS, UserActions.LOGIN_FAILED],
      {userName, password}
    );
    this.ngRedux.dispatch({ type: UserActions.LOGIN_REQUEST, apiCall});
  }

  logout(): any {
    const apiCall = new ApiCall(
      'post',
      'users/logout',
      [UserActions.LOGOUT_REQUEST, UserActions.LOGOUT_SUCCESS, UserActions.LOGOUT_FAILED]
    );
    function thunk(apiCall) {
      return function (dispatch) {
        return dispatch({type: UserActions.LOGOUT_REQUEST, apiCall});
      }
    }
    return this.ngRedux.dispatch(thunk(apiCall));
  }

  refreshToken() {
    const apiCall = new ApiCall(
      'get',
      'users/token',
      [UserActions.TOKEN_REQUEST, UserActions.TOKEN_REQUEST_SUCCESS, UserActions.TOKEN_REQUEST_FAILED]
    );
    function thunk(apiCall) {
      return function (dispatch) {
        return dispatch({type: UserActions.TOKEN_REQUEST, apiCall})
      }
    }
    return this.ngRedux.dispatch(thunk(apiCall));
  }

}
