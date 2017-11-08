import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  MdFormFieldModule,
  MdInputModule,
  MdButtonModule,
  MdSidenavModule,
  MdGridListModule,
  MdTableModule,
  MdDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MdIconModule,
  MdExpansionModule,
  MdSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmojiModule } from 'angular2-emoji';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import { AlertModule } from 'ng2-bootstrap';
import { AppState, INITIAL_STATE } from './store/store';
import reducer from './store/store';
import ApiMiddleware from './middleware/api';
import { AppComponent } from './app.component';
import { ChatComponent } from './views/chat/chat.component';
import {
  LoginComponent,
  LoginFailedDialog
} from './views/login/login.component';
import {
  RegisterComponent,
  RegisterSuccessDialog,
  RegisterFailedDialog
} from './views/register/register.component';
import { AboutComponent } from './views/about/about.component';
import { SidenavComponent } from './views/chat/sidenav/sidenav.component';
import { CreateRoomComponent } from './views/chat/createroom/createroom.component';
import {
  RoomTableComponent,
  JoinLockedRoomDialog,
  RoomJoinFailedDialog,
  LeaveRoomFailedDialog
} from './views/chat/roomtable/roomtable.component';
import { ChatViewComponent } from './views/chat/chatview/chatview.component';
import { InputMessageComponent } from './views/chat/inputmessage/inputmessage.component';
import { MessageContainerComponent } from './views/chat/messagecontainer/messagecontainer.component';
import { MyRoomsComponent } from './views/chat/myrooms/myrooms.component';
import { ChatActions } from './actions/chat';
import { ParticipantsComponent } from './views/chat/participants/participants.component';
import {
  SettingsComponent,
  UserProfileUpdateFailed
} from './views/chat/settings/settings.component';
import { ProfileModalComponent } from './views/chat/profilemodal/profilemodal.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    LoginFailedDialog,
    AboutComponent,
    RegisterComponent,
    RegisterSuccessDialog,
    RegisterFailedDialog,
    SidenavComponent,
    CreateRoomComponent,
    RoomTableComponent,
    JoinLockedRoomDialog,
    RoomJoinFailedDialog,
    LeaveRoomFailedDialog,
    ChatViewComponent,
    InputMessageComponent,
    MessageContainerComponent,
    MyRoomsComponent,
    ParticipantsComponent,
    SettingsComponent,
    UserProfileUpdateFailed,
    ProfileModalComponent
  ],
  imports: [
    NgReduxModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AlertModule.forRoot(),
    EmojiModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    BrowserAnimationsModule,
    MdFormFieldModule,
    MdInputModule,
    MdButtonModule,
    MdSidenavModule,
    MdGridListModule,
    MdTableModule,
    MdDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MdIconModule,
    MdExpansionModule,
    MdSnackBarModule
  ],
  entryComponents: [
    JoinLockedRoomDialog,
    RegisterSuccessDialog,
    RegisterFailedDialog,
    ProfileModalComponent,
    RoomJoinFailedDialog,
    LeaveRoomFailedDialog,
    UserProfileUpdateFailed,
    LoginFailedDialog
  ],
  providers: [ChatActions],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>) {
    ngRedux.configureStore(reducer, INITIAL_STATE, [ ReduxThunk, ApiMiddleware, createLogger()]);
  }
}
