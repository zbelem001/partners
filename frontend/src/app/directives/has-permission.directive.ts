import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { PermissionsService, Permission } from '../services/permissions.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Directive structurelle pour afficher conditionnellement du contenu selon les permissions
 * Usage: *appHasPermission="[Permission.CREATE_CONVENTION]"
 * Usage: *appHasPermission="[Permission.VIEW_PARTNERS]; requireAll: true"
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permissions: Permission[] = [];
  private requireAll = false;
  private authSubscription?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionsService: PermissionsService,
    private authService: AuthService
  ) {}

  @Input() set appHasPermission(permissions: Permission[]) {
    this.permissions = permissions;
    this.updateView();
  }

  @Input() set appHasPermissionRequireAll(requireAll: boolean) {
    this.requireAll = requireAll;
    this.updateView();
  }

  ngOnInit() {
    // S'abonner aux changements d'authentification pour mettre à jour la vue
    this.authSubscription = this.authService.currentUser$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  private updateView() {
    const hasPermission = this.requireAll
      ? this.permissionsService.hasAllPermissions(this.permissions)
      : this.permissionsService.hasAnyPermission(this.permissions);

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
