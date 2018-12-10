import { Injectable, Component, NgModule, defineInjectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxNotificationsService {
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
/** @nocollapse */ NgxNotificationsService.ngInjectableDef = defineInjectable({ factory: function NgxNotificationsService_Factory() { return new NgxNotificationsService(); }, token: NgxNotificationsService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxNotificationsComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NgxNotificationsComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-ngx-notifications',
                template: `
    <p>
      ngx-notifications works!
    </p>
  `,
                styles: []
            },] },
];
/** @nocollapse */
NgxNotificationsComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxNotificationsModule {
}
NgxNotificationsModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [NgxNotificationsComponent],
                exports: [NgxNotificationsComponent]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxNotificationsService, NgxNotificationsComponent, NgxNotificationsModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuanMubWFwIiwic291cmNlcyI6WyJuZzovL25neC1ub3RpZmljYXRpb25zL2xpYi9uZ3gtbm90aWZpY2F0aW9ucy5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNTZXJ2aWNlIHtcblxuICBwdWJsaWMgdG9waWM6IFN1YmplY3Q8YW55PjtcbiAgcHVibGljIG9ic2VydmVyOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pbml0Tm90aWZpY2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogw6XCiMKdw6XCp8KLw6XCjMKWXG4gICAqL1xuICBwdWJsaWMgaW5pdE5vdGlmaWNhdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnRvcGljID0gbmV3IFN1YmplY3QoKTtcbiAgICB0aGlzLm9ic2VydmVyID0gdGhpcy50b3BpYy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDDqMKOwrfDpcKPwpbDqMKnwoLDpcKvwp/DqMKAwoVcbiAgICovXG4gIHB1YmxpYyBnZXROb3RpZmljYXRpb24oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiDDpcKPwpHDpcK4woNcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKGRhdGE6IHtcbiAgICBhY3Q6IGFueSxcbiAgICBkYXRhPzogYW55XG4gIH0pOiB2b2lkIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy50b3BpYy5uZXh0KGRhdGEpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZ3gtbm90aWZpY2F0aW9ucycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHA+XG4gICAgICBuZ3gtbm90aWZpY2F0aW9ucyB3b3JrcyFcbiAgICA8L3A+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neE5vdGlmaWNhdGlvbnNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNNb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE1BTWEsdUJBQXVCO0lBS2xDO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7S0FDekI7Ozs7O0lBS00sZ0JBQWdCO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDM0M7Ozs7O0lBS00sZUFBZTtRQUNwQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7Ozs7OztJQU1NLE9BQU8sQ0FBQyxJQUdkO1FBQ0MsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtLQUNGOzs7WUF0Q0YsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7Ozs7Ozs7O0FDTEQsTUFXYSx5QkFBeUI7SUFFcEM7S0FDQzs7OztJQUVELFFBQVE7S0FDUDs7O1lBZkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLFFBQVEsRUFBRTs7OztHQUlUO2dCQUNELE1BQU0sRUFBRSxFQUFFO2FBQ1g7Ozs7Ozs7OztBQ1ZELE1BU2Esc0JBQXNCOzs7WUFObEMsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxFQUNSO2dCQUNELFlBQVksRUFBRSxDQUFDLHlCQUF5QixDQUFDO2dCQUN6QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQzthQUNyQzs7Ozs7Ozs7Ozs7Ozs7OyJ9