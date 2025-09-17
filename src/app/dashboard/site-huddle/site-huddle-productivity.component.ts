import { ChartComponent } from "@abp/ng.components/chart.js";
import { ConfigStateService, PermissionService } from "@abp/ng.core";
import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { SiteHuddleWithSnowflakeService } from "@apis/general";
import { SiteHuddleCardStatisticsDto } from "@apis/ticket/dtos";
import { SiteHuddleService } from "@apis/ticket/services";
import { Subscription } from "rxjs";
import { ThemeService } from "src/app/shared/services/theme.service";
@Component({
    selector: 'app-site-huddle-productivity',
    template: `
        <div class="productivity-container">
            <div class="workcenter-chart d-flex flex-wrap" [class.d-none]="expandIndex !== -1">
                @for (selectedWorkCenter of selectedWorkCenters; track i; let i = $index) {
                    <div class="chart-container widget-page" [ngClass]="{'widget-fullscreen': expandWCPOEEChartArr[i]}">
                        <div [class.d-none]="!selectedWorkCenter?.id" class="h-100">
                            <div class="widget-toolbar chart-toolbar">
                                <span class="expand-chart" (click)="expand('WCPOEEChart', i)">
                                     @if (expandWCPOEEChartArr[i]) {
                                     <i class="fa fa-compress fa-lg"></i>
                                     } @else {
                                     <i class="fa fa-expand fa-lg"></i>
                                     }
                                </span>
                                <span class="remove-chart" (click)="removeWorkcenter(i)">
                                    <i class="fa-solid fa-x fa-lg"></i>
                                </span>
                            </div>
                            <abp-chart
                                #WCPOEEChart
                                [data]="chartData[i]"
                                [options]="chartOptions[i]"
                                width="100%"
                                height="100%"
                                [type]="'bar'">
                            </abp-chart>
                        </div>
                        <div [class.d-none]="selectedWorkCenter?.id" class="d-flex flex-column justify-content-center align-items-center h-100">
                            <h4>{{'::LABEL_WorkCenter' | abpLocalization}}</h4>
                            <div class="d-flex">
                                <ng-select
                                    [items]="workCenters"
                                    bindLabel="name"
                                    bindValue="id"
                                    [multiple]="false"
                                    [appendTo]="'body'"
                                    (change)="selectedWorkCenterChange($event, i)"
                                    [placeholder]="'::LABEL_WorkCenterSearch' | abpLocalization">
                                </ng-select>
                                <!-- <span class="add-work-center align-self-center ms-2 cursor-pointer"><i class="fa fa-plus"></i></span> -->
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div class="report-chart d-flex flex-column" [class.w-100]="expandIndex !== -1">
                <div class="report-chart-container position-relative widget-page" [class.d-none]="expandIndex !== -1" [ngClass]="{'widget-fullscreen': expandSitePOEEChart}">
                    <div class="widget-toolbar chart-toolbar">
                        <span class="expand-chart" (click)="expand('sitePOEEChart')">
                             @if (expandSitePOEEChart) {
                             <i class="fa fa-compress fa-lg"></i>
                             } @else {
                             <i class="fa fa-expand fa-lg"></i>
                             }
                        </span>
                    </div>
                    <abp-chart
                        #sitePOEEChart
                        [data]="sitePOEEChartData"
                        [options]="sitePOEEChartOptions"
                        width="100%"
                        height="100%"
                        [type]="'bar'">
                    </abp-chart>
                </div>
                <div class="report-chart-container" [class.d-none]="expandIndex === 2">
                    <div class="add-widget mb-1" *ngIf="!findWidgetBySeq(1)">
                        <a *ngIf="!queryId" href="javascript:void(0)" (click)="addWidgetChange.emit(1)">{{'::LABEL_AddWidget' |
                            abpLocalization}}</a>
                    </div>
                    <ng-container *ngIf="findWidgetBySeq(1)">
                        <app-widget-container [widget]="findWidgetBySeq(1)" [index]="1"
                            [queryId]="!enableEdit"
                            [homePage]="homepage" [haveAccessTreeNode]="haveAccessTreeNode"
                            [selectedDataTier]="selectedDataTier" [assignedAndDefaultDataTiers]="assignedAndDefaultDataTiers"
                            (widgetUpdate)="widgetUpdate.emit($event)" (expandChange)="expandChange($event)">
                        </app-widget-container>
                    </ng-container>
                </div>
                <div class="report-chart-container" [class.d-none]="expandIndex === 1">
                    <div class="add-widget mb-1" *ngIf="!findWidgetBySeq(2)">
                        <a *ngIf="!queryId" href="javascript:void(0)" (click)="addWidgetChange.emit(2)">{{'::LABEL_AddWidget' |
                            abpLocalization}}</a>
                    </div>
                    <ng-container *ngIf="findWidgetBySeq(2)">
                        <app-widget-container [widget]="findWidgetBySeq(2)" [index]="2"
                            [queryId]="!enableEdit"
                            [homePage]="homepage" [haveAccessTreeNode]="haveAccessTreeNode"
                            [selectedDataTier]="selectedDataTier" [assignedAndDefaultDataTiers]="assignedAndDefaultDataTiers"
                            (widgetUpdate)="widgetUpdate.emit($event)" (expandChange)="expandChange($event)">
                        </app-widget-container>
                    </ng-container>
                </div>
            </div>
        </div>
        <div class="productivity-footer">
            <div class="productivity-footer-header">
                {{'::LABEL_ProductivityActionCards' | abpLocalization}}
            </div>
            <div class="productivity-footer-content d-flex">
                <div class="flex-fill">
                    {{'::LABEL_NoUpdateGreaterThanTenDays' | abpLocalization}} <br/>
                    <span>{{actionCardsData?.noUpdate10Days}}</span>
                </div>
                <div class="flex-fill">
                    {{'::LABEL_OpenGreaterThan21Days' | abpLocalization}} <br/>
                    <span>{{actionCardsData?.open21Days}}</span>
                </div>
                <div class="flex-fill">
                    {{'::LABEL_NoTaskOwner' | abpLocalization}} <br/>
                    <span>{{actionCardsData?.noTaskOwner}}</span>
                </div>
                <div class="flex-fill">
                    {{'::LABEL_TaskPastDue' | abpLocalization}} <br/>
                    <span>{{actionCardsData?.taskPastDue}}</span>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            height: 100%;
        }
        ng-select {
            min-width: 150px;
        }
        .add-widget {
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
            border: 1px solid var( --lpx-widget-border-color);
        }

        .productivity-container {
            height: calc(100% - 100px);
            &::after {
                content: '';
                display: table;
                clear: both;
            }
            .workcenter-chart {
                width: 60%;
                float: left;
                height: 100%;
                padding: 5px;
                .chart-container {
                    width: 50%;
                    height: 50%;
                    border: 1px solid var( --lpx-widget-border-color);
                    position: relative;
                    // .remove-chart {
                    //     position: absolute;
                    //     top: 0;
                    //     right: 5px;
                    //     cursor: pointer;
                    //     font-size: 1.5rem;
                    //     line-height: 1;
                    //     opacity: .8;
                    //     z-index: 999;
                    //     &:hover {
                    //         opacity: 1;
                    //     }
                    // }
                    .chart-toolbar {
                        position: absolute;
                        top: 0;
                        right: 5px;
                        z-index: 999;
                        .expand-chart {
                            cursor: pointer;
                            margin-right: 8px
                        }
                        .remove-chart {
                            cursor: pointer;
                        }
                    }
                }
            }
            .report-chart {
                width: 40%;
                padding: 5px;
                float: left;
                height: 100%;
                .report-chart-container {
                    border: 1px solid var( --lpx-widget-border-color);
                    height: 30%;
                    flex: 1;
                    .chart-toolbar {
                        position: absolute;
                        top: 0;
                        right: 5px;
                        z-index: 999;
                        .expand-chart {
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .productivity-footer {
            height: 100px;
            margin-top: 5px;
            .productivity-footer-header {
                height: 35px;
                background-color: #edaa00;
                color: #ffffff;
                text-align: center;
                font-weight: 500;
                font-size: 1.2rem;
                line-height: 35px;
            }
            .productivity-footer-content {
                height: 65px;
                > div {
                    text-align: center;
                    border-left: 1px solid var( --lpx-widget-border-color);
                    border-bottom: 1px solid var( --lpx-widget-border-color);
                    span {
                        display: inline-block;
                        margin-top: 5px;
                        width: 60px;
                        height: 30px;
                        line-height: 30px;
                        background-color: #fff1cf;
                        border-radius: 10px;
                        font-weight: bold;
                        color: #000000;
                    }
                }
            }
        }
    `],
    providers: [DecimalPipe]
})
export class SiteHuddleProductivityComponent {
    @ViewChildren('WCPOEEChart') WCPOEECharts: QueryList<ChartComponent>;
    @ViewChild('sitePOEEChart') sitePOEEChart: ChartComponent;
    @Input() queryId: string;
    @Input() site: any = {};
    @Input() selectedDataTier: any;
    @Input() assignedAndDefaultDataTiers: any;
    @Input() widgets: any[] = [];
    @Output() addWidgetChange = new EventEmitter<any>();
    @Output() widgetUpdate = new EventEmitter<any>();
    workCenters: any[] = [];
    cardType = 'Performance';
    localStorageKey = 'siteHuddleProdWorkCenters_';
    actionCardsData: SiteHuddleCardStatisticsDto = {} as SiteHuddleCardStatisticsDto;
    subscription: Subscription;
    last30DaysArray: any[] = [];
    selectedWorkCenters: any[] = [];
    monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    startDate: string;
    endDate: string;
    expandIndex = -1;
    expandWCPOEEChartArr: boolean[] = [false, false, false, false];
    expandSitePOEEChart = false;
    options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                reverse: true,
                labels: {
                    color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529',
                }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {}

            },
            title: {
                display: true,
                text: 'POEE%',
                color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529',
            },
            datalabels: {
                display: false
            }
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                maxBarThickness: 20,
                grid: {
                    display: false
                },
                ticks: {
                    color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168',
                }
            }
        }
    };
    chartOptions: any[] = [{}, {}, {}, {}];
    chartData = [
        {
            labels: [],
            datasets: [
                { type: 'bar', label: '', data: Array(30).fill(0), order: 2, backgroundColor: '#0a587c'},
                { type: 'line', label: 'Target', pointRadius: 0, data: Array(30).fill(0), order: 1, backgroundColor: '#0099d8', borderColor: '#0099d8' }
            ]
        },
        {
            labels: [],
            datasets: [
                { type: 'bar', label: '', data: Array(30).fill(0), order: 2, backgroundColor: '#0a587c'},
                { type: 'line', label: 'Target', pointRadius: 0, data: Array(30).fill(0), order: 1, backgroundColor: '#0099d8', borderColor: '#0099d8' }
            ]
        },
        {
            labels: [],
            datasets: [
                { type: 'bar', label: '', data: Array(30).fill(0), order: 2, backgroundColor: '#0a587c'},
                { type: 'line', label: 'Target', pointRadius: 0, data: Array(30).fill(0), order: 1, backgroundColor: '#0099d8', borderColor: '#0099d8' }
            ]
        },
        {
            labels: [],
            datasets: [
                { type: 'bar', label: '', data: Array(30).fill(0), order: 2, backgroundColor: '#0a587c'},
                { type: 'line', label: 'Target', pointRadius: 0, data: Array(30).fill(0), order: 1, backgroundColor: '#0099d8', borderColor: '#0099d8' }
            ]
        },
    ];
    sitePOEEChartOptions;
    sitePOEEChartData = {
        labels: [],
        datasets: [
            {
                type: 'bar',
                label: 'POEE%',
                data: Array(30).fill(0),
                order: 2,
                backgroundColor: '#0a587c'
            },
            {
                type: 'line',
                label: 'Target',
                data: Array(30).fill(0),
                order: 1,
                pointRadius: 0,
                backgroundColor: '#0099d8',
                borderColor: '#0099d8'
            }
        ]
    };
    currentTenant: any;
    enableEdit = false;

    constructor(
        private siteHuddleService: SiteHuddleService,
        private siteHuddleWithSnowflakeService: SiteHuddleWithSnowflakeService,
        private configService: ConfigStateService,
        private themeService: ThemeService,
        private decimalPipe: DecimalPipe,
        private permissionService: PermissionService,
        private datePipe: DatePipe
    ) {
        this.enableEdit = this.permissionService.getGrantedPolicy('Dashboard.Update');
        for (let i=0; i<this.chartOptions.length; i++) {
            this.chartOptions[i] = JSON.parse(JSON.stringify(this.options));
            this.chartOptions[i].plugins.tooltip.callbacks.label = (tooltipItem) => {
                    return tooltipItem.dataset.label + ': ' + this.decimalPipe.transform(tooltipItem.raw, '1.0-1') + '%';
                }
            }

        this.sitePOEEChartOptions = JSON.parse(JSON.stringify(this.options));
        this.sitePOEEChartOptions.plugins.tooltip.callbacks.label = (tooltipItem) => {
            return tooltipItem.dataset.label + ': ' + this.decimalPipe.transform(tooltipItem.raw, '1.0-1') + '%';
        }
        this.calculateDate();
        this.configService.getOne$('currentTenant').subscribe((tenant) => {
            this.currentTenant = tenant;
        })
    }

    ngOnInit(): void {
        this.themeService.listenToThemeChanges(this.applyTheme);
        this.getActionCardsData();
        const storedWorkcenters = JSON.parse(localStorage.getItem(this.localStorageKey+this.currentTenant?.id)) || [];
        // fill storedWorkcenters with empty objects if less than 4
        for (let i = storedWorkcenters.length; i < 4; i++) {
            storedWorkcenters.push({});
        }
        this.selectedWorkCenters = storedWorkcenters;
        this.getPOEEDataBySite();
    }

    ngAfterViewInit(): void {
        for (let i = 0; i < this.selectedWorkCenters.length; i++) {
            if (this.selectedWorkCenters[i]?.id) {
                this.chartData[i].datasets[0].label = this.selectedWorkCenters[i].name;
                this.chartOptions[i].plugins.title.text = 'POEE% - ' + this.selectedWorkCenters[i].name;
                this.getPOEEDataByWC(this.selectedWorkCenters[i].id, this.chartOptions[i], this.chartData[i], this.WCPOEECharts.toArray()[i]);
            }
        }

    }

    expandChange(event: any) {
        this.expandIndex = event;
    }

    applyTheme = () => {
        const isDarkTheme = this.themeService.isDarkTheme();
        const dataColor = isDarkTheme ? '#f5f5f5' : '#212529';
        const tickColor = isDarkTheme ? '#9ca5b4' : '#325168';

        const updateChartOptions = (chartOptions) => {
          chartOptions.plugins.title.color = dataColor;
          chartOptions.plugins.legend.labels.color = dataColor;
          chartOptions.scales.x.ticks.color = tickColor;
          chartOptions.scales.y.ticks.color = tickColor;
        };

        for (let i=0; i<this.chartOptions.length; i++) {
            if (this.chartOptions[i]) {
                updateChartOptions(this.chartOptions[i]);
                if (this.WCPOEECharts && this.WCPOEECharts.toArray()[i]) {
                    this.WCPOEECharts.toArray()[i].refresh();
                }
            }
        }
        updateChartOptions(this.sitePOEEChartOptions);
        if (this.sitePOEEChart) {
            this.sitePOEEChart.refresh();
        }
    };

    getPOEEDataByWC(workCenterId: string, chartOptions: any, POEEChartData: any, chart: ChartComponent) {
        POEEChartData.datasets[0].data = Array(30).fill(0);
        POEEChartData.datasets[1].data= Array(30).fill(0);
        this.siteHuddleWithSnowflakeService.getPOEEDailyByWorkCenterByInput({
            workCenterId: workCenterId,
            startDate: this.startDate,
            endDate: this.endDate
        }).subscribe((res) => {
            const maxPOEE = Math.max(...res.map(item => item.dailyPOEE*100), 0);
            const maxTarget = Math.max(...res.map(item => item.target), 0);
            if (maxPOEE < 100 && maxTarget < 100) {
                chartOptions.scales.y.max = 100;
            } else {
                delete chartOptions.scales.y.max;
            }
            res.forEach(item => {
                const index = this.last30DaysArray.findIndex((dateObj) => dateObj.date.split('T')[0] === item.date.split('T')[0]);
                POEEChartData.datasets[0].data[index] = item.dailyPOEE*100;
                POEEChartData.datasets[1].data[index] = item.target;
            });
            chart.refresh();
        });
    }

    getPOEEDataBySite() {
        this.siteHuddleWithSnowflakeService.getPOEEDailyBySiteByInput({
            siteId: this.site?.id,
            startDate: this.startDate,
            endDate: this.endDate
        }).subscribe((res) => {
            const maxPOEE = Math.max(...res.map(item => item.dailyPOEE*100), 0);
            const maxTarget = Math.max(...res.map(item => item.target), 0);
            if (maxPOEE < 100 && maxTarget < 100) {
                this.sitePOEEChartOptions.scales.y.max = 100;
            } else {
                delete this.sitePOEEChartOptions.scales.y.max;
            }
            res.forEach(item => {
                const index = this.last30DaysArray.findIndex((dateObj) => dateObj.date.split('T')[0] === item.date.split('T')[0]);
                this.sitePOEEChartOptions.plugins.title.text = 'POEE%' + ' - ' + this.site?.name;
                this.sitePOEEChartData.datasets[0].data[index] = item.dailyPOEE*100;
                this.sitePOEEChartData.datasets[1].data[index] = item.target;
            });
            this.sitePOEEChart.refresh();
        });
    }

    ngOnChanges(): void {
        this.getActionCardsData();
        if (this.selectedDataTier?.areas && this.selectedDataTier?.areas.length) {
            this.workCenters = this.assignedAndDefaultDataTiers?.assignedDataTiers
                .filter(d => d.areaId && d.dataTierType === 'WorkCenter' && this.selectedDataTier?.areas.some(a => a.id === d.areaId))
                .map(d => ({ id: d.workCenterId, name: d.workCenterName }))
                .sort((a, b) => a.name?.localeCompare(b.name));
        } else {
            this.workCenters = this.assignedAndDefaultDataTiers?.assignedDataTiers
                .filter(d => d.dataTierType === 'WorkCenter')
                .map(d => ({ id: d.workCenterId, name: d.workCenterName }))
                .sort((a, b) => a.name?.localeCompare(b.name));
        }
        // console.log(this.workCenters);
    }

    selectedWorkCenterChange(event: any, index: number) {
        this.selectedWorkCenters[index] = event;
        // save in localstorage
        localStorage.setItem(this.localStorageKey+this.currentTenant?.id, JSON.stringify(this.selectedWorkCenters.filter((item) => item.id)));
        // request data from API
        this.chartData[index].datasets[0].label = event.name;
        this.chartOptions[index].plugins.title.text = 'POEE% - ' + event.name;
        this.getPOEEDataByWC(event.id, this.chartOptions[index], this.chartData[index], this.WCPOEECharts.toArray()[index]);
    }

    removeWorkcenter(index: number) {
        this.selectedWorkCenters[index] = {};
        // remove from localstorage
        localStorage.setItem(this.localStorageKey+this.currentTenant?.id, JSON.stringify(this.selectedWorkCenters.filter((item) => item.id)));
        this.chartOptions[index].plugins.title.text = 'POEE%';
        this.chartData[index].datasets = [
            { type: 'bar', label: '', data: Array(30).fill(0), order: 2, backgroundColor: '#0a587c'},
            { type: 'line', label: 'Target', pointRadius: 0, data: Array(30).fill(0), order: 1, backgroundColor: '#0099d8', borderColor: '#0099d8' }
        ];
    }

    calculateDate() {
        let date = new Date();
        this.startDate = new Date(new Date(date.setDate(date.getDate() - 30)).setHours(0,0,0,0)).toLocalISOString();
        date = new Date();
        this.endDate = new Date(date.setHours(0, 0, 0, 0)).toLocalISOString();
        // based on startDate and endDate, generate last30DaysArray ['23-Mar', '24-Mar', '25-Mar', ...]
        for (let i = 30; i > 0; i--) {
            date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            this.last30DaysArray.push({
                date: date.toLocalISOString(),
                displayName: date.getDate() + '-' + this.monthShortNames[date.getMonth()],
            });
        }
        const dateDisplayNames = this.last30DaysArray.map((item) => this.datePipe.transform(item.displayName, 'dd MMM'));
        for (const WCchartData of this.chartData) {
            WCchartData.labels = dateDisplayNames;
        }
        this.sitePOEEChartData.labels = dateDisplayNames;
    }

    getActionCardsData() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
         this.subscription = this.siteHuddleService.getActivityCardInfoByKPIIndicatorByInput({
            siteId: this.site?.id,
            areaIds: this.selectedDataTier?.areas?.map((area) => area.id),
            cellIds: this.selectedDataTier?.cells?.map((cell) => cell.id),
            siteKPIIndicator: this.cardType,
        }).subscribe((res) => {
            this.actionCardsData = res;
        })
    }

    findWidgetBySeq(seq: number) {
        return this.widgets.find(widget => widget.seq === seq);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    expand(type: string, index?: number) {
        if (type === 'WCPOEEChart' && index !== undefined) {
            this.expandWCPOEEChartArr[index] = !this.expandWCPOEEChartArr[index];
        }

        if (type === 'sitePOEEChart') {
            this.expandSitePOEEChart = !this.expandSitePOEEChart;
        }
    }
}
