import { HttpClient } from '@angular/common/http';
import { Platform } from '@angular/cdk/platform';
export declare class AppConfigService {
    private http;
    private platform;
    settings: any;
    environment: any;
    constructor(http: HttpClient, platform: Platform);
    load(environment: any): Promise<void>;
    private loadConfig$;
    setSite(site: string): void;
    getSite(): string;
    setEnvironment(environment: string): void;
    getEnvironment(): string;
    getServerHostName(): string;
}
