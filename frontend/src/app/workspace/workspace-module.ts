import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS
import { WorkspaceLayoutComponent } from './components/layout/workspace-layout';
import { WorkspaceDashboardComponent } from './pages/dashboard/dashboard';
import { WorkspacePartnersComponent } from './pages/partners/partners';
import { WorkspacePartnerDetailComponent } from './pages/partners/partner-detail';
import { WorkspaceConventionsComponent } from './pages/conventions/conventions';
import { WorkspaceConventionDetailComponent } from './pages/conventions/convention-detail';
import { ConventionFormComponent } from './pages/conventions/convention-form';
import { MyConventionsComponent } from './pages/my-conventions/my-conventions';
import { MyTasksComponent } from './pages/tasks/tasks';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: WorkspaceDashboardComponent },
      { path: 'my-conventions', component: MyConventionsComponent },
      { path: 'partners', component: WorkspacePartnersComponent },
      { path: 'partners/:id', component: WorkspacePartnerDetailComponent },
      { path: 'conventions', component: WorkspaceConventionsComponent },
      { 
        path: 'conventions/create', 
        component: ConventionFormComponent,
        canActivate: [() => {
          // TODO: Add permissionGuard for CREATE_CONVENTION
          return true;
        }]
      },
      { 
        path: 'conventions/:id/edit', 
        component: ConventionFormComponent,
        canActivate: [() => {
          // TODO: Add permissionGuard for UPDATE_MY_CONVENTIONS
          return true;
        }]
      },
      { path: 'conventions/:id', component: WorkspaceConventionDetailComponent },
      { path: 'tasks', component: MyTasksComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WorkspaceLayoutComponent,
    WorkspaceDashboardComponent,
    WorkspacePartnersComponent,
    WorkspacePartnerDetailComponent,
    WorkspaceConventionsComponent,
    WorkspaceConventionDetailComponent,
    ConventionFormComponent,
    MyConventionsComponent,
    MyTasksComponent
  ],
  exports: [RouterModule]
})
export class WorkspaceModule { }
