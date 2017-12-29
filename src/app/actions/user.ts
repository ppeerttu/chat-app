import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ApiCall, AppState } from '../models';

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

  static REGISTER_REQUEST = 'REGISTER_REQUEST';
  static REGISTER_SUCCESS = 'REGISTER_SUCCESS';
  static REGISTER_FAILED = 'REGISTER_FAILED';

  static USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST';
  static USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS';
  static USER_UPDATE_FAILED = 'USER_UPDATE_FAILED';

  constructor(private ngRedux: NgRedux<AppState>) {}

  login(userName: string, password: string) {
    const apiCall = new ApiCall(
      'post',
      'users/login',
      [UserActions.LOGIN_REQUEST, UserActions.LOGIN_SUCCESS, UserActions.LOGIN_FAILED],
      {userName, password}
    );
    return this.ngRedux.dispatch(this.thunk(UserActions.LOGIN_REQUEST, apiCall));
  }

  logout(): any {
    const apiCall = new ApiCall(
      'post',
      'users/logout',
      [UserActions.LOGOUT_REQUEST, UserActions.LOGOUT_SUCCESS, UserActions.LOGOUT_FAILED]
    );
    return this.ngRedux.dispatch(this.thunk(UserActions.LOGOUT_REQUEST, apiCall));
  }

  refreshToken() {
    const apiCall = new ApiCall(
      'get',
      'users/token',
      [UserActions.TOKEN_REQUEST, UserActions.TOKEN_REQUEST_SUCCESS, UserActions.TOKEN_REQUEST_FAILED]
    );
    return this.ngRedux.dispatch(this.thunk(UserActions.TOKEN_REQUEST, apiCall));
  }

  register(userName: string, firstName: string, lastName: string, email: string, password: string): any {
    if (!password) password = null;
    const apiCall = new ApiCall(
      'post',
      'users/register',
      [UserActions.REGISTER_REQUEST, UserActions.REGISTER_SUCCESS, UserActions.REGISTER_FAILED],
      {userName, firstName, lastName, email, password}
    );
    return this.ngRedux.dispatch(this.thunk(UserActions.REGISTER_REQUEST, apiCall));
  }

  update(id: number, userName: string, firstName: string, lastName: string, email: string, password: string): any {
    if (!password) password = null;
    const apiCall = new ApiCall(
      'put',
      'users/update',
      [UserActions.USER_UPDATE_REQUEST, UserActions.USER_UPDATE_SUCCESS, UserActions.USER_UPDATE_FAILED],
      {id, userName, firstName, lastName, email, password}
    );
    return this.ngRedux.dispatch(this.thunk(UserActions.USER_UPDATE_REQUEST, apiCall));
  }

  private thunk(type, apiCall: ApiCall): any {
    return (dispatch) => dispatch({ type, apiCall });
  }

}
