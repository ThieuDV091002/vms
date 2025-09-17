export interface ApiDefinition {
  modules: {
    [moduleName: string]: {
      controllers: {
        [controllerName: string]: {
          controllerName: string;
          actions: {
            [actionName: string]: {
              httpMethod: string;
              url: string;
            };
          };
        };
      };
    };
  };
}

export enum ApiNames {
  Permission = 'default',
  Corporate = 'corporate',
  Dashboard = 'dashboard',
  General = 'general',
  Ticket = 'ticket',
  Notification = 'notification',
  Scheduler = 'scheduler'
}
