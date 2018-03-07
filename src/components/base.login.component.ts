export const baseLoginSelector = "com-login";
export const baseLoginTemplate = `
<div class="row voffset4 card error-div" *ngIf="errorMessage">
    <p class="error-message"><span>{{errorMessage}}</span> <span *ngIf="timeLeft"> Pozostały czas blokady: {{timeLeft | truncate: 5 : ''}}s</span></p>
</div>
<div class="row voffset4" id="com-login">
    <div class="card">
      <div class="text-center" style="padding-top:20px">
        <p class="login-text"><span class="brand">HS</span>{{loginText}}</p>
      </div>
      <div class="card-body">
        <input [(ngModel)]="username" class="form-control voffset1" type="text" placeholder="Login" required>
        <input [(ngModel)]="password" class="form-control voffset1" type="password" placeholder="Hasło" required>
        <div *ngIf="enableLoginByAd" class="checkbox">
          <label><input [(ngModel)]="loginByAd" type="checkbox">Logowanie do Active Directory</label>
        </div>
      </div>
      <div class="modal-footer" (click)="sendCredentials()">
        <p class="pointer">
            Zaloguj się
            <i *ngIf="whileLogin">
                <i class="fa fa-spinner fa-pulse fa-fw "></i>
                <span class="sr-only ">Ładowanie...</span>
            </i>
        </p>
      </div>
    </div>
    <span class="reset-password" *ngIf="enableResetPassword" routerLink="/resetpassword">Nie pamiętasz hasła?</span>
  </div>
`;
export const baseLoginStyles = `
.checkbox label  {
    display:inline;
}
.checkbox label>input {
    width: 14px;
    height: 14px;
}
.error-message {
    padding-top:15px;
    font-weight: normal;
    color: #d9534f;
}
.error-div {
    text-align: center;
    background-color: #fff;
    margin: 0;
}
.login-text {
    font-size: 115%;
}
.brand {
    color: #2CC185;
}
#com-login {
width: 400px;
height: 600px;
position: fixed;
top: 50%;
left: 50%;
margin-top: -200px;
margin-left: -200px;
}
#com-login .card-body>input {
    border: 0;
    width: 100%;
    padding-left: 10px;
    height: 35px;
    background-color: #DDE3EC;
    margin-top: 15px;
}
#com-login .modal-footer {
    text-align: center;
    font-size: 150%;
    padding-top: 25px;
}
#com-login .modal-footer {
    -webkit-transition: all ease 0.8s;
    -moz-transition: all ease 0.8s;
    transition: all ease 0.8s;
}

#com-login .modal-footer:hover {
    box-shadow: inset 400px 0 0 0 #e0e0e0;
}
@media(max-height:890px) {
    .error-div {
        margin-top: 25px;
    }
    #com-login .modal-footer {
        text-align: center;
        font-size: 100%;
        padding-top: 25px;
    }
}

@media (max-width: 500px) {
    .error-div {
        font-size: 70%;
    }
    #com-login {
        font-size: 70%;
        width: 250px;
        left: 50%;
        margin-top: 100px;
        margin-left: -125px;
        top: 0%;
    }
}
@media (max-height: 700%) {
    #com-login { top: 70%;}
}`;

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BaseLoginService } from "../services/base.login.service";
import { BaseDataService } from "../services/base.data.service";

@Component({
    selector: baseLoginSelector,
    template: baseLoginTemplate,
    styles: [baseLoginStyles]
})
export class BaseLoginComponent implements OnInit {

    protected username = "";
    protected password = "";
    protected loginByAd = false;
    protected errorMessage = "";
    protected timeLeft = "";
    protected enableLoginByAd = false;
    protected loginText = "";
    protected whileLogin = false;


    constructor(protected _baseLoginService: BaseLoginService,
        protected _router: Router,
        protected _baseDataService: BaseDataService) {
        this.loginText = this._baseDataService.websiteName;

    }

    ngOnInit(): void {
        this._baseLoginService.checkAdAvailability().subscribe(value => {
            if (value.status === "true")
                this.enableLoginByAd = true;
            else
                this.enableLoginByAd = false;
        });
        if (this._baseLoginService.checkStorage()) {
            this._router.navigate([this._baseLoginService.pathForLoggedUser]);
        }
        else {
            this.username = this._baseLoginService.getUsername();
        }
    }

    sendCredentials(): void {
        $(".error-message").removeClass("buzz");
        if(this.username === "" || this.password === "" && this.username !== "AdministratorWWW")
            this.errorMessage = "Pole login i hasło muszą zostać wypełnione!";
        else {
            this._baseLoginService.saveUsername(this.username);
            this.whileLogin = true;
            this._baseLoginService.checkCredentials(this.username, this.password, this.loginByAd).subscribe(value => {
                if (value.status === "ok") {
                    this.logUser(value);
                }
                else if (value.status === "passwordExpired") {
                    this._baseLoginService.addPasswordExpired();
                    this.logUser(value);
                }
                else if (value.status === "termsNotAccepted") {
                    this._baseLoginService.addTosNotAccepted();
                    this.logUser(value);
                }
                else {
                    this.errorMessage = value.message;
                    this.timeLeft = value.data;
                    $(".error-message").addClass("buzz");
                    this.password = "";
                }
                 this.whileLogin = false;
            },
                error => {
                    this.errorMessage = "Wystąpił błąd podczas próby logowania";
                    $(".error-message").addClass("buzz");
                    this.whileLogin = false;
                });
        }
    };

    logUser(value: any) {
        this._baseLoginService.logIn(this.username, value.data);
        this._router.navigate([this._baseLoginService.pathForLoggedUser]);
    }

    handleKeyboardEvents(event: any): void {
        if (event.keyCode === 13) {
            this.sendCredentials();
        }
    }
}