/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ub3RpZmljYXRpb25zLyIsInNvdXJjZXMiOlsibGliL25neC1ub3RpZmljYXRpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBYyxNQUFNLCtCQUErQixDQUFDOztBQUtwRSxNQUFNLE9BQU8sdUJBQXVCO0lBS2xDO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFLTSxnQkFBZ0I7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM1QyxDQUFDOzs7OztJQUtNLGVBQWU7UUFDcEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Ozs7OztJQU1NLE9BQU8sQ0FBQyxJQUdkO1FBQ0MsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7OztZQXRDRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7Ozs7SUFHQyx3Q0FBMkI7O0lBQzNCLDJDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNTZXJ2aWNlIHtcblxuICBwdWJsaWMgdG9waWM6IFN1YmplY3Q8YW55PjtcbiAgcHVibGljIG9ic2VydmVyOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pbml0Tm90aWZpY2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICog5Yid5aeL5YyWXG4gICAqL1xuICBwdWJsaWMgaW5pdE5vdGlmaWNhdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnRvcGljID0gbmV3IFN1YmplY3QoKTtcbiAgICB0aGlzLm9ic2VydmVyID0gdGhpcy50b3BpYy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDojrflj5bop4Llr5/ogIVcbiAgICovXG4gIHB1YmxpYyBnZXROb3RpZmljYXRpb24oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiDlj5HluINcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKGRhdGE6IHtcbiAgICBhY3Q6IGFueSxcbiAgICBkYXRhPzogYW55XG4gIH0pOiB2b2lkIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy50b3BpYy5uZXh0KGRhdGEpO1xuICAgIH1cbiAgfVxufVxuIl19