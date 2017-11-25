import { production } from '../main';
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
  MdSnackBarModule,
  MdTooltipModule
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
import { HelpComponent } from './views/help/help.component';
import {
  SidenavComponent,
  RoomModal
} from './views/chat/sidenav/sidenav.component';
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
import {
  ChatActions,
  RoomActions,
  UserActions
} from './actions';
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
    path: 'help',
    component: HelpComponent
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
    HelpComponent,
    RegisterComponent,
    RegisterSuccessDialog,
    RegisterFailedDialog,
    SidenavComponent,
    RoomModal,
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
      { enableTracing: !production }
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
    MdSnackBarModule,
    MdTooltipModule
  ],
  entryComponents: [
    JoinLockedRoomDialog,
    RegisterSuccessDialog,
    RegisterFailedDialog,
    ProfileModalComponent,
    RoomJoinFailedDialog,
    LeaveRoomFailedDialog,
    UserProfileUpdateFailed,
    LoginFailedDialog,
    RoomModal
  ],
  providers: [ChatActions, RoomActions, UserActions],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>) {
    if (production) {
      ngRedux.configureStore(reducer, INITIAL_STATE, [ ReduxThunk, ApiMiddleware]);
    } else {
      ngRedux.configureStore(reducer, INITIAL_STATE, [ ReduxThunk, ApiMiddleware, createLogger()]);
    }
  }
}
