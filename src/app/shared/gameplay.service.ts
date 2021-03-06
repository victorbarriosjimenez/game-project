import { Injectable } from '@angular/core'
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Match } from './../../models'
import { UserService } from './user.service';

import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
@Injectable()
export class GameplayService {
    private matchesDatabaseReference : AngularFireList<Match>;
    public locations: Location[];
    public _locationsAPI: string = "https://geocity-app.firebaseio.com/locations";
    constructor(private _http: Http,
                private _afDatabase: AngularFireDatabase,
                private _userService: UserService,
                private _router: Router) { 
                     this.matchesDatabaseReference  = _afDatabase.list('/matches');
    }
    public getMatchLocations(apiEndPoint: string) { 
      return this._http.get(`${this._locationsAPI}/${apiEndPoint}.json`)
                 .map(response => response.json()); 
    }
    public returnDistanceBetweenLocationsSelected(locationSetLatitude: number, locationSetLongitude : number, LocationClickedLatitude: number, locationClickedLongitude: number): number {
        var R = 6378137; 
        var dLat = this.rad(LocationClickedLatitude - locationSetLatitude)
        var dLong = this.rad(locationClickedLongitude - locationSetLongitude)
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             Math.cos(this.rad(locationSetLatitude)) * Math.cos(this.rad(LocationClickedLatitude)) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
         return d/1000; 
    }
    setScoreFromCalculatedDistance(distanceBetweenPointsInKilometers: number): number { 
        let score = 0;
        if(distanceBetweenPointsInKilometers > 0 && distanceBetweenPointsInKilometers <= 100){
            return score += 100;  
        }
        else if(distanceBetweenPointsInKilometers > 100 && distanceBetweenPointsInKilometers <= 200){
            return score += 80;  
        }
        else if(distanceBetweenPointsInKilometers > 200 && distanceBetweenPointsInKilometers <= 300){
            return score += 70;  
        }
        else if(distanceBetweenPointsInKilometers > 300 && distanceBetweenPointsInKilometers <= 400){
            return score += 60;  
        }
        else if(distanceBetweenPointsInKilometers > 400 && distanceBetweenPointsInKilometers <= 500){
            return score += 50;  
        }
        else if(distanceBetweenPointsInKilometers > 500 && distanceBetweenPointsInKilometers <= 600){
            return score += 40;  
        }
        else if(distanceBetweenPointsInKilometers > 600 && distanceBetweenPointsInKilometers <= 700){
            return score += 30;  
        }
        else if(distanceBetweenPointsInKilometers > 700 && distanceBetweenPointsInKilometers <= 1000){
            return score += 20;  
        }
        else if(distanceBetweenPointsInKilometers > 1000 && distanceBetweenPointsInKilometers <= 1500){
            return score += 10;  
        }
        else { 
            return score += 5; 
        }
    }
    private rad(x): number {
        return x * Math.PI / 180;
    }
    public createNewMatch(match : Match): void {
        const dataMatchModel: Match = {
            userId: match.userId,
            timestamp: match.timestamp,
            score:  match.score,
            continent: match.continent,
        }
        this.matchesDatabaseReference.push(dataMatchModel).then(
          () => { 
                this._userService.updateUserScoreAfterMatchFinished(match.userScore,match.score);
                this._router.navigate(['/profile']) 
        });
    }
    public shuffleArray(array): Location[] {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
}