import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityCardService } from '@apis/ticket';
import { ActivityCardDto } from '@apis/ticket/dtos';

@Component({
  selector: 'app-card-page',
  templateUrl: './card-page.component.html',
  styleUrl: './card-page.component.scss'
})
export class CardPageComponent implements OnInit {
  card: ActivityCardDto;
  constructor(
    private router: ActivatedRoute,
    private activityCardService: ActivityCardService
  ) { }
  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.activityCardService.getActivityCardByCodeByCode(params['code']).subscribe(res => {
        this.card = res;
      });
    });
  }
}
