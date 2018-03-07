import { Headers, RequestOptions } from "@angular/http";

export abstract class BaseDataService {

    protected header: Headers = null;
    public passwordExpired = false;
    public isTosAccepted = true;
    authOptions: RequestOptions = null;
    loggedIn = false;
    websiteName = "";
    lastUrl = "";
    searchObjects: any[] = [];

    constructor(_websiteName: string) {
        if (_websiteName.length === 0)
            throw new Error("You need to declare websteName for DataService");
        this.websiteName = _websiteName;
        if (localStorage.getItem(`pe${this.websiteName}`) === "true")
            this.passwordExpired = true;
        if (localStorage.getItem(`tos${this.websiteName}`) === "true")
            this.isTosAccepted = false;
    }

    getAuthString(): string {
        return btoa(
            `${localStorage.getItem(`username${this.websiteName}`)}:${localStorage.getItem(`token${this.websiteName}`)
            }`);
    }

    getAuthHeader(): Headers {
        if (this.header === null) {
            this.setAuthHeader();
        }
        return this.header;
    }

    setAuthHeader(): void {
        let username = localStorage.getItem(`username${this.websiteName}`);
        let token = localStorage.getItem(`token${this.websiteName}`);
        this.header = new Headers({ 'Accepts': "applications/json" });
        this.header.append("AuthorizationUsername", encodeURI(`${username}`));
        this.header.append("AuthorizationToken", `${token}`);
        this.authOptions = new RequestOptions({ headers: this.header });
    }

    destroyAuthHeader(): void {
        this.header = null;
        this.authOptions = null;
    }

}