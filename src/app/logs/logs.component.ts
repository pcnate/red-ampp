import { Component, OnInit } from '@angular/core';
import { SocketService } from '../_services';
import { Log } from '../_models';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  logs: Log[] = [];

  constructor(
    private socketService: SocketService,
  ) { }

  ngOnInit() {

    this.socketService
      .getLogs()
      .subscribe( ( message: any ) => {

        this.logs.unshift({
          host: message.host,
          url: message.url,
          date: new Date()
        });

      });
  }

}
