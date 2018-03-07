interface ISearchProperty {
    placeholder: string;
    type: string;
    value: any;
    show?: string;
    paramToReturn?: string;
    paramToShow?: string;
    width :number
}

export class BaseSearchObject {
    reset() {
        let so = this;
        for (let entry in so) {
            if (so.hasOwnProperty(entry)) {
                if (so[entry]["type"] === "number") {
                    so[entry]["value"] = null;
                } else if (so[entry]["type"] === "string") {
                    so[entry]["value"] = "";
                }
                else if (so[entry]["type"] === "dateGroup") {
                    so[entry]["value"][0] = null;
                    so[entry]["value"][1] = null;
                    so[entry]["value"][2] = -1;
                }
                else if (so[entry]["type"] === "select") {
                    so[entry]["value"] = -1;
                }
                else if (so[entry]["type"] === "autocomplete") {
                    so[entry]["value"] = 0;
                    so[entry]["query"] = "";
                }
            }
        }
    }

}