import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'red-ampp',      component: SettingsComponent },
  { path: 'red-ampp/about', component: AboutComponent    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
