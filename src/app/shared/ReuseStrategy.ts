import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AppReuseStrategy implements RouteReuseStrategy {
  private static handlers: { [key: string]: DetachedRouteHandle } = {};
  private static routeConfig = new Map<string, boolean>();

  static configureRoute(path: string, shouldReuse: boolean) {
    this.routeConfig.set(path, shouldReuse);
  }

  static clearHandlers() {
    this.handlers = {};
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    const path = route.routeConfig?.path || '';
    const params = Object.keys(route.params).map(key => route.params[key]).join('_');
    return `${path}_${params}`;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path || '';
    return AppReuseStrategy.routeConfig.get(path) ?? false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      const key = this.getRouteKey(route);
      AppReuseStrategy.handlers[key] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getRouteKey(route);
    return !!AppReuseStrategy.handlers[key];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getRouteKey(route);
    return AppReuseStrategy.handlers[key] || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
