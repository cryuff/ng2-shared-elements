import { Http, Response } from "@angular/http";
import { Observable, Subject } from "rxjs";
import "rxjs/add/operator/map";
import { ApiResult } from "../models/apiResult";
import { BaseDataService } from "./base.data.service";

export abstract class BaseLoginService {

    protected logger = new Subject<boolean>();
    public enableLoginByAd = false;
    pathForLoggedUser = "";

    constructor(protected _http: Http, protected _baseDataService: BaseDataService, private _pathForLoggedUser: string) {
        this.pathForLoggedUser = _pathForLoggedUser;
    }

    checkCredentials(username: string, password: string, loginByAd: boolean): Observable<any> {
        if (!this.enableLoginByAd)
            loginByAd = false;
        return this._http.post(`/api/post/login`,
            {
                username: username,
                password: password,
                loginByAd: loginByAd
            });
    }

    getEncryptedPassword(password: string): Observable<any> {
        return this._http.get(`/api/get/password/${btoa(password)}`);
    }

    checkToken(): Observable<any> {
        return this._http.get(`/api/get/checktoken`);
    }

    checkAdAvailability(): Observable<any> {
        return this._http.get(`/api/get/adavailability`);
    }

    saveUsername(username: string): void {
        localStorage.setItem(`username${this._baseDataService.websiteName}`, username);
    }

    logIn(username: string, token: string): void {
        localStorage.setItem(`token${this._baseDataService.websiteName}`, token);
        localStorage.setItem(`username${this._baseDataService.websiteName}`, username);
        this._baseDataService.loggedIn = true;
        this.logger.next(this._baseDataService.loggedIn);
        this._baseDataService.setAuthHeader();
    }

    logOut(): void {
        localStorage.removeItem(`token${this._baseDataService.websiteName}`);
        this.removePasswordExpired();
        this.removeTosNotAccepted();
        this._baseDataService.loggedIn = false;
        this.logger.next(this._baseDataService.loggedIn);
        this._baseDataService.destroyAuthHeader();
    }

    addTosNotAccepted(): void {
        this._baseDataService.isTosAccepted = false;
        localStorage.setItem(`tos${this._baseDataService.websiteName}`, "true");
    }

    addPasswordExpired(): void {
        this._baseDataService.passwordExpired = true;
        localStorage.setItem(`pe${this._baseDataService.websiteName}`, "true");
    }

    removeTosNotAccepted(): void {
        this._baseDataService.isTosAccepted = true;
        localStorage.removeItem(`tos${this._baseDataService.websiteName}`);
    }

    removePasswordExpired(): void {
        this._baseDataService.passwordExpired = false;
        localStorage.removeItem(`pe${this._baseDataService.websiteName}`);
    }

    removeStorage():void {
        localStorage.removeItem(`token${this._baseDataService.websiteName}`);
        localStorage.removeItem(`username${this._baseDataService.websiteName}`);
    }

    checkStorage(): boolean {
        var token = localStorage.getItem(`token${this._baseDataService.websiteName}`);
        var username = localStorage.getItem(`username${this._baseDataService.websiteName}`);
        return token != null && username != null;
    }

    check(): Observable<boolean> {
        return this.logger.asObservable();
    }

    getUsername(): string {
        return localStorage.getItem(`username${this._baseDataService.websiteName}`);
    }

    getToken(): string {
        return localStorage.getItem(`token${this._baseDataService.websiteName}`);
    }

}