import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { User , Match, Post, Comment } from '../../models'
import { UserService, ForumService, RankingService, AuthenticationService } from './../shared/';
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase/app';
import { take , orderBy, get, size, keys, slice , assign } from 'lodash';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public user: User;
  public userLevel: string = '';
  public podiumUsers: User[];
  public createPostForm: FormGroup; 
  public matches: any;
  public friends: User[];
  public followerCount: number
  public posts: Post[];
  public postSelected: Post;
  public message: any;
  public rankedFriends:any[] = [];
  constructor(private auth: AuthenticationService, 
              private _forumService:ForumService,
              private _userService:  UserService,
              private _rankingService: RankingService,
              private _fb: FormBuilder,
              private _router: Router,
              private _snackBar: MatSnackBar,
              ) { 
              this.postSelected = { };
              this.friends = [ ];
              }
  ngOnInit() { 
    this.getProfileBioData();
    this.getUserMatches();
    this.getListOfAllPosts();
    this.createForm();
    this.getWorldRankingPodium();
    this.getNumberOfFriends();
  }
  private countFollowers(followers) {
    if (followers.$value===null) return 0
    else return size(followers)
  }
  
  public createNewPost( ): void { 
    if(this.createPostForm.value.body === ''){
        this.showsSnackOfPostCreated('La publicación está vacía.');
      return;
    }
    else {
      const postModel: Post = this.preparePost();
      this._forumService.createNewPost(postModel);
      this.createPostForm.reset();
     } 
  }
  private getProfileBioData( ):  void {
    this._userService.getUserData()
      .subscribe(data => {
        this.user = data;
        this.setlevel(data.score);
      },
                  (err) => console.log(err),
                  () => console.log('Success'));
  }
  public getUserMatches(): void {
    this._userService.getUserMatches()
                     .subscribe(matches  => this.matches = matches ? take(matches.reverse(),5):[]);
  }
  public createNewMatch( ): void {
      this._router.navigate(['/gameplay']);
   }
  public preparePost(): Post { 
    const formModel = this.createPostForm.value;
      const postModel: Post = { 
        body: formModel.body as string, 
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        authorProfilePhoto: this.user.profilePhotoUrl as string,
        authorUsername: this.user.username as string,
        userId: this._userService.currentUserId as string
      }
      return postModel;
  }
  public getListOfAllPosts( ): void { 
    this._forumService.getListOfPostsFromGivenUser(this._userService.currentUserId)
     .subscribe(data=> this.posts = data.reverse());
  }   
  public createForm( ): void {
    this.createPostForm =  this._fb.group({ 
          body:['']
     });
   }
   private showsSnackOfPostCreated(message: string) : void {
    this._snackBar.open(message, "OK", {
        duration: 2000,
      }); 
    }
    public getWorldRankingPodium(): void  {
      this._rankingService.getListOfAllUsers()
          .subscribe(users => {  this.filterUsersAsPodium(users); },  
          ()=>{ this.showsSnackOfPostCreated('Ocurrio un error'); }
        )
    }
    public filterUsersAsPodium(users: User[]): void {
        let orderedUsers =  orderBy(users,['score'],['desc']); 
        this.podiumUsers = orderedUsers.slice(0,3);
    }
    public addComment(comment: string): void { 
      const commentModel : Comment = {
          body: this.postSelected.commentText as string, 
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          authorProfilePhoto: this.user.profilePhotoUrl as string,
          authorUsername: this.user.username as string,
          userId: this._userService.currentUserId as string,
          authorId: this.postSelected.userId as string,
          postId: this.postSelected.$key as string,
          postBody: this.postSelected.body as string          
      }
      this._forumService.createNewComment(commentModel);
      this.postSelected.commentText = '';
    }  
    public selectPost(post: Post): void { 
        this.postSelected = post;
        this.postSelected.showForm = !this.postSelected.showForm;
        this.postSelected.commentText = '';
        this._forumService.getCommentsFromPostSelected(this.postSelected.$key)
                          .subscribe(comments => this.postSelected.comments = comments,
                                     (err) => console.log(err),
                                     () => console.log("Success")
                          );
    }   
    public deletePost(key: string): void {
        this._forumService.deletePost(key);
        this.showsSnackOfPostCreated('Publicación eliminada');
    } 
    public deleteComment(key: string): void {
      this._forumService.deleteComment(key);
      this.showsSnackOfPostCreated('Comentario eliminado');      
    } 
    public setFriendKey(followers): void {
      keys(followers).map(key => this._userService.getFriendData(key)
                     .subscribe(friend => this.friends.push(assign(friend.payload.val(),{ $key: friend.key })), 
                               (err) => console.log(err),
                               () => { 
                                this.friends = this.friends.slice(0,13);
                              }));
    }
    private getNumberOfFriends(): void {
      this._userService.getFollowingList(this._userService.currentUserId)
                       .subscribe(followers => {
                        this.setFriendKey(followers);
                        this.followerCount = this.countFollowers(followers);
      });
    }
    private setlevel(score: any){
      if(score >= 0 && score < 2000){
          this.userLevel = 'Starter';
      }
      else if (score >= 2000 && score < 5000){
        this.userLevel  = 'Junior'; 
      }
      else if (score >= 5000 && score < 10000){
        this.userLevel  = 'Expert'; 
      }
      else if (score >= 10000 && score < 15000){
        this.userLevel  = 'Master'; 
      }
    }
}