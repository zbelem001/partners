import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

/**
 * Directive structurelle pour afficher conditionnellement du contenu selon le rôle
 * Usage: *appHasRole="['Admin', 'Manager']"
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private roles: string[] = [];
  private authSubscription?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appHasRole(roles: string[]) {
    this.roles = roles;
    this.updateView();
  }

  ngOnInit() {
    this.authSubscription = this.authService.currentUser$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  private updateView() {
    const userRole = this.authService.getCurrentUserRole();
    const hasRole = userRole && this.roles.includes(userRole);

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
