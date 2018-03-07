import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CopyBoxComponent } from "../components/copy-box.component";
import { AutocompleteComponent } from "../components/autocomplete.component";
import { ConfirmComponent } from "../components/confirm.component";
import { TruncatePipe } from "../pipes/truncate.pipe";
import { CustomDatePipe } from "../pipes/custom-date.pipe";
import { PaginationComponent } from "../components/pagination.component";
import { LoadingComponent } from "../components/loading.component";
import { NKDatetimeModule } from "ng2-datetime/ng2-datetime";

export { CopyBoxComponent } from "../components/copy-box.component";
export { AutocompleteComponent } from "../components/autocomplete.component";
export { ConfirmComponent } from "../components/confirm.component";
export { TruncatePipe } from "../pipes/truncate.pipe";
export { CustomDatePipe } from "../pipes/custom-date.pipe";
export { PaginationComponent } from "../components/pagination.component";
export { LoadingComponent } from "../components/loading.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NKDatetimeModule
    ],
    declarations: [
        CopyBoxComponent,
        AutocompleteComponent,
        ConfirmComponent,
        TruncatePipe,
        PaginationComponent,
        LoadingComponent,
        CustomDatePipe,
    ],
    exports: [
        CopyBoxComponent,
        AutocompleteComponent,
        ConfirmComponent,
        TruncatePipe,
        PaginationComponent,
        LoadingComponent,
        CustomDatePipe,
    ]
})
export class SharedModule {
}