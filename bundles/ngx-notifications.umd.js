(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('ngx-notifications', ['exports', '@angular/core', 'rxjs'], factory) :
    (factory((global['ngx-notifications'] = {}),global.ng.core,global.rxjs));
}(this, (function (exports,i0,rxjs) { 'use strict';

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
                this.topic = new rxjs.Subject();
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        NgxNotificationsService.ctorParameters = function () { return []; };
        /** @nocollapse */ NgxNotificationsService.ngInjectableDef = i0.defineInjectable({ factory: function NgxNotificationsService_Factory() { return new NgxNotificationsService(); }, token: NgxNotificationsService, providedIn: "root" });
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
            { type: i0.Component, args: [{
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
            { type: i0.NgModule, args: [{
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

    exports.NgxNotificationsService = NgxNotificationsService;
    exports.NgxNotificationsComponent = NgxNotificationsComponent;
    exports.NgxNotificationsModule = NgxNotificationsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS50cyIsIm5nOi8vbmd4LW5vdGlmaWNhdGlvbnMvbGliL25neC1ub3RpZmljYXRpb25zLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LW5vdGlmaWNhdGlvbnMvbGliL25neC1ub3RpZmljYXRpb25zLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zU2VydmljZSB7XG5cbiAgcHVibGljIHRvcGljOiBTdWJqZWN0PGFueT47XG4gIHB1YmxpYyBvYnNlcnZlcjogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5pdE5vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIMOlwojCncOlwqfCi8OlwozCllxuICAgKi9cbiAgcHVibGljIGluaXROb3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy50b3BpYyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgdGhpcy5vYnNlcnZlciA9IHRoaXMudG9waWMuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogw6jCjsK3w6XCj8KWw6jCp8KCw6XCr8Kfw6jCgMKFXG4gICAqL1xuICBwdWJsaWMgZ2V0Tm90aWZpY2F0aW9uKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXI7XG4gIH1cblxuICAvKipcbiAgICogw6XCj8KRw6XCuMKDXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChkYXRhOiB7XG4gICAgYWN0OiBhbnksXG4gICAgZGF0YT86IGFueVxuICB9KTogdm9pZCB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9waWMubmV4dChkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmd4LW5vdGlmaWNhdGlvbnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxwPlxuICAgICAgbmd4LW5vdGlmaWNhdGlvbnMgd29ya3MhXG4gICAgPC9wPlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neE5vdGlmaWNhdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL25neC1ub3RpZmljYXRpb25zLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIlN1YmplY3QiLCJJbmplY3RhYmxlIiwiQ29tcG9uZW50IiwiTmdNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtRQVdFO1lBQ0UsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7Ozs7Ozs7O1FBS00sa0RBQWdCOzs7O1lBQXZCO2dCQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSUEsWUFBTyxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUMzQzs7Ozs7Ozs7UUFLTSxpREFBZTs7OztZQUF0QjtnQkFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDdEI7Ozs7Ozs7Ozs7UUFNTSx5Q0FBTzs7Ozs7WUFBZCxVQUFlLElBR2Q7Z0JBQ0MsSUFBSSxJQUFJLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZCO2FBQ0Y7O29CQXRDRkMsYUFBVSxTQUFDO3dCQUNWLFVBQVUsRUFBRSxNQUFNO3FCQUNuQjs7Ozs7c0NBTEQ7S0EwQ0M7Ozs7OztBQzFDRDtRQWFFO1NBQ0M7Ozs7UUFFRCw0Q0FBUTs7O1lBQVI7YUFDQzs7b0JBZkZDLFlBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsdUJBQXVCO3dCQUNqQyxRQUFRLEVBQUUseURBSVQ7d0JBQ0QsTUFBTSxFQUFFLEVBQUU7cUJBQ1g7Ozs7UUFTRCxnQ0FBQztLQUFBOzs7Ozs7QUNuQkQ7UUFHQTtTQU11Qzs7b0JBTnRDQyxXQUFRLFNBQUM7d0JBQ1IsT0FBTyxFQUFFLEVBQ1I7d0JBQ0QsWUFBWSxFQUFFLENBQUMseUJBQXlCLENBQUM7d0JBQ3pDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixDQUFDO3FCQUNyQzs7UUFDcUMsNkJBQUM7S0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9