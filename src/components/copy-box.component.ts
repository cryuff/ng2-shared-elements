import { Component, Input, Output, OnChanges, ElementRef, EventEmitter } from "@angular/core"

@Component({
    selector: "com-copybox",
    template: `<div id="copy-box" style="display:none" (keypress)="handleKeyboardEvents($event)" tabindex="1">
    <div class="voffset3">
        <p><span class="label label-success">Kliknij Enter, aby skopiować</span></p>
    </div>
    <div class="voffset3 text-center">
        <div>
            <p id="path" class="copy-path">{{copyPath}}</p>
        </div>
        <div class="voffset3">
            <button type="button" class="btn btn-primary" (click)="copy()">Kopiuj</button>
            <button type="button" class="btn btn-primary" (click)="exit()">Anuluj</button>
        </div>
    </div>
</div>`,
    host: {
        "(document:click)": "handleClick($event)"
    }
})
export class CopyBoxComponent implements OnChanges {

    @Input()
    showBox: boolean;
    @Input()
    copyPath: string;
    @Output()
    notify = new EventEmitter<boolean>();
    private elementRef: any;
    private justOpen = false;

    constructor(myElement: ElementRef) {
        this.elementRef = myElement;
    }

    ngOnChanges(): void {
        if (this.showBox) {
            $("#copy-box").fadeIn();
            this.justOpen = true;
            $("#copy-box").focus();
        } else {
            this.showBox = false;
            $("#copy-box").fadeOut();
        }
    }

    exit(): void {
        $("#copy-box").fadeOut();
    }

    copy(): void {
        let $temp = $("<input>");
        $("body").append($temp);
        $temp.val($("#path").text()).select();
        document.execCommand("copy");
        $temp.remove();
        $("#copy-box").fadeOut();
    }

    handleKeyboardEvents(event: KeyboardEvent): void {
        if (event.code === "Enter")
            this.copy();
    }

    handleClick(event: any): void {
        if (!this.justOpen && this.showBox) {
            let inside = false;
            var target = event.target;
            while (target.parentNode) {
                if (target === this.elementRef.nativeElement) {
                    inside = true;
                    break;
                }
                target = target.parentNode;
            }
            if (!inside && this.showBox) {
                this.notify.emit(false);
            }
        } else {
            this.justOpen = !this.justOpen;
        }
    }
}