import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from '../../../node_modules/rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket;

  constructor() {
    this.socket = io({
      path: '/red-ampp/socket.io/'
    });
  }

  public getLogs = () => {
    return Observable.create( observer => {
      this.socket.on('new-log-entry', message => {
        observer.next( message );
      });
    });
  }

}
