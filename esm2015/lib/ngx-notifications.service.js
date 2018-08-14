/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ub3RpZmljYXRpb25zLyIsInNvdXJjZXMiOlsibGliL25neC1ub3RpZmljYXRpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBYyxNQUFNLCtCQUErQixDQUFDOztBQUtwRSxNQUFNO0lBS0o7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7SUFLTSxnQkFBZ0I7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7Ozs7O0lBTXJDLGVBQWU7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Ozs7Ozs7SUFPaEIsT0FBTyxDQUFDLElBR2Q7UUFDQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7Ozs7WUFyQ0osVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc1NlcnZpY2Uge1xuXG4gIHB1YmxpYyB0b3BpYzogU3ViamVjdDxhbnk+O1xuICBwdWJsaWMgb2JzZXJ2ZXI6IE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmluaXROb3RpZmljYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDliJ3lp4vljJZcbiAgICovXG4gIHB1YmxpYyBpbml0Tm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMudG9waWMgPSBuZXcgU3ViamVjdCgpO1xuICAgIHRoaXMub2JzZXJ2ZXIgPSB0aGlzLnRvcGljLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPluinguWvn+iAhVxuICAgKi9cbiAgcHVibGljIGdldE5vdGlmaWNhdGlvbigpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLm9ic2VydmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIOWPkeW4g1xuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgcHVibGljIHB1Ymxpc2goZGF0YToge1xuICAgIGFjdDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnlcbiAgfSk6IHZvaWQge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLnRvcGljLm5leHQoZGF0YSk7XG4gICAgfVxuICB9XG59XG4iXX0=