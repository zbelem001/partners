import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout';
import { DashboardComponent } from './pages/dashboard';
import { ProspectsComponent } from './pages/prospects';
import { ProspectDetailComponent } from './pages/prospect-detail';
import { PartnersComponent } from './pages/partners';
import { PartnerDetailComponent } from './pages/partner-detail';
import { ConventionsComponent } from './pages/conventions';
import { ConventionDetailComponent } from './pages/convention-detail';
import { ActivitiesComponent } from './pages/activities';
import { DocumentsComponent } from './pages/documents';
import { ReportsComponent } from './pages/reports';
import { UsersComponent } from './pages/users';
import { ProfileComponent } from './pages/profile';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'prospects', component: ProspectsComponent },
      { path: 'prospects/:id', component: ProspectDetailComponent },
      { path: 'partners', component: PartnersComponent },
      { path: 'partners/:id', component: PartnerDetailComponent },
      { path: 'conventions', component: ConventionsComponent },
      { path: 'conventions/:id', component: ConventionDetailComponent },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
