import { Observable, Subject } from 'rxjs';
export declare class NgxNotificationsService {
    topic: Subject<any>;
    observer: Observable<any>;
    constructor();
    /**
     * 初始化
     */
    initNotification(): void;
    /**
     * 获取观察者
     */
    getNotification(): Observable<any>;
    /**
     * 发布
     * @param data
     */
    publish(data: {
        act: any;
        data?: any;
    }): void;
}
