/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ub3RpZmljYXRpb25zLyIsInNvdXJjZXMiOlsibGliL25neC1ub3RpZmljYXRpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBYyxNQUFNLCtCQUErQixDQUFDOztBQUVwRTtJQVFFO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHOzs7OztJQUNJLGtEQUFnQjs7OztJQUF2QjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVEOztPQUVHOzs7OztJQUNJLGlEQUFlOzs7O0lBQXRCO1FBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7O09BR0c7Ozs7OztJQUNJLHlDQUFPOzs7OztJQUFkLFVBQWUsSUFHZDtRQUNDLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDOztnQkF0Q0YsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7Ozs7a0NBTEQ7Q0EwQ0MsQUF2Q0QsSUF1Q0M7U0FwQ1ksdUJBQXVCOzs7SUFFbEMsd0NBQTJCOztJQUMzQiwyQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zU2VydmljZSB7XG5cbiAgcHVibGljIHRvcGljOiBTdWJqZWN0PGFueT47XG4gIHB1YmxpYyBvYnNlcnZlcjogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5pdE5vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWIneWni+WMllxuICAgKi9cbiAgcHVibGljIGluaXROb3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy50b3BpYyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgdGhpcy5vYnNlcnZlciA9IHRoaXMudG9waWMuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W6KeC5a+f6ICFXG4gICAqL1xuICBwdWJsaWMgZ2V0Tm90aWZpY2F0aW9uKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXI7XG4gIH1cblxuICAvKipcbiAgICog5Y+R5biDXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChkYXRhOiB7XG4gICAgYWN0OiBhbnksXG4gICAgZGF0YT86IGFueVxuICB9KTogdm9pZCB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9waWMubmV4dChkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==