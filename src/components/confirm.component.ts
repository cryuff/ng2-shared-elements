import { Component, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "com-confirm",
    template: `<div id="confirm-box" style="display:none">
  <div class="confirm-inside text-center">
    <p>{{question}}</p>
    <div class="voffset5">
      <button type="button" class="btn btn-danger" (click)="confirm()">{{confirmText}}</button>
      <button type="button" class="btn btn-success" style="margin-left:10px" (click)="decline()">{{declineText}}</button>
    </div>
  </div>
</div>
`
})
export class ConfirmComponent implements OnChanges {

    @Input()
    showConfirm: boolean;
    @Input()
    question: string;
    @Input()
    confirmText: string;
    @Input()
    declineText :string;
    @Output()
    notifyConfirm = new EventEmitter<boolean>();

    ngOnChanges() {
        if (this.showConfirm)
            $("#confirm-box").fadeIn();
        else
            $("#confirm-box").fadeOut();
    }

    confirm() {
        this.notifyConfirm.emit(true);
    }

    decline() {
        this.notifyConfirm.emit(false);
    }

}