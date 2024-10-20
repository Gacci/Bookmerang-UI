import { Directive, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Directive()
export abstract class Unsubscribable {
    protected unsubscribe$ = new Subject<void>();

    unsubscribe() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
