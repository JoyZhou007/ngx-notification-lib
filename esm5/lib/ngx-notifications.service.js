/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
var NgxNotificationsService = /** @class */ (function () {
    function NgxNotificationsService() {
        this.initNotification();
    }
    /**
     * 初始化
     */
    /**
     * 初始化
     * @return {?}
     */
    NgxNotificationsService.prototype.initNotification = /**
     * 初始化
     * @return {?}
     */
    function () {
        this.topic = new Subject();
        this.observer = this.topic.asObservable();
    };
    /**
     * 获取观察者
     */
    /**
     * 获取观察者
     * @return {?}
     */
    NgxNotificationsService.prototype.getNotification = /**
     * 获取观察者
     * @return {?}
     */
    function () {
        return this.observer;
    };
    /**
     * 发布
     * @param data
     */
    /**
     * 发布
     * @param {?} data
     * @return {?}
     */
    NgxNotificationsService.prototype.publish = /**
     * 发布
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (data) {
            this.topic.next(data);
        }
    };
    NgxNotificationsService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    NgxNotificationsService.ctorParameters = function () { return []; };
    /** @nocollapse */ NgxNotificationsService.ngInjectableDef = i0.defineInjectable({ factory: function NgxNotificationsService_Factory() { return new NgxNotificationsService(); }, token: NgxNotificationsService, providedIn: "root" });
    return NgxNotificationsService;
}());
export { NgxNotificationsService };
if (false) {
    /** @type {?} */
    NgxNotificationsService.prototype.topic;
    /** @type {?} */
    NgxNotificationsService.prototype.observer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ub3RpZmljYXRpb25zLyIsInNvdXJjZXMiOlsibGliL25neC1ub3RpZmljYXRpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFFekM7SUFRRTtRQUNFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSSxrREFBZ0I7Ozs7SUFBdkI7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSSxpREFBZTs7OztJQUF0QjtRQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDSSx5Q0FBTzs7Ozs7SUFBZCxVQUFlLElBR2Q7UUFDQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQzs7Z0JBdENGLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7O2tDQUxEO0NBMENDLEFBdkNELElBdUNDO1NBcENZLHVCQUF1Qjs7O0lBRWxDLHdDQUEyQjs7SUFDM0IsMkNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc1NlcnZpY2Uge1xuXG4gIHB1YmxpYyB0b3BpYzogU3ViamVjdDxhbnk+O1xuICBwdWJsaWMgb2JzZXJ2ZXI6IE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmluaXROb3RpZmljYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDliJ3lp4vljJZcbiAgICovXG4gIHB1YmxpYyBpbml0Tm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMudG9waWMgPSBuZXcgU3ViamVjdCgpO1xuICAgIHRoaXMub2JzZXJ2ZXIgPSB0aGlzLnRvcGljLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPluinguWvn+iAhVxuICAgKi9cbiAgcHVibGljIGdldE5vdGlmaWNhdGlvbigpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLm9ic2VydmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIOWPkeW4g1xuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgcHVibGljIHB1Ymxpc2goZGF0YToge1xuICAgIGFjdDogYW55LFxuICAgIGRhdGE/OiBhbnlcbiAgfSk6IHZvaWQge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLnRvcGljLm5leHQoZGF0YSk7XG4gICAgfVxuICB9XG59XG4iXX0=