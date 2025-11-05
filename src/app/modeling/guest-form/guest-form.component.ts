import { LocalizationService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelDto } from '@apis/vms/dtos';
import { CreateFlightInfoDto, CreateGuestInfoDto } from '@apis/vms/dtos/guest-information';
import { GuestInfoService, HotelService } from '@apis/vms/services';

enum FlightType {
  Arrival = 0,
  Departure = 1,
}

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.scss'
})
export class GuestFormComponent implements OnInit {
  @ViewChild('formTop') formTop!: ElementRef;
  isMobileMenuOpen = false;
  info: string;
  hotels: HotelDto[] = [];
  guestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private guestInfoService: GuestInfoService,
    private hotelService: HotelService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit(): void {
    this.localizationService.get('::LABEL_GuestInformation').subscribe(data => {
      this.info = data
    });
    this.loadHotels();
    this.guestForm = this.fb.group({
      fullName: ['', Validators.required],
      company: ['', Validators.required],
      title: ['', Validators.required],
      purpose: ['', Validators.required],
      workWithWhomInMolex: ['', Validators.required],

      flightInfos: this.fb.array([
        this.createFlightGroup(FlightType.Arrival),
        this.createFlightGroup(FlightType.Departure)
      ]),

      isHotelSupport: [null, Validators.required],
      hotelId: [''],
      hotelName: [''],
      roomType: [''],

      isFoodRestrict: [null, Validators.required],
      foodRestrictDetail: [''],

      otherRequest: [''],

      transportInfo: this.fb.group({
        isAirportTransport: [null, Validators.required],
        isDailyTransport: [null, Validators.required],
        time: [''],
        route: [''],
        address: [''],
      }),

      uniformInfo: this.fb.group({
        isVisitFactory: [null, Validators.required],
        cameraCover: [''],
        cardType: [''],
        uniformType: [''],
      }),
    });
  }

  loadHotels() {
    this.hotelService.getList({
      filter: '', sorting: '', skipCount: 0, maxResultCount: 100,
      ids: []
    }).subscribe({
      next: (result) => {
        this.hotels = result.items;
      }
    });
  }

  createFlightGroup(flightType: FlightType): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
      no: ['', Validators.required],
      route: ['', Validators.required],
      time: ['', Validators.required],
      flightType: [flightType, Validators.required],
    });
  }

  get flightInfos(): FormArray {
    return this.guestForm.get('flightInfos') as FormArray;
  }

  onSubmit() {
    if (this.guestForm.invalid) {
      this.guestForm.markAllAsTouched();
      return;
    }

    const formValue = this.guestForm.value;

    const flightInfos: CreateFlightInfoDto[] = formValue.flightInfos.map(flight => ({
      date: flight.date,
      no: flight.no,
      route: flight.route,
      time: flight.time,
      flightType: flight.flightType,
    }));

    const transportInfo = {
      isAirportTransport: formValue.transportInfo.isAirportTransport,
      isDailyTransport: formValue.transportInfo.isDailyTransport,
      time: formValue.transportInfo.time,
      route: formValue.transportInfo.route,
      address: formValue.transportInfo.address,
    };

    const uniformInfo = {
      isVisitFactory: formValue.uniformInfo.isVisitFactory,
      cardType: formValue.uniformInfo.cardType !== undefined ? Number(formValue.uniformInfo.cardType) : null,
      uniformType: formValue.uniformInfo.uniformType !== undefined ? Number(formValue.uniformInfo.uniformType) : null,
      cameraCover: formValue.uniformInfo.cameraCover !== undefined ? Number(formValue.uniformInfo.cameraCover) : null,
    };

    const createGuestDto: CreateGuestInfoDto = {
      fullName: formValue.fullName,
      company: formValue.company,
      title: formValue.title,
      purpose: formValue.purpose,
      workWithWhomInMolex: formValue.workWithWhomInMolex,
      isHotelSupport: formValue.isHotelSupport,
      hotelId: formValue.hotelId || null,
      hotelName: formValue.hotelName || null,
      roomType: formValue.roomType || null,
      isFoodRestrict: formValue.isFoodRestrict,
      foodRestrictDetail: formValue.foodRestrictDetail || null,
      otherRequest: formValue.otherRequest || null,
      flightInfos: flightInfos,
      transportInfo: transportInfo,
      uniformInfo: uniformInfo,
    };

    this.guestInfoService.create(createGuestDto).subscribe({
      next: (result) => {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, formValue.fullName],
        });
        this.guestForm.reset({
          fullName: '',
          company: '',
          title: '',
          purpose: '',
          workWithWhomInMolex: '',

          flightInfos: [
            {
              date: '',
              no: '',
              route: '',
              time: '',
              flightType: FlightType.Arrival
            },
            {
              date: '',
              no: '',
              route: '',
              time: '',
              flightType: FlightType.Departure
            }
          ],

          isHotelSupport: false,
          hotelId: '',
          hotelName: '',
          roomType: '',

          isFoodRestrict: false,
          foodRestrictDetail: '',

          otherRequest: '',

          transportInfo: {
            isAirportTransport: false,
            isDailyTransport: false,
            time: '',
            route: '',
            address: ''
          },

          uniformInfo: {
            isVisitFactory: false,
            cameraCover: '',
            cardType: '',
            uniformType: ''
          }
        });
        this.formTop.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
