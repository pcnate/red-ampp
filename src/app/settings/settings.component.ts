import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfigService } from '../config.service';
import { Redirect, SuccessFull } from '../_models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  redirects: Redirect[] = [];
  newRedirect: Redirect = {
    path: '',
    destination: '',
    editable: true,
  };

  constructor(
    private configService: ConfigService,
  ) { }

  ngOnInit() {

    this.configService.getRoutes()
      .subscribe( ( routes: Redirect[] ) => {
        this.redirects = routes;
      });

  }


  addNewRedirect() {
    if( this.newRedirect.path === '' || this.newRedirect.destination === '' ) {
      return;
    }
    const redirect = JSON.parse( JSON.stringify( this.newRedirect ) );
    this.configService.post( 'register', this.newRedirect )
      .subscribe( ( data: SuccessFull ) => {
        if( data.success ) {
          this.redirects.push( redirect );
          this.newRedirect.path = '';
          this.newRedirect.destination = '';
        }
      })
  }

  removeRedirect( redirect ) {
    if( !redirect.editable ) {
      return;
    }
    this.configService.post( 'unregister', redirect )
      .subscribe( ( data: SuccessFull ) => {
        if( data.success ) {
          this.redirects = this.redirects.filter( m => !( redirect.path === m.path && redirect.destination === m.destination ) );
        }
      });
  }

}
