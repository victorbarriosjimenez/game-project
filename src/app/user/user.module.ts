import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'; 
import { UserProfileComponent } from './user-profile.component';
 
import { UserSearchComponent } from  './user-search/user-search.component'; 
import  { UserRoutesModule } from './user.routes'
import { MaterialElementsModule  } from '../shared/material-elements.module';
import { AuthenticationService } from '../shared/authentication.service';
import { NavigationComponent } from './navigation/navigation.component';
import { FriendsRankingComponent } from './friends-ranking/friends-ranking.component';
import { UserService } from '../shared/user.service';
import { GameplayModule } from './../gameplay/gameplay.module';
import { RankingService, FilterPipe } from '../shared/index';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { NotificationsService } from '../shared/notifications.service';
@NgModule({
  imports: [
    CommonModule,
    MaterialElementsModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutesModule,
    GameplayModule 
   ],
  declarations: [
    UserProfileComponent,
    UserSearchComponent,
    NavigationComponent,
    FriendsRankingComponent,
    FriendsListComponent,
    FilterPipe
  ],
  exports: [
    NavigationComponent
  ],
  providers: [
    AuthenticationService,
    UserService,
    RankingService,
    NotificationsService
  ]
})

export class UserModule { }
