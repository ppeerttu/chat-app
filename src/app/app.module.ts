import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule,
  MatSidenavModule,
  MatGridListModule,
  MatTableModule,
  MatDialogModule,
  MatFormFieldModule,
  MatListModule,
  MatInputModule,
  MatIconModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatProgressBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import { AlertModule } from 'ngx-bootstrap';
import { AppState, INITIAL_STATE } from './models';
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
import { LoaderComponent } from './loader.component';

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
    ProfileModalComponent,
    LoaderComponent
  ],
  imports: [
    NgReduxModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: !environment.production }
    ),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatSidenavModule,
    MatGridListModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule
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
  providers: [
    ChatActions,
    RoomActions,
    UserActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>) {
    if (environment.production) {
      ngRedux.configureStore(reducer, INITIAL_STATE, [ ReduxThunk, ApiMiddleware]);
    } else {
      ngRedux.configureStore(reducer, INITIAL_STATE, [ ReduxThunk, ApiMiddleware, createLogger()]);
    }
  }
}
