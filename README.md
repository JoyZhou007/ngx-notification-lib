## install
    npm i ngx-notifications
## import
    @NgModule({
    declarations: [
    ],
    imports: [
        NgxNotificationsModule
    ],
    providers: [
        
    ],
    bootstrap: []
    })

## usage
### publish notification
first inject service

      constructor(public notificationsService: NgxNotificationsService) {
      }
      
then publish

    this.notificationsService.publish({
        act: 'open-tip-dialog',
        data: {content: data.content}
    });

observer notification

        constructor(public notificationsService: NgxNotificationsService) {
        this.notificationsService.getNotification().subscribe(next => {
        if (next.act === 'open-winner-tip') {
            
        } else if (next.act === 'open-tip-dialog') {
          
        }
        });
    }
