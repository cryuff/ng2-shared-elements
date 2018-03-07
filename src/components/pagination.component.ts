import { Component, Input, Output, OnChanges, EventEmitter } from "@angular/core";

@Component({
  selector: "com-pages",
  template: `<nav aria-label="Page navigation" id="com-pagination">
  <ul class="pagination" (click)="changePage($event)">
    <li *ngIf="currentPage > 1">
      <a aria-label="Previous" id="1">
        &laquo;
      </a>
    </li>
    <li *ngFor="let page of range(currentPage-2,5)">
      <a *ngIf="page > 0 && page <= lastPageNumber" [attr.id]="page" [class.active-page]="page == currentPage">{{page}}</a>
    </li>
    <li *ngIf="currentPage < lastPageNumber">
      <a aria-label="Next" [attr.id]="lastPageNumber">
        &raquo;
      </a>
    </li>
  </ul>
</nav>
`
})

export class PaginationComponent implements OnChanges {

  @Input() count: number;
  @Input() onPage: number;
  @Input() currentPage: number;
  @Output() notify = new EventEmitter<number>();
  private lastPageNumber: number;

  ngOnChanges(): void {
    this.lastPageNumber = Math.ceil(this.count / this.onPage);
  }

  changePage(event: any): void {
    if (event.target.tagName === "A") {
      let id: number = event.target.id !== 0 && event.target.id !== "" ? event.target.id : event.target.parentElement.id;
      if (Number(id) !== this.currentPage)
        this.notify.emit(Number(id));
    }
  }


  range(start: number, count: number): number[] {
    return Array.apply(0, Array(count))
      .map((element: any, index: any): number => index + start);
  }

}