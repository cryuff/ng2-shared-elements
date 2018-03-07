export const baseHeaderSelector = "com-header";
export const baseHeaderTemplate = `<header id="com-header">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <a *ngIf="showNavIcon" class="navbar-icon" (click)="navigateToPanel()">
          <span class="fa-stack fa-lg">
           <i class="fa fa-stack-1x fa-home"></i>
          </span>
        </a>
        <a class="navbar-brand" ><span (click)="navigateToPanel()">{{brandName}}</span></a>
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false"
          aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
          </button>
      </div>
      <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right" *ngIf="isAuthenticated">
        <li class="company-logo" *ngIf="huzarElements"></li>
        <li class="company-info"  *ngIf="huzarElements">
            <p>HUZAR SOFTWARE</p>
            <p>ul.Tczewska 14</p>
            <p>51-429 WROCŁAW</p>
        </li>
        <li class="company-info"  *ngIf="huzarElements">
            <p>www.huzar.pl</p>
            <p>tel.: 71-335-69-60</p>
            <p>tel/fax: 71-345-62-91</p>
        </li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <span><i class="fa fa-user-circle-o" aria-hidden="true" style="display:inline"></i></span>
                {{username}}
                <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li><a class="text-center" (click)="logOut()">Wyloguj</a></li>
            </ul>
          </li>
          <li class="dropdown" *ngIf="showHsWebsites">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Inne strony HS <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="#">Serwis zgłoszeń</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">HUZAR</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>`;
export const baseHeaderStyles = `
.navbar, nav .open > a {
    background-color: #2b3643;
}
.navbar {
    border:0;
    border-radius: 0;
}
.nav a, .navbar-brand, nav .open > a {
    color: #c6cfda;
}
nav .dropdown-menu>li>a {
    color: #000000;
}
    nav .dropdown > a:hover {
        color: #fff;
    }

.company-info {
    margin: 0px 10px;
    font-size: 10px;
}

.company-info p {
    margin: 0;
    line-height: 14px;
    margin: 2px;
}
`;

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BaseLoginService } from "../services/base.login.service";
import { BaseDataService } from "../services/base.data.service";

@Component({
    selector: baseHeaderSelector,
    template: baseHeaderTemplate,
    styles: [baseHeaderStyles]
})
export class BaseHeaderComponent implements OnInit {

    protected showNavIcon: boolean;
    protected showHsWebsites: boolean;
    protected username = "";
    protected isAuthenticated = false;
    protected brandName = "";
    moduleName: string;
    moduleIcon: string;
    protected huzarElements = false;

    constructor(protected _baseLoginService: BaseLoginService,
        protected _baseDataService: BaseDataService,
        protected _router: Router,
        protected _brandName: string,
        protected _showNavIcon: boolean = false,
        protected _showHsWebsites: boolean = false) {
        if (_brandName.length === 0)
            throw new Error("You need to declare brandName for HeaderComponent");
        this.brandName = _brandName;
        this.showNavIcon = _showNavIcon;
        this.showHsWebsites = _showHsWebsites;
    }

    navigateToPanel(): void {
        if (this.isAuthenticated)
            this._router.navigate(["/panel"]);
        else
            this._router.navigate([""]);
    }

    ngOnInit(): void {
        if (this._baseLoginService.checkStorage()) {
            this._baseLoginService.checkToken().subscribe(value => {
                if (value.status === "ok") {
                    this.isAuthenticated = true;
                    this.username = this._baseLoginService.getUsername();
                } else {
                    this.isAuthenticated = false;
                }
            });
        }
        this._baseLoginService.check().subscribe(value => {
            this.isAuthenticated = value;
            this.username = this.isAuthenticated ? this._baseLoginService.getUsername() : "";
        });
    }

    logOut(): void {
        this._baseLoginService.logOut();
        this._router.navigate([""]);
    }

}