import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

export class redirect {
  path: string;
  destination: string;
  editable: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  redirects: redirect[] = [];

  constructor() { }

  ngOnInit() {

    this.redirects.push({
      path: '/red-ampp',
      destination: 'localhost:[randomPort]',
      editable: false
    });
    this.redirects.push({
      path: '/red-ampp/api',
      destination: 'localhost:[randomPort]',
      editable: false
    });
    this.redirects.push({
      path: '/test',
      destination: 'localhost:3333',
      editable: true
    });

  }

}
