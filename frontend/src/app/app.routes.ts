import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public-module').then(m => m.PublicModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'workspace',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['User', 'Manager', 'SRECIP', 'DFC', 'CAQ', 'Direction', 'DG'] },
    loadChildren: () => import('./workspace/workspace-module').then(m => m.WorkspaceModule)
  }
];
