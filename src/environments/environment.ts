import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  version: 'DEV (1.0.0)',
  buildTime: '2024-10-18T14:32:12+08:00',
  sourceVersion: '1.0.0',
  application: {
    baseUrl,
    name: 'UFE',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://dev.ufe.molex.com/',
    redirectUri: baseUrl,
    clientId: 'VMS_App',
    responseType: 'code',
    scope: 'offline_access UFE',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://dev.ufe.molex.com/permission',
      rootNamespace: 'Molex.UFE',
    },
    koch: {
      url: 'https://directory.int.kochid.com/',
      rootNamespace: 'Molex.UFE',
    },
    ticket: {
      url: 'https://dev.ufe.molex.com/ticket',
      rootNamespace: 'Molex.UFE',
    },
    corporate: {
      url: 'https://dev.ufe.molex.com/corporate',
      rootNamespace: 'Molex.UFE',
    },
    dashboard: {
      url: 'https://dev.ufe.molex.com/dashboard',
      rootNamespace: 'Molex.UFE',
    },
    notification: {
      url: 'https://dev.ufe.molex.com/notification',
      rootNamespace: 'Molex.UFE',
    },
    general: {
      url: 'https://dev.ufe.molex.com/general',
      rootNamespace: 'Molex.UFE',
    },
    scheduler: {
      url: 'https://dev.ufe.molex.com/scheduler',
      rootNamespace: 'Molex.UFE',
    },
    report: {
      url: 'https://dev.ufe.molex.com/report',
      rootNamespace: 'Molex.UFE',
    },
    vms: {
      url: 'https://dev.vms.molex.com/vms',
      rootNamespace: 'Molex.UFE',
    },
    powerbi: {
      url: 'https://app.powerbi.com',
      rootNamespace: 'Molex.UFE',
    },

  },
  powerbi: {
    default: {
      url: 'https://dev.ufe.molex.com:31651',
      rootNamespace: 'Molex.UFE',
    },
  }
} as Environment;
