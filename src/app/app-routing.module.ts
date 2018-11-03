import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';
import { StatusComponent } from './status/status.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  { path: '',       component: SettingsComponent  },
  { path: 'about',  component: AboutComponent     },
  { path: 'logs',   component: LogsComponent      },
  { path: 'status', component: StatusComponent    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
