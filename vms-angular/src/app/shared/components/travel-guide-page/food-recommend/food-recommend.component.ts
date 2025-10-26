import { Component } from '@angular/core';

@Component({
    selector: 'app-food-recommend',
    templateUrl: './food-recommend.component.html',
    styles: ''
})
export class FoodRecommendComponent {
    images = [
        {
            src: 'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop',
            title: 'Pho bo (Beef Noodle Soup) - Must Try',
            link: 'https://unsplash.com/photos/1719368472026'
        },
        {
            src: 'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop',
            title: 'Cha Ca Hang Son (Grilled Fish with Dill and Turmeric)',
            link: 'https://unsplash.com/photos/1649265825072'
        },
        {
            src: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop',
            title: 'Project Three',
            link: 'https://unsplash.com/photos/1555212697'
        },
        {
            src: 'https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop',
            title: 'Project Four',
            link: 'https://unsplash.com/photos/1729086046027'
        },
        {
            src: 'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop',
            title: 'Project Five',
            link: 'https://unsplash.com/photos/1601568494843'
        }
    ];

    openLink(url: string) {
        window.open(url, '_blank');
    }
}
