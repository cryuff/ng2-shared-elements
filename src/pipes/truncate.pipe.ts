import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "truncate"
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, arg0: number, arg1: string): string {
        if (value != null) {
            let limit = arg0;
            let trail = arg1.length > 1 ? arg1 : "";
            return value.length > limit ? value.substring(0, limit) + trail : value;
        } else
            return "";
    }
}