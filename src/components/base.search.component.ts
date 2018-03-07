import { Component, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from
    "@angular/core";
import { BaseDataService } from "../services/base.data.service";
import {
    Compiler, NgModule,
    ViewContainerRef
    } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NKDatetimeModule } from "ng2-datetime/ng2-datetime";

@Component({
    selector: "com-base-search",
    template: `<div #container></div>`
})
export class BaseSearchComponent implements OnChanges, OnDestroy {
    @ViewChild("container", { read: ViewContainerRef })
    container: ViewContainerRef;
    dataContainer: ElementRef;
    @Input()
    searchObject: any;
    @Input()
    dsName: string;
    @Output()
    notifySearch = new EventEmitter<string>();

    private addComponent(template: string, searchObject: any, notifySearch: any) {
        @Component({
            template: template
        })
        class TemplateComponent {
            protected searchObject = searchObject;
            protected dateRanges = [
                { name: "Wybierz zakres dat", id: -1 },
                { name: "Wszystkie", id: 0 }, { name: "Dzisiaj", id: 1 }, { name: "Ostatni tydzień", id: 2 },
                { name: "Ostatni miesiąc", id: 3 },
                { name: "Ostatni rok", id: 4 }
            ];

            onDatetimeChange(event: any) {
                if (event != null)
                    this.searchObject.dateRangeId = -1;
            }

            protected onDateRangeChange(): void {
                this.searchObject.date.value[0] = new Date();
                this.searchObject.date.value[1] = null;
                if (this.searchObject.date.value[2] === 2) {
                    this.searchObject.date.value[0].setDate(this.searchObject.date.value[0].getDate() - 7);
                } else if (this.searchObject.date.value[2] === 3) {
                    this.searchObject.date.value[0].setMonth(this.searchObject.date.value[0].getMonth() - 1);
                } else if (this.searchObject.date.value[2] === 4) {
                    this.searchObject.date.value[0].setFullYear(this.searchObject.date.value[0].getFullYear() - 1);
                } else {
                    this.searchObject.date.value[0] = null;
                }
            }

            onNotifyFromAutocomplete(event: number, autocompleteName: string): void {
                if (event > 0)
                    this.searchObject[autocompleteName].value = event;
                else
                    this.searchObject[autocompleteName].value = 0;
                this.search();
            }

            onNotifyFromAutocompleteQuery(event: string, autocompleteName: string): void {
                if (event.length > 0)
                    this.searchObject[autocompleteName].query = event;
                else
                    this.searchObject[autocompleteName].query = "";
                this.search();
            }

            clearSearch(): void {
                this.searchObject.reset();
                this.search();
            }

            search(): void {
                let so = this.searchObject;
                let filter = "";
                for (let key in so) {
                    if (so.hasOwnProperty(key)) {
                        let val = so[key];
                        if (val != null) {
                            if (val.type === "dateGroup") {
                                if (val.value[0] != null && val.value[0]) {
                                    filter += `&${key}From=${val.value[0].toISOString().slice(0, 10)}`;
                                }
                                if (val.value[1] != null)
                                    filter += `&${key}To=${val.value[1].toISOString().slice(0, 10)}`;
                            } else if (val.type === "string") {
                                if (val.value.length > 0)
                                    filter += `&${key}=${val.value}`;
                            } else if (val.type === "number") {
                                if (val.value != null)
                                    filter += `&${key}=${val.value}`;
                            } else if (val.type === "select") {
                                if (val.value > -1) {
                                    filter += `&${key}=${val.value}`;
                                }
                            } else if (val.type === "autocomplete") {
                                if (val.value < 0) {
                                    if (val.query.length > 0)
                                        filter += `&${key}String=${val.query}`;
                                } else
                                    filter += `&${key}=${val.value}`;
                            }

                        }
                    }
                }
                notifySearch.emit(filter);
                document.getElementById("searchButton").blur();
                document.getElementById("cleanButton").blur();
            }

            protected handleKeyboardEvents(event: any): void {
                if (event.keyCode === 13)
                    this.search();
            }

        }

        @NgModule(({
            imports: [CommonModule, RouterModule, FormsModule, NKDatetimeModule],
            declarations: [TemplateComponent]
        }) as any)
        class TemplateModule {
        }

        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
        const factory = mod.componentFactories.find((comp) =>
            comp.componentType === TemplateComponent
        );
        this.container.createComponent(factory);
    }

    constructor(private _dataService: BaseDataService, private compiler: Compiler) {
    }

    transform(value: any): any {
        let template = `<div class="card" (keypress)="handleKeyboardEvents($event)">
    <div class="card-head">
        Panel wyszukiwania
    </div>
    <div class="card-body text-center" id="search-box">
        <div class="row">`;
        for (let entry in value) {
            if (value.hasOwnProperty(entry)) {
                if (value[entry].show !== "no") {
                    if (value[entry].type === "string") {
                        template += ` <div class="col-md-${value[entry].width}">
                                    <input maxlength="255" [(ngModel)]="searchObject.${entry}.value" placeholder= "${
                            value[entry].placeholder}" class="form-control" >
                                  </div>`;
                    } else if (value[entry].type === "number") {
                        template += ` <div class="col-md-${value[entry].width}">
                                    <input maxlength="10" [(ngModel)]="searchObject.${entry}.value" placeholder= "${
                            value[entry].placeholder}" class="form-control" >
                                  </div> `;
                    } else if (value[entry].type === "dateGroup") {
                        template += `<div class="col-md-${value[entry].width} timepicker">
                        <datetime [timepicker]="false" [(ngModel)]="searchObject.${entry}.value[0]"
                                  (ngModelChange)="onDatetimeChange($event)"
                                  [datepicker]="{ placeholder: '${value[entry].placeholder[0]}',
                                  format: 'dd-mm-yyyy',
                                  todayHighlight: true,
                                  language: 'pl',
                                  autoclose: true
                                  }"></datetime>
                    </div>
                    <div class="col-md-${value[entry].width} timepicker">
                        <datetime [timepicker]="false" [(ngModel)]="searchObject.${entry}.value[1]"
                                  (ngModelChange)="onDatetimeChange($event)"
                                  [datepicker]="{ placeholder: '${value[entry].placeholder[1]}',
                                  format: 'dd-mm-yyyy',
                                  todayHighlight: true,
                                  language: 'pl',
                                  autoclose: true  }"></datetime>
                    </div>
                    <div class="col-md-${value[entry].width}">
                        <select class="form-control" [class.placeholder-color]="searchObject.${entry
                            }.value[2] < 1" [(ngModel)]="searchObject.${entry
                            }.value[2]" (change)="onDateRangeChange()">
                            <option *ngFor="let range of dateRanges" [ngValue]="range.id">{{range.name}}</option>
                        </select>
                    </div>`;
                    } else if (value[entry].type === "select") {
                        let paramToShow = this.searchObject[`${entry}`].paramToShow;
                        let paramToReturn = this.searchObject[`${entry}`].paramToReturn;
                        template += `<div class="col-md-${value[entry].width}" >
                            <select class="form-control" [(ngModel)]="searchObject.${entry}.value" required="" [class.placeholder-color]="searchObject.${entry}.value < 0" >
                            <option value="-1" >{{searchObject.${entry}.placeholder}}</option>
                            <option *ngFor="let element of searchObject.${entry}.items;
                            let i = index" 
                            [ngValue]="this.searchObject.${entry}.paramToReturn != null ? element.${paramToReturn} : i">
                            {{this.searchObject.${entry}.paramToShow != null ? element.${paramToShow} : element}}
                            </option>
                            </select>
                        </div>`;
                    } else if (value[entry].type === "autocomplete") {
                        template += `<div class="col-md-${value[entry].width}">
                         <com-autocomplete #autocomplete${entry} [items]="searchObject.${entry
                            }.items" [idOfSelected]="searchObject.${entry}.value" [placeholder]="'${value[entry]
                            .placeholder}'" [query]="searchObject.${entry}.query"
                            [listAllElementsOnStart]="searchObject.${entry
                            }.listAllElementsOnStart" (notifyAutoComplete)="onNotifyFromAutocomplete($event, '${entry
                            }')" (notifyAutoCompleteQuery)="onNotifyFromAutocompleteQuery($event, '${entry
                            }')"></com-autocomplete>
                         </div>`;
                    }

                }
            }
        }
        template += `
                    </div>
                    <div class="row voffset1 text-center" style="padding-bottom: 15px;">
                        <button class="btn btn-primary" #searchButton id="searchButton" (click)='search()'>Szukaj</button>
                        <button class="btn btn-primary" id="cleanButton" (click)="clearSearch()">Wyczyść</button>
                    </div>
                    </div>
                    </div>`;
        return template;
    }

    ngOnChanges(): void {
        this.searchObject.reset();
        if (this._dataService.searchObjects[this.dsName] != null)
            this.searchObject = this._dataService.searchObjects[this.dsName];
        this.addComponent(this.transform(this.searchObject), this.searchObject, this.notifySearch);
        this.search();
    }

    ngOnDestroy(): void {
        this._dataService.searchObjects[this.dsName] = this.searchObject;
    }

    search(): void {
        document.getElementById("searchButton").click();
    }


}