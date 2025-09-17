import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { ProductFamilyService, ProductSerieService, ProductService } from '@apis/general/production-review';
import { CreateUpdateProductDto, ProductDto, ProductFamilyDto, ProductGetListInput, ProductSerieDto } from '@apis/general/production-review/dtos';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'ProductsComponent',
    },
  ],
})
export class ProductsComponent
  extends ModelingBase<ProductService, ProductGetListInput, CreateUpdateProductDto>
  implements OnInit {
  selected: ProductDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<ProductDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  productFamilies: ProductFamilyDto[] = [];
  productSeries: ProductSerieDto[] = [];
  columns = [
    { displayKey: '::Name', field: 'name' },
    { displayKey: '::Description', field: 'description' },
    { displayKey: '::DisplayName', field: 'displayName' }
  ];
  info: string;
  constructor(
    public list: ListService<ProductGetListInput>,
    public service: ProductService,
    public productFamilyService: ProductFamilyService,
    public productSeriesService: ProductSerieService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'product');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_Product').subscribe(data => {
      this.info = data
    });

  }

  getProductFamilies() {
    this.productFamilyService.getAllInstances().subscribe(data => {
      this.productFamilies = data;
    });
  }

  getProductSeries() {
    this.productSeriesService.getAllInstances().subscribe(data => {
      this.productSeries = data
    })
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      description: [this.selected?.description || ''],
      displayName: [this.selected?.displayName || '', Validators.required],
      tenantId: [this.selected?.tenantId || ''],
      productFamilyId: [this.selected?.productFamilyId || ''],
      productFamilyName: [this.productFamilies.find(family => family.id === this.selected?.productFamilyId)?.name || ''],
      productSerieId: [this.selected?.productSerieId || ''],
      productSerieName: [this.selected?.productSerieName || ''],
    });
  }

  add() {
    if (this.productFamilies.length === 0 || this.productSeries.length === 0) {
      this.getProductFamilies();
      this.getProductSeries();
    }
    this.selected = {} as ProductDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const selectedFamily = this.productFamilies.find(family => family.id === this.form.value.productFamilyId);
    const selectedSerie = this.productSeries.find(serie => serie.id === this.form.value.productSerieId);
    const request = this.selected.id
      ? this.service.update(this.selected.id, {...this.form.value, productFamilyName: selectedFamily?.name || '', productSerieName: selectedSerie?.name || ''})
      : this.service.create({...this.form.value, productFamilyName: selectedFamily?.name || '', productSerieName: selectedSerie?.name || ''});
    request.subscribe(() => {
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  copyModalOpen(event: any) {
    if (this.productFamilies.length === 0 || this.productSeries.length === 0) {
      this.getProductFamilies();
      this.getProductSeries();
    }
  }

  copyProduct(e) {
    const info = this.removeLastS(e.objectType);
    const selectedFamily = this.productFamilies.find(family => family.id === e.data.productFamilyId);
    const selectedSerie = this.productSeries.find(serie => serie.id === e.data.productSerieId);
    this.service.create({...e.data, productFamilyName: selectedFamily?.name || '', productSerieName: selectedSerie?.name || ''}).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [info, res.name],
      });
      this.list.get();
      this.edit(res);
    });
  }

  edit(row) {
    if (this.productFamilies.length === 0 || this.productSeries.length === 0) {
      this.getProductFamilies();
      this.getProductSeries();
    }
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(row.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, row.name],
            });
            this.list.get();
          });
        }
      });
  }
}
