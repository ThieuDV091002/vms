import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '@abp/ng.theme.shared';
import { LocalizationService } from '@abp/ng.core';
import { HotelDto } from '@apis/vms/dtos';
import { CreateFlightInfoDto, CreateGuestInfoDto } from '@apis/vms/dtos/guest-information';
import { GuestInfoService, HotelService } from '@apis/vms/services';

enum FlightType { 
  Arrival = 0, 
  Departure = 1 
}

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.scss',
})
export class GuestFormComponent implements OnInit {
  @ViewChild('formTop') formTop!: ElementRef;

  scrollToTop(): void {
    const topElement = this.formTop?.nativeElement;
    if (topElement) {
      topElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  isMobileMenuOpen = false;
  info: string;
  hotels: HotelDto[] = [];
  guestForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private guestInfoService: GuestInfoService,
    private hotelService: HotelService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.localizationService.get('vms::LABEL_GuestRegistration').subscribe(data => {
      this.info = data;
    });

    this.loadHotels();
    this.buildForm();
  }

  private buildForm() {
    this.guestForm = this.fb.group({
      fullName: ['', Validators.required],
      company: ['', Validators.required],
      title: ['', Validators.required],
      purpose: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      workWithWhomInMolex: ['', Validators.required],

      flightInfos: this.fb.array([
        this.createFlightGroup(FlightType.Arrival),
        this.createFlightGroup(FlightType.Departure),
      ]),

      isHotelSupport: [null, Validators.required],
      hotelId: [null],
      hotelName: [null],
      roomType: [null],

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
    this.guestForm.get('isHotelSupport')?.valueChanges.subscribe(isHotelSupport => {
      const flightArray = this.guestForm.get('flightInfos') as FormArray;
      if (isHotelSupport) {
        flightArray.clear();
        flightArray.push(this.createFlightGroup(FlightType.Arrival));
        flightArray.push(this.createFlightGroup(FlightType.Departure));
        this.markFlightInfosRequired();
      } else {
        this.clearFlightInfosValidators();
      }
    });
  }

  private markFlightInfosRequired() {
    const flightArray = this.flightInfos;
    flightArray.controls.forEach((control, index) => {
      const flightType = control.get('flightType')?.value;
      if (flightType === FlightType.Arrival || flightType === FlightType.Departure) {
        ['date', 'no', 'route', 'time'].forEach(field => {
          control.get(field)?.setValidators(Validators.required);
          control.get(field)?.updateValueAndValidity();
        });
      }
    });
  }

  private clearFlightInfosValidators() {
    const flightArray = this.flightInfos;
    flightArray.controls.forEach(control => {
      ['date', 'no', 'route', 'time'].forEach(field => {
        control.get(field)?.clearValidators();
        control.get(field)?.updateValueAndValidity();
      });
    });
  }

  private createFlightGroup(type: FlightType): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
      no: ['', Validators.required],
      route: ['', Validators.required],
      time: ['', Validators.required],
      flightType: [type, Validators.required],
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

    this.isSubmitting = true;

    const formValue = this.guestForm.value;

    const flightInfos: CreateFlightInfoDto[] = formValue.isHotelSupport ? formValue.flightInfos.map((f: any) => ({
      date: f.date,
      no: f.no,
      route: f.route,
      time: f.time,
      flightType: f.flightType,
    })) : [];

    const transportInfo = {
      isAirportTransport: formValue.transportInfo.isAirportTransport,
      isDailyTransport: formValue.transportInfo.isDailyTransport,
      time: formValue.transportInfo.time || null,
      route: formValue.transportInfo.route || null,
      address: formValue.transportInfo.address || null,
    };

    const uniformInfo = {
      isVisitFactory: formValue.uniformInfo.isVisitFactory,
      cardType:
        formValue.uniformInfo.cardType != null ? Number(formValue.uniformInfo.cardType) : null,
      uniformType:
        formValue.uniformInfo.uniformType != null
          ? Number(formValue.uniformInfo.uniformType)
          : null,
      cameraCover:
        formValue.uniformInfo.cameraCover != null
          ? Number(formValue.uniformInfo.cameraCover)
          : null,
    };

    const dto: CreateGuestInfoDto = {
      fullName: formValue.fullName,
      company: formValue.company,
      title: formValue.title,
      purpose: formValue.purpose,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      workWithWhomInMolex: formValue.workWithWhomInMolex,
      isHotelSupport: formValue.isHotelSupport,
      hotelId: formValue.hotelId || null,
      hotelName: formValue.hotelName || null,
      roomType: formValue.roomType || null,
      isFoodRestrict: formValue.isFoodRestrict,
      foodRestrictDetail: formValue.foodRestrictDetail || null,
      otherRequest: formValue.otherRequest || null,
      flightInfos,
      transportInfo,
      uniformInfo,
    };

    this.guestInfoService.create(dto).subscribe({
      next: () => {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, formValue.fullName],
        });
        this.resetForm();
        this.isSubmitting = false;
        this.scrollToTop();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  private resetForm() {
    this.guestForm.reset({
      fullName: '',
      company: '',
      title: '',
      purpose: '',
      startDate: '',
      endDate: '',
      workWithWhomInMolex: '',
      isHotelSupport: null,
      hotelId: null,
      hotelName: null,
      roomType: null,
      isFoodRestrict: null,
      foodRestrictDetail: '',
      otherRequest: '',
      transportInfo: {
        isAirportTransport: null,
        isDailyTransport: null,
        time: '',
        route: '',
        address: '',
      },
      uniformInfo: {
        isVisitFactory: null,
        cameraCover: '',
        cardType: '',
        uniformType: '',
      },
    });

    const flightArray = this.flightInfos;
    flightArray.clear();
    flightArray.push(this.createFlightGroup(FlightType.Arrival));
    flightArray.push(this.createFlightGroup(FlightType.Departure));
    this.clearFlightInfosValidators();
  }

  loadHotels() {
    this.hotelService
      .getList({ filter: '', sorting: '', skipCount: 0, maxResultCount: 100, ids: [] })
      .subscribe(res => (this.hotels = res.items));
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}