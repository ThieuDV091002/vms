import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardDto } from '@apis/general/dtos/widget';
import { StandardService } from '@apis/general/services/widget';

@Component({
  selector: 'app-standard-alone',
  templateUrl: './standard-alone.component.html',
  styleUrl: './standard-alone.component.scss'
})
export class StandardAloneComponent implements OnInit{
  standard: StandardDto;

  constructor(private route: ActivatedRoute, private standardService: StandardService) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.getStandardData(id);
      }
    });
  }

  getStandardData(id: string) {
    this.standard = null;
    this.standardService.get(id).subscribe(res => {
      this.standard = res;
    });
  }
}
