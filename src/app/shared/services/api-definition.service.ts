import { Injectable } from '@angular/core';
import { RestService, Rest } from '@abp/ng.core';
import { ApiDefinition, ApiNames } from '../interfaces/api-definition';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControllerActionDto } from '../models/controller-action.model';

@Injectable({
  providedIn: 'root',
})

export class ApiDefinitionService {
  constructor(private restService: RestService) { }

    /**
   * Retrieves the controller actions for a given API name.
   * @param apiName The name of the API.
   * @param config Optional configuration for the REST request.
   * @param filterAppModule Optional flag to filter only 'app' modules. Default is false.
   * @returns An observable of an array of ControllerActionDto.
   */
  getControllerAction(apiName: ApiNames, config?: Partial<Rest.Config>, filterAppModule: boolean = false): Observable<ControllerActionDto[]> {
    return this.getApiDefinition(apiName, config).pipe(
      map(apiDefinition => this.extractControllerActions(apiDefinition, filterAppModule))
    );
  }

  /**
   * Retrieves the API definition for a given API name.
   * @param apiName The name of the API.
   * @param config Optional configuration for the REST request.
   * @returns An observable of ApiDefinition.
   */
  getApiDefinition(apiName: ApiNames, config?: Partial<Rest.Config>): Observable<ApiDefinition> {
    return this.restService.request<any, ApiDefinition>({
      method: 'GET',
      url: '/api/abp/api-definition?IncludeTypes=false',
    }, { apiName, ...config });
  }

  private extractControllerActions(apiDefinition: ApiDefinition, filterAppModule: boolean = false): ControllerActionDto[] {
    const result: ControllerActionDto[] = [];

    for (const moduleName in apiDefinition.modules) {
      if (filterAppModule && moduleName !== 'app') {
        continue;
      }
      const module = apiDefinition.modules[moduleName];
      for (const controllerName in module.controllers) {
        const controller = module.controllers[controllerName];
        for (const actionName in controller.actions) {
          const action = controller.actions[actionName];
          result.push({
            Object: controller.controllerName,
            Action: action.httpMethod,
            API: action.url,
          });
        }
      }
    }

    return result;
  }
}
