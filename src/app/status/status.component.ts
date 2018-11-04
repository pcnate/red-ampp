import { Component, OnInit, OnDestroy } from '@angular/core';
import { Status } from '../_models';
import { timer } from 'rxjs';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {

  status: Status = new Status();

  source = timer( 1000, 3000 );
  subscribe = this.source.subscribe( val => {
    this.configService.get( 'status' ).subscribe( ( status: Status ) => {
      this.status = status;
      this.status.requests.sort( ( a, b ) => b.count - a.count )
    });
  });

  constructor(
    private configService: ConfigService,
  ) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
