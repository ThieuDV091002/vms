import { Component } from '@angular/core';
import {HeroComponent} from "../../shared/components/home/hero.component";
import {FeaturesComponent} from "../../shared/components/home/features.component";
import {FooterComponent} from "../../shared/components/home/footer.component";
import {GuestRegisterComponent} from "../../shared/components/home/guest-register.component";
import {ContractorRegisterComponent} from "../../shared/components/home/contractor-register.component";

@Component({
    selector: 'app-ecommerce',
    imports: [
        HeroComponent,
        FeaturesComponent,
        FooterComponent,
        GuestRegisterComponent,
        ContractorRegisterComponent
    ],
    templateUrl: './home.html',
})
export class HomeComponent {}
