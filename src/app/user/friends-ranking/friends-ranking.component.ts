import { Component, OnInit } from '@angular/core';
import { FormsService, RankingService, UserService } from '../../shared/index';
import { User } from '../../../models/index';
import  { filter } from 'lodash';
import { take , orderBy, sortBy, get, size, keys, slice, assign } from 'lodash';
@Component({
  selector: 'app-friends-ranking',
  templateUrl: './friends-ranking.component.html',
  styleUrls: ['./friends-ranking.component.css']
})
export class FriendsRankingComponent implements OnInit {
  public rankedUsers: User[] = [];
  public rankingDescription: string = '';
  public filterSelected: any = { };   
  public filters = [
    { icon: 'today', label: 'Hoy', isActive: false, datePeriod: 'today', periodText: 'hoy.' },
    { icon: 'view_week', label: 'Semana' , isActive: false, datePeriod: 'weekly', periodText: 'la semana.'  },
    { icon: 'date_range', label: 'Este Mes', isActive: false, datePeriod: 'monthly', periodText: 'este mes.' }  
  ];
  ngOnInit( ) {
    this.getHistoricalFriendsRanking(); 
  }
  constructor(private _userService: UserService){ }
  private getHistoricalFriendsRanking(): void {
   this.rankingDescription = 'todos los tiempos';
    if(this.rankedUsers)
      this.rankedUsers = [ ];
    this._userService.getFollowingList(this._userService.currentUserId)
                     .subscribe(followers => {
                      this.setFriendKey(followers);
    });
  }
  public setFriendKey(followers): void {
  let groupKey  = keys(followers).concat(this._userService.currentUserId);  
  groupKey.reverse().map(key => this._userService.getFriendData(key)
                   .subscribe(friend => { this.rankedUsers.push(assign(friend.payload.val(),{ $key: friend.key })) }, 
                             (err) => console.log(err),
                             () => { console.log(this.rankedUsers) }));
  }  
  public getFriendsRankingPeriod(filter) {
    this.filterSelected = filter;
    this.filterSelected.isActive = true;
    this.rankingDescription = this.filterSelected.periodText;
    this._userService.setFriendsRankingForToday(this.rankedUsers, this.filterSelected.datePeriod);
  }

}