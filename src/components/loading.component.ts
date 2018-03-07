import { Component, Input } from "@angular/core";

@Component({
    selector: "com-loading",
    template: `<div *ngIf="show" id="com-loading" class="text-center">
    <i class="fa fa-spinner fa-pulse fa-3x fa-fw "></i>
    <span class="sr-only ">Ładowanie...</span>
    </div>
`
})

export class LoadingComponent {
    @Input() show: boolean;
}