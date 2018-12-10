import { Injectable, Component, NgModule, defineInjectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /** @nocollapse */ NgxNotificationsService.ngInjectableDef = defineInjectable({ factory: function NgxNotificationsService_Factory() { return new NgxNotificationsService(); }, token: NgxNotificationsService, providedIn: "root" });
    return NgxNotificationsService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxNotificationsComponent = /** @class */ (function () {
    function NgxNotificationsComponent() {
    }
    /**
     * @return {?}
     */
    NgxNotificationsComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    NgxNotificationsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lib-ngx-notifications',
                    template: "\n    <p>\n      ngx-notifications works!\n    </p>\n  ",
                    styles: []
                },] },
    ];
    /** @nocollapse */
    NgxNotificationsComponent.ctorParameters = function () { return []; };
    return NgxNotificationsComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxNotificationsModule = /** @class */ (function () {
    function NgxNotificationsModule() {
    }
    NgxNotificationsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    declarations: [NgxNotificationsComponent],
                    exports: [NgxNotificationsComponent]
                },] },
    ];
    return NgxNotificationsModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxNotificationsService, NgxNotificationsComponent, NgxNotificationsModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuanMubWFwIiwic291cmNlcyI6WyJuZzovL25neC1ub3RpZmljYXRpb25zL2xpYi9uZ3gtbm90aWZpY2F0aW9ucy5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNTZXJ2aWNlIHtcblxuICBwdWJsaWMgdG9waWM6IFN1YmplY3Q8YW55PjtcbiAgcHVibGljIG9ic2VydmVyOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pbml0Tm90aWZpY2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogw6XCiMKdw6XCp8KLw6XCjMKWXG4gICAqL1xuICBwdWJsaWMgaW5pdE5vdGlmaWNhdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnRvcGljID0gbmV3IFN1YmplY3QoKTtcbiAgICB0aGlzLm9ic2VydmVyID0gdGhpcy50b3BpYy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDDqMKOwrfDpcKPwpbDqMKnwoLDpcKvwp/DqMKAwoVcbiAgICovXG4gIHB1YmxpYyBnZXROb3RpZmljYXRpb24oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiDDpcKPwpHDpcK4woNcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKGRhdGE6IHtcbiAgICBhY3Q6IGFueSxcbiAgICBkYXRhPzogYW55XG4gIH0pOiB2b2lkIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy50b3BpYy5uZXh0KGRhdGEpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZ3gtbm90aWZpY2F0aW9ucycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHA+XG4gICAgICBuZ3gtbm90aWZpY2F0aW9ucyB3b3JrcyFcbiAgICA8L3A+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neE5vdGlmaWNhdGlvbnNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNNb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0lBV0U7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7Ozs7SUFLTSxrREFBZ0I7Ozs7SUFBdkI7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQzNDOzs7Ozs7OztJQUtNLGlEQUFlOzs7O0lBQXRCO1FBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCOzs7Ozs7Ozs7O0lBTU0seUNBQU87Ozs7O0lBQWQsVUFBZSxJQUdkO1FBQ0MsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtLQUNGOztnQkF0Q0YsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7Ozs7a0NBTEQ7Q0EwQ0M7Ozs7OztBQzFDRDtJQWFFO0tBQ0M7Ozs7SUFFRCw0Q0FBUTs7O0lBQVI7S0FDQzs7Z0JBZkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLFFBQVEsRUFBRSx5REFJVDtvQkFDRCxNQUFNLEVBQUUsRUFBRTtpQkFDWDs7OztJQVNELGdDQUFDO0NBQUE7Ozs7OztBQ25CRDtJQUdBO0tBTXVDOztnQkFOdEMsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxFQUNSO29CQUNELFlBQVksRUFBRSxDQUFDLHlCQUF5QixDQUFDO29CQUN6QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztpQkFDckM7O0lBQ3FDLDZCQUFDO0NBQUE7Ozs7Ozs7Ozs7Ozs7OyJ9