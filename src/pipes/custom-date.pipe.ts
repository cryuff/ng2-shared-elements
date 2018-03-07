import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "customDate"
})
export class CustomDatePipe implements PipeTransform {
    transform(value: any): string {
        if (value != null) {
            let date = new Date(value);
            if (date.getFullYear() > 1000)
                return date.toLocaleDateString().split(".").join("-");
        }
        return "-";
    }
}