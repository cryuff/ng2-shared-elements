import { Component, OnChanges, Input, Output, EventEmitter, ElementRef } from "@angular/core";

@Component({
    selector: "com-autocomplete",
    template: `<div id="autocomplete">
  <input id=" items " type="text " class="validate filter-input form-control " [(ngModel)]="query" (keyup)="filter($event) "
    (focus)="onFocus($event)" (blur)="blur($event)" placeholder="{{placeholder}}">
  <div class="suggestions " *ngIf="filteredList.length > 0" [class.nonvisible]="!visible">
    <ul>
      <li (mouseover)="mouseOver(idx)" *ngFor="let item of filteredList; let idx = index" [class.if-selected]="idx === selectedIdx" (click)="select(item)">
        <a *ngIf="idx<10">{{item[parameter] | truncate: 20: '...'}}</a>
      </li>
    </ul>
  </div>
</div>`,
    styles: [
        `.suggestions {
  border: solid 1px #f1f1f1;
  position: absolute;
  background: white;
  z-index: 1;
  margin: auto;
  left: 0;
  right: 0;
  width: 80%;
}`,
        `.suggestions ul {
  padding: 0px;
  margin: 0px;
}`,
        `.suggestions ul li {
  list-style: none;
  padding: 0px;
  margin: 0px;
}`,
        `.suggestions ul li a {
  padding: 5px;
  display: block;
  text-decoration: none;
  color: #7E7E7E;
}`,
        `.suggestions ul li a:hover {
  background-color: #f1f1f1;
}`,
        `.ifSelected {
  background-color: #f1f1f1;
}`,
        `.nonvisible {
  display: none;
}`,
        `@media (max-width:992px) {
    .suggestions{
        font-size:0.8em;
}}`
    ],
    host: {
        "(document:click)": "handleClick($event)"
    }
})
export class AutocompleteComponent implements OnChanges {

    @Input()
    initQuery = "";
    @Input()
    query = "";;
    @Input()
    items: any = [];
    @Input()
    parameter = "name";
    @Input()
    idOfSelected: number;
    @Input()
    placeholder: string;
    @Input()
    listAllElementsOnStart = false;
    @Input()
    apiService: any;
    @Input()
    apiMethod: string;
    @Input()
    activated = true;
    @Output()
    notifyAutoComplete = new EventEmitter<number>();
    @Output()
    notifyAutoCompleteQuery = new EventEmitter<string>();
    filteredList: any[] = [];
    elementRef: any;
    private selectedIdx = -1;
    private visible = false;

    constructor(myElement: ElementRef) {
        this.elementRef = myElement;
    }

    ngOnChanges(): void {
        if (this.activated === false) {
            this.resetComponent();
        } else {
            if (this.filteredList.length !== 0)
                this.query = this.idOfSelected
                    ? this.filteredList.filter(item => item.id === this.idOfSelected)[0][this.parameter]
                    : "";
            else
                this.query = (this.query == "" || this.query == null) ? this.initQuery : this.query;
        }
    }

    mouseOver(event: number) : void {
        this.selectedIdx = event;
    }

    resetComponent(): void {
        this.query = "";
        this.visible = false;
        this.selectedIdx = -1;
        this.filteredList = [];
    }

    blur(event: any): void {
        if (event.relatedTarget !== null)
            this.visible = false;
    }

    filter(event: any): void {
        if (this.query !== "" || this.listAllElementsOnStart) {
            if (this.apiService != null) {
                this.apiService[this.apiMethod](this.query).subscribe((value: any) => {
                    this.items = value.data;
                    this.resolveClick(event, true);
                });
            } else {
                this.resolveClick(event, false);
            }
        } else {
            this.idOfSelected = -1;
            this.notifyAutoComplete.emit(this.idOfSelected);
            this.filteredList = [];
        }
    }

    resolveClick(event: any, isFiltered: boolean): void {
        if (!isFiltered) {
            this.filteredList = this.items.filter(
                (item: any) => item[this.parameter] != null
                    ? item[this.parameter].toUpperCase().includes(this.query.toUpperCase())
                    : "");
        } else {
            this.filteredList = this.items;
        }
        if (event.code === "ArrowDown" && this.selectedIdx < this.filteredList.length) {
            this.selectedIdx++;
        } else if (event.code === "ArrowUp" && this.selectedIdx > 0) {
            this.selectedIdx--;
        } else if (event.code === "Enter" && this.selectedIdx < this.filteredList.length && this.selectedIdx > -1) {
            this.select(this.filteredList[this.selectedIdx]);
        }
        else if (event.code === "Enter" && this.selectedIdx === -1 && this.filteredList.length > 0) {
            this.select(this.filteredList[0]);
        }
    }

    select(item: any): void {
        this.query = item[this.parameter];
        this.idOfSelected = item.id;
        this.notifyAutoComplete.emit(this.idOfSelected);
        this.notifyAutoCompleteQuery.emit(this.query);
        this.filteredList = [];
        this.selectedIdx = -1;
    }

    onFocus(event: any): void {
        this.filter(event);
        this.visible = true;
    }

    handleClick(event: any): void {
        let inside = false;
        let target = event.target;
        while (target.parentNode) {
            if (target === this.elementRef.nativeElement) {
                inside = true;
                break;
            }
            target = target.parentNode;
        }
        if (!inside) {
            this.visible = false;
        }
    }
}