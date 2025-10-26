import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import {FoodListComponent} from "../../../shared/components/travel-guide/food/food-list";

@Component({
    selector: 'app-food',
    imports: [
        ComponentCardComponent,
        PageBreadcrumbComponent,
        FoodListComponent
    ],
    templateUrl: './food.component.html',
    styles: ``
})
export class FoodsComponent {

}
