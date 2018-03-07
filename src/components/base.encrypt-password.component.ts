export const baseEncryptPasswordSelector = "com-encrypt-password";
export const baseEncryptPasswordTemplate = `<com-copybox [showBox]="copyBox" [copyPath]="copyPath">
</com-copybox>
<div class="row voffset8">
    <div class="col-md-6 col-md-offset-3">
        <div class="card login-box">
            <div class="card-head text-center" style="padding-top: 20px">
                <p>Podaj hasło do zaszyfrowania</p>
                <p class="label label-danger error-message" *ngIf="errorMessage">
                    <span>{{errorMessage}}</span>
                </p>
                <p class="label label-success error-message" *ngIf="successMessage">
                    <span>{{successMessage}}</span>
                </p>
            </div>
            <div class="card-body">
                <input [(ngModel)]="password" (ngModelChange)="onChangePassword()" class="form-control voffset1" type="password" placeholder="Hasło"
                    required>
                <input [(ngModel)]="passwordConfirm" (ngModelChange)="onChangePassword()" class="form-control voffset1" type="password" placeholder="Powtórz hasło"
                    required>
            </div>
            <div class="modal-footer">
                <button [disabled]="password != passwordConfirm || password.length == 0 || passwordConfirm.length == 0" (click)="encryptPassword()"
                    class="btn btn-primary btn-lg btn-block">Szyfruj hasło</button>
            </div>
        </div>
    </div>
</div>`;

import { Component } from "@angular/core";
import { BaseLoginService } from "../services/base.login.service";

@Component({
    selector: baseEncryptPasswordSelector,
    template: baseEncryptPasswordTemplate
})
export class BaseEncryptPasswordComponent {

    protected password = "";
    protected passwordConfirm = "";
    protected errorMessage = "";
    protected successMessage = "";
    protected copyBox = false;
    protected copyPath = "";

    constructor(protected _baseLoginService: BaseLoginService) { }

    onChangePassword() {
        if (this.password.length > 0 && this.passwordConfirm.length > 0) {
            this.errorMessage = this.password === this.passwordConfirm ? "" : "Hasła nie są zgodne";
            this.successMessage = this.password === this.passwordConfirm ? "Hasła są zgodne" : "";
        } else {
            this.errorMessage = "";
            this.successMessage = "";
        }
    }

    encryptPassword() {
        this._baseLoginService.getEncryptedPassword(this.password).subscribe(value => this.copyPath = value.data);
        this.copyBox = true;
    }
}