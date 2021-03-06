import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup,FormControl , FormGroupDirective, NgForm} from '@angular/forms';
import { FormsService } from '../../shared/forms.service';
import { AuthenticationService } from '../../shared/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx'; 
import { User } from '../../../models';
import { valuesIn } from 'lodash';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public countries: any;
  public hide: boolean =  true
  public isCreatingAccount:  boolean =  false;
  public usernameInsertedCopy: string = '';
  public usernames = [];
  public registrationForm: FormGroup;
  public isUsernameAvailable:  boolean = false;
  constructor(private _formsService: FormsService, 
              private _fb: FormBuilder,
              private _router: Router,
              private _authService: AuthenticationService
            ) { }
  ngOnInit() {
    this.createForm();
    this.getCountries();
  } 
  public createForm( ): void {
   this.registrationForm =  this._fb.group({
            emailFormControl:['', Validators.compose([Validators.required, Validators.email])],
            usernameFormControl:['', Validators.compose([Validators.required, Validators.minLength(6)])],
            countryFormControl:['', Validators.required],
            passwordFormControl: ['', Validators.required]
    });
  }
  private getCountries() { 
    this._formsService.getCountries()
        .subscribe(countries => this.countries = countries);
  } 
  public prepareUserForRegistration( ): User {
    const formModel = this.registrationForm.value;
    const userModel: User = {
        email: formModel.emailFormControl as string,
        username:  formModel.usernameFormControl as string,
        country: formModel.countryFormControl as string,
        password: formModel.passwordFormControl as string
    };
      return userModel
  }
  public registerAccountWithEmailAndPassword(): void {
    this.isCreatingAccount = true;
    let user = this.prepareUserForRegistration();
    this._authService.emailSignUp(user).then(
      ()=> {
          this.isCreatingAccount = false
    }).catch(()=>{
        this.isCreatingAccount = false
    });
  }
  public checkUsernameAvailability(): void {
        this.usernameInsertedCopy = this.registrationForm.value.usernameFormControl.toLowerCase();
        this._authService.getUsernames()
                         .subscribe((usernames: any[]) => {
                          usernames.find(username => username.username == this.usernameInsertedCopy ? this.isUsernameAvailable = false : this.isUsernameAvailable = true )
                        });
    }
}