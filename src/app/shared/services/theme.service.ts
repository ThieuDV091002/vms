import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    isDarkTheme(): boolean {
        return document.body.classList.contains('lpx-theme-dark');
    }

    listenToThemeChanges(applyTheme: () => void): void {
        const observer = new MutationObserver(() => {
            if (applyTheme) {
                applyTheme();
            }
        });
        
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });

        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (localStorage.getItem('theme') === 'system') {
                this.setSystemTheme();
                if (applyTheme) {
                    applyTheme();
                }
            }
        });
    }

    constructor() {}

    setTheme(theme: string): void {
        const body = document.body;
        
        body.classList.remove('lpx-theme-light', 'lpx-theme-semi-dark', 'lpx-theme-dark');
        
        switch(theme) {
            case 'light':
                body.classList.add('lpx-theme-light');
                break;
            case 'semi-dark':
                body.classList.add('lpx-theme-semi-dark');
                break;
            case 'dark':
                body.classList.add('lpx-theme-dark');
                break;
            case 'system':
                this.setSystemTheme();
                return; 
        }
        localStorage.setItem('theme', theme);
    }

    setContainerType(type: string): void {
        const body = document.body;
        body.classList.remove('lpx-layout-boxed', 'lpx-layout-full-width', 'lpx-layout-fluid');
        
        switch(type) {
            case 'boxed':
                body.classList.add('lpx-layout-boxed');
                break;
            case 'full-width':
                body.classList.add('lpx-layout-full-width');
                break;
            case 'full':
                body.classList.add('lpx-layout-fluid');
                break;
        }
        localStorage.setItem('containerType', type);
    }

    private setSystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const body = document.body;
        body.classList.remove('lpx-theme-light', 'lpx-theme-semi-dark', 'lpx-theme-dark');
        
        if (prefersDark) {
            body.classList.add('lpx-theme-dark');
        } else {
            body.classList.add('lpx-theme-light');
        }
        localStorage.setItem('theme', 'system');
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'system';
        const savedContainerType = localStorage.getItem('containerType') || 'fluid';
        
        this.setTheme(savedTheme);
        this.setContainerType(savedContainerType);

        // Listen for system theme changes if using system theme
        if (savedTheme === 'system') {
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', (e) => {
                    if (localStorage.getItem('theme') === 'system') {
                        this.setSystemTheme();
                    }
                });
        }
    }
}
