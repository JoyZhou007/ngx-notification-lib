/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class NgxNotificationsService {
    constructor() {
        this.initNotification();
    }
    /**
     * 初始化
     * @return {?}
     */
    initNotification() {
        this.topic = new Subject();
        this.observer = this.topic.asObservable();
    }
    /**
     * 获取观察者
     * @return {?}
     */
    getNotification() {
        return this.observer;
    }
    /**
     * 发布
     * @param {?} data
     * @return {?}
     */
    publish(data) {
        if (data) {
            this.topic.next(data);
        }
    }
}
NgxNotificationsService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
NgxNotificationsService.ctorParameters = () => [];
/** @nocollapse */ NgxNotificationsService.ngInjectableDef = i0.defineInjectable({ factory: function NgxNotificationsService_Factory() { return new NgxNotificationsService(); }, token: NgxNotificationsService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgxNotificationsService.prototype.topic;
    /** @type {?} */
    NgxNotificationsService.prototype.observer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ub3RpZmljYXRpb25zLyIsInNvdXJjZXMiOlsibGliL25neC1ub3RpZmljYXRpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFLekMsTUFBTSxPQUFPLHVCQUF1QjtJQUtsQztRQUNFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBS00sZ0JBQWdCO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDNUMsQ0FBQzs7Ozs7SUFLTSxlQUFlO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDOzs7Ozs7SUFNTSxPQUFPLENBQUMsSUFHZDtRQUNDLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDOzs7WUF0Q0YsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7Ozs7O0lBR0Msd0NBQTJCOztJQUMzQiwyQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zU2VydmljZSB7XG5cbiAgcHVibGljIHRvcGljOiBTdWJqZWN0PGFueT47XG4gIHB1YmxpYyBvYnNlcnZlcjogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5pdE5vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWIneWni+WMllxuICAgKi9cbiAgcHVibGljIGluaXROb3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy50b3BpYyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgdGhpcy5vYnNlcnZlciA9IHRoaXMudG9waWMuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W6KeC5a+f6ICFXG4gICAqL1xuICBwdWJsaWMgZ2V0Tm90aWZpY2F0aW9uKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXI7XG4gIH1cblxuICAvKipcbiAgICog5Y+R5biDXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChkYXRhOiB7XG4gICAgYWN0OiBhbnksXG4gICAgZGF0YT86IGFueVxuICB9KTogdm9pZCB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9waWMubmV4dChkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==