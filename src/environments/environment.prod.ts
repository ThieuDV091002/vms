import { Environment } from '@abp/ng.core';

const baseUrl = 'ENV_BASE_URL';

export const environment = {
  production: true,
  version: "ENV_VERSION",
  buildTime: "",
  sourceVersion: "",
  application: {
    baseUrl,
    name: 'UFE',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'ENV_AUTHORITY_URL',
    redirectUri: baseUrl,
    clientId: 'vms_App',
    responseType: 'code',
    scope: 'offline_access UFE',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'ENV_API_URL',
      rootNamespace: 'Molex.UFE',
    },
    koch: {
      url: 'https://directory.int.kochid.com/',
      rootNamespace: 'Molex.UFE',
    },
    ticket: {
      url: 'ENV_TICKET_URL',
      rootNamespace: 'Molex.UFE',
    },
    corporate: {
      url: 'ENV_CORPORATE_URL',
      rootNamespace: 'Molex.UFE',
    },
    dashboard: {
      url: 'ENV_DASHBOARD_URL',
      rootNamespace: 'Molex.UFE',
    },
    notification: {
      url: 'ENV_NOTIFICATION_URL',
      rootNamespace: 'Molex.UFE',
    },
    general: {
      url: 'ENV_GENERAL_URL',
      rootNamespace: 'Molex.UFE',
    },
    scheduler: {
      url: 'ENV_SCHEDULER_URL',
      rootNamespace: 'Molex.UFE',
    },
    report: {
      url: 'ENV_REPORT_URL',
      rootNamespace: 'Molex.UFE',
    },
    vms: {
      url: 'ENV_vms_URL',
      rootNamespace: 'Molex.UFE',
    },
    powerbi: {
      url: 'https://app.powerbi.com',
      rootNamespace: 'Molex.UFE',
    }
  },
} as Environment;
