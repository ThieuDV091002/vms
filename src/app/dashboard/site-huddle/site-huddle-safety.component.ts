import { ChartComponent } from "@abp/ng.components/chart.js";
import { LocalizationService } from "@abp/ng.core";
import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { AreaHuddleWithSnowflakeService, SiteHuddleWithSnowflakeService } from "@apis/general";
import { SafetyIncidentDto } from "@apis/general/dtos/area-huddle";
import { SafetyIncidentDailyDto } from "@apis/general/dtos/site-huddle";
import { NearMissesDailyDto, SiteHuddleCardStatisticsDto } from "@apis/ticket/dtos";
import { SiteHuddleService } from "@apis/ticket/services";
import { Subscription } from "rxjs";
import { ThemeService } from "src/app/shared/services/theme.service";

@Component({
    selector: 'app-site-huddle-safety',
    template: `
        <div class="safety-container">
            <div class="safety-content d-flex flex-column p-2">
                <div class="safety-tile">
                    <div class="d-flex align-items-center">
                        <span class="safety-icon"><i class="fa fa-calendar"></i></span>
                        @if (safetyInfo?.noOfDaysSinceLastIncidents === -1) {
                            <span class="safety-no-incident">{{'::LABEL_NoIncident' | abpLocalization}}</span>
                        } @else {
                            <span class="safety-num">{{safetyInfo?.noOfDaysSinceLastIncidents}}</span>
                        }
                    </div>
                    <div class="safety-tips">
                        {{'::LABEL_DaysSinceLastIncident' | abpLocalization}}
                    </div>
                </div>
                <div class="safety-tile">
                    <div class="d-flex align-items-center">
                        <span class="safety-icon"><i class="fas fa-person-falling-burst"></i></span>
                        <span class="safety-num" [class.not-meet-color]="safetyIncidentsData?.last24Hours > 0">{{safetyIncidentsData?.last24Hours}}</span>
                    </div>
                    <div class="safety-tips">
                        {{'::LABEL_SafetyIncidentsInLast24Hours' | abpLocalization}}
                    </div>
                </div>
                <div class="safety-tile">
                    <div class="d-flex align-items-center">
                        <span class="safety-icon"><i class="fas fa-triangle-exclamation"></i></span>
                        <span class="safety-num" [class.not-meet-color]="nearMissesData?.last24Hours > 0">{{nearMissesData?.last24Hours}}</span>
                    </div>
                    <div class="safety-tips">
                        {{'::LABEL_NearMissedInLast24Hours' | abpLocalization}}
                    </div>
                </div>
            </div>
            <div class="safety-details">
                <div class="safety-incident d-flex">
                    <div class="safety-incident-summary d-flex flex-column">
                        <div class="flex-fill d-flex flex-column justify-content-center">
                            <span class="d-block">{{'::LABEL_SafetyIncidents' | abpLocalization}}<br/>{{'::LABEL_MTDActual' | abpLocalization}}</span>
                            <span class="incident-data" [class.not-meet-color]="safetyIncidentsData?.mtdActual > safetyIncidentsData?.currentMonthTarget">{{safetyIncidentsData?.mtdActual}}</span>
                        </div>
                        <div class="flex-fill d-flex flex-column justify-content-center">
                            <span class="d-block">{{'::LABEL_SafetyIncidents' | abpLocalization}}<br/>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</span>
                            <span class="incident-data" [class.no-target]="safetyIncidentsData?.currentMonthTarget < 0">{{safetyIncidentsData?.currentMonthTarget < 0 ? ('::LABEL_NoTarget' | abpLocalization) : safetyIncidentsData?.currentMonthTarget}}</span>
                        </div>
                    </div>
                    <div class="safety-incident-chart" [ngClass]="{'widget-fullscreen': expandSafetyChart}">
                        <div class="position-relative h-100 widget-page">
                            <div class="position-absolute top-0 end-0 widget-toolbar" style="z-index: 99;">
                                 <span class="me-2 cursor-pointer" (click)="expand('safetyChart')">
                                     @if (expandSafetyChart) {
                                     <i class="fa fa-compress fa-lg"></i>
                                     } @else {
                                     <i class="fa fa-expand fa-lg"></i>
                                     }
                                </span>
                            </div>
                            <abp-chart
                                #safetyChart
                                [data]="safetyChartData"
                                [options]="safetyChartOptions"
                                width="100%"
                                height="100%"
                                [type]="'bar'">
                            </abp-chart>
                        </div>
                    </div>
                </div>
                <div class="safety-near-miss d-flex">
                    <div class="safety-near-miss-summary d-flex flex-column">
                        <div class="flex-fill d-flex flex-column justify-content-center">
                            <span class="d-block">{{'::LABEL_NearMisses' | abpLocalization}}<br/>{{'::LABEL_MTDActual' | abpLocalization}}</span>
                            <span class="incident-data" [class.not-meet-color]="nearMissesData?.mtdActual > nearMissTarget">{{nearMissesData?.mtdActual}}</span>
                        </div>
                        <div class="flex-fill d-flex flex-column justify-content-center">
                            <span class="d-block">{{'::LABEL_NearMisses' | abpLocalization}}<br/>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</span>
                            <span class="incident-data" [class.no-target]="nearMissTarget < 0">{{nearMissTarget < 0 ? ('::LABEL_NoTarget' | abpLocalization) : nearMissTarget}}</span>
                        </div>
                    </div>
                    <div class="safety-near-miss-chart" [ngClass]="{'widget-fullscreen': expandNearMissChart}">
                        <div class="position-relative h-100 widget-page">
                            <div class="position-absolute top-0 end-0 widget-toolbar" style="z-index: 99;">
                                 <span class="me-2 cursor-pointer" (click)="expand('nearMissChart')">
                                     @if (expandNearMissChart) {
                                     <i class="fa fa-compress fa-lg"></i>
                                     } @else {
                                     <i class="fa fa-expand fa-lg"></i>
                                     }
                                </span>
                            </div>
                            <abp-chart
                                #nearMissChart
                                [data]="nearMissChartData"
                                [options]="nearMissChartOptions"
                                width="100%"
                                height="100%"
                                [type]="'bar'">
                            </abp-chart>
                        </div>
                    </div>
                </div>
            </div>
            <div class="safety-alert">
                <app-broadcast-message-view
                    [selectedDataTier]="selectedDataTier"
                    [queryId]="queryId"
                    [assignedAndDefaultDataTiers]="assignedAndDefaultDataTiers"
                    (broadcastMsgListChange)="broadcastMsgListChange.emit()" [siteHuddleView]="true">
                </app-broadcast-message-view>
            </div>
        </div>
        <div class="safety-footer">
            <div class="safety-footer-header">
                {{'::LABEL_SafetyActionCards' | abpLocalization}}
            </div>
            <div class="safety-footer-content d-flex">
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
            .not-meet-color {
                color: #FF0000;
            }
            app-broadcast-message-view ::ng-deep {
                .fa.fa-trash, .fa.fa-expand {
                    display: none;
                }
            }
            .safety-no-incident {
                font-size: 1rem;
                line-height: 1rem;
                font-weight: bold;
                text-align: center;
                flex: 1 1 auto !important;
                color: #424242;
            }
            .safety-container {
                font-weight: 500;
                height: calc(100% - 100px);
                // use ::after to clear the floats
                &::after {
                    content: '';
                    display: table;
                    clear: both;
                }
                .safety-content {
                    float: left;
                    width: 200px;
                    height: 100%;
                    gap: 5px;
                    .safety-tile {
                        flex: auto;
                        background: #ffd1b6;
                        padding: 1rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        .safety-icon {
                            display: inline-block;
                            width: 3rem;
                            height: 3rem;
                            background-color: #ff7425;
                            border-radius: 50%;
                            color: #ffffff;
                            text-align: center;
                            font-size: 1.5rem;
                            line-height: 3rem;
                        }
                        .safety-num {
                            font-size: 2.5rem;
                            line-height: 2.5rem;
                            font-weight: bold;
                            text-align: center;
                            flex: 1 1 auto!important;
                            color: #424242;
                        }
                        .safety-tips {
                            margin-top: 10px;
                            color: #424242;
                        }
                    }
                }
                .safety-details {
                    float: left;
                    height: 100%;
                    width: calc(100% - 550px);
                    .incident-data {
                        display: block;
                        font-size: 2rem;
                        font-weight: bold;
                        margin-top: 10px;
                        &.no-target {
                            font-size: 1rem;
                        }
                    }
                    .safety-incident {
                        height: 50%;
                        padding: 5px;
                        .safety-incident-summary {
                            width: 130px;
                            text-align: center;
                            > div {
                                padding: 5px;
                                border: 1px solid var( --lpx-widget-border-color);
                            }
                        }
                        .safety-incident-chart {
                            width: calc(100% - 130px);
                        }
                    }
                    .safety-near-miss {
                        height: 50%;
                        padding: 5px;
                        .safety-near-miss-summary {
                            width: 130px;
                            text-align: center;
                            > div {
                                padding: 5px;
                                border:1px solid var( --lpx-widget-border-color);
                            }
                        }
                        .safety-near-miss-chart {
                            width: calc(100% - 130px);
                        }
                    }
                }
                .safety-alert {
                    float: left;
                    width: 350px;
                    height: 100%;
                }
            }
            .safety-footer {
                height: 100px;
                margin-top: 5px;
                .safety-footer-header {
                    height: 35px;
                    background-color: #ff7425;
                    color: #ffffff;
                    text-align: center;
                    font-weight: 500;
                    font-size: 1.2rem;
                    line-height: 35px;
                }
                .safety-footer-content {
                    height: 65px;
                    > div {
                        text-align: center;
                        border-left: 1px solid var(--lpx-border-color);
                        border-bottom: 1px solid var(--lpx-border-color);
                        span {
                            display: inline-block;
                            margin-top: 5px;
                            width: 60px;
                            height: 30px;
                            line-height: 30px;
                            background-color: #ffd1b6;
                            border-radius: 10px;
                            font-weight: bold;
                            color: #000000;
                        }
                    }
                }
            }
            .cursor-pointer {
                cursor: pointer;
            }
        }

    `]
})
export class SiteHuddleSafetyComponent {
    @ViewChild('safetyChart') safetyChart: ChartComponent;
    @ViewChild('nearMissChart') nearMissChart: ChartComponent;
    @Input() selectedDataTier: any;
    @Input() site: any = {};
    @Output() broadcastMsgListChange: EventEmitter<void> = new EventEmitter<void>();
    @Input() queryId: any;
    @Input() assignedAndDefaultDataTiers: any;
    cardType = 'Safety';
    actionCardsData: SiteHuddleCardStatisticsDto = {} as SiteHuddleCardStatisticsDto;
    actionCardsSubscription: Subscription;
    safetyIncidentsSubscription: Subscription;
    nearMissesSubscription: Subscription;
    safetyIncidentsData: SafetyIncidentDailyDto = {} as SafetyIncidentDailyDto;
    nearMissesData: NearMissesDailyDto = {} as NearMissesDailyDto;
    nearMissTarget: number;
    safetyInfo: SafetyIncidentDto = {} as SafetyIncidentDto;
    endDate: string;
    startDate: string;
    monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    last30DaysArray: any[] = [];
    curMonth = this.monthShortNames[new Date().getMonth()];
    options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: this.themeService.isDarkTheme() ? '#f5f5f5' : '#212529',
                }
            },
            title: {
                display: true,
                text: 'Safety Incidents',
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
                beginAtZero: true,
                ticks: {
                    color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168',
                }
            }
        }
    };
    safetyChartOptions;
    safetyChartData = {
        labels: [],
        datasets: [
            {
                label: 'Safety Incidents',
                // data: [12, 0, 3, 5, 2, 3, 0, 19, 3, 5, 2, 3, 0, 1, 2, 3, 0, 1],
                data: Array(30).fill(0),
                backgroundColor: '#0a587c'
            }
        ]
    }
    nearMissChartOptions;
    nearMissChartData = {
        labels: [],
        datasets: [
            {
                label: 'Near Misses Incidents',
                // data: [1, 12, 0, 8, 10, 0, 1, 3, 12, 0, 8, 3, 6, 5, 2, 3, 4, 1],
                data: Array(30).fill(0),
                backgroundColor: '#0a587c'
            }
        ]
    };
    expandSafetyChart = false;
    expandNearMissChart = false;

    // Component logic goes here
    constructor(
        private siteHuddleService: SiteHuddleService,
        private siteHuddleWithSnowflakeService: SiteHuddleWithSnowflakeService,
        private areaHuddleWithSnowflakeService: AreaHuddleWithSnowflakeService,
        private localizationService: LocalizationService,
        private themeService: ThemeService,
        private datePipe: DatePipe
    ) {
        this.safetyChartOptions = JSON.parse(JSON.stringify(this.options));
        this.safetyChartOptions.scales.y.ticks.callback = (value) =>{
            if (Number.isInteger(value)) {
                return value;
            }
            return '';
        }
        this.nearMissChartOptions = JSON.parse(JSON.stringify(this.options));
        this.nearMissChartOptions.scales.y.ticks.callback = (value) =>{
            if (Number.isInteger(value)) {
                return value;
            }
            return '';
        }
        this.localizationService.get('::LABEL_SafetyIncidents').subscribe(data => {
            this.safetyChartOptions.plugins.title.text = data;
        });
        this.localizationService.get('::LABEL_NearMisses').subscribe(data => {
            this.nearMissChartOptions.plugins.title.text = data;
        });
        this.calculateDate();
    }

    ngOnInit(): void {
        this.themeService.listenToThemeChanges(this.applyTheme);
        this.getSafetyInfo();
        this.getActionCardsData();
        this.getSafetyIncidentDaily();
        this.getNearMissDaily();
        this.getMonthlyTarget('NearMisses');
    }

    ngOnChanges(): void {
        this.getActionCardsData();
        this.getSafetyIncidentDaily();
        this.getNearMissDaily();
    }

    calculateDate() {
        let date = new Date();
        this.startDate = new Date(new Date(date.setDate(date.getDate() - 30)).setHours(0,0,0,0)).toLocalISOString();
        date = new Date();
        this.endDate = new Date(date.setHours(0, 0, 0, 0)).toLocalISOString();
        // based on startDate and endDate, generate last30DaysArray ['24-Mar', '25-Mar', ...]
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
        this.safetyChartData.labels = dateDisplayNames;
        this.nearMissChartData.labels = dateDisplayNames;
    }

    getSafetyInfo() {
        if (this.site?.id) {
            this.areaHuddleWithSnowflakeService.getSafetyIncidentBySiteId(this.site.id).subscribe(data => {
                this.safetyInfo = data;
            })
        }
    }

    getActionCardsData() {
        if (this.actionCardsSubscription) {
            this.actionCardsSubscription.unsubscribe();
        }
        this.actionCardsSubscription = this.siteHuddleService.getActivityCardInfoByKPIIndicatorByInput({
            siteId: this.site?.id,
            areaIds: this.selectedDataTier?.areas?.map(area => area?.id),
            cellIds: this.selectedDataTier?.cells?.map(cell => cell?.id),
            siteKPIIndicator: this.cardType,
        }).subscribe((res) => {
            this.actionCardsData = res;
        })
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

        updateChartOptions(this.safetyChartOptions);
        if (this.safetyChart) {
            this.safetyChart.refresh();
        }
        updateChartOptions(this.nearMissChartOptions);
        if (this.nearMissChart) {
            this.nearMissChart.refresh();
        }
    };

    getSafetyIncidentDaily() {
        if (this.safetyIncidentsSubscription) {
            this.safetyIncidentsSubscription.unsubscribe();
        }
        this.safetyIncidentsSubscription = this.siteHuddleWithSnowflakeService.getSafetyIncidentDailyByInput({
            siteId: this.site?.id,
            // areaId: this.areaId,
            startDate: this.startDate,
            endDate: this.endDate,
        }).subscribe((res) => {
            this.safetyIncidentsData = res;
            this.safetyChartData.datasets[0].data = Array(30).fill(0);
            const displayLable = 'Site' + (this.site?.name ? ' - ' + this.site?.name : '');
            // display data 0 when data < 0
            this.safetyChartOptions.plugins.tooltip = {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${displayLable}: `+parseInt(tooltipItem.raw, 10);
                    }
                }
            }
            this.safetyChartData.datasets[0].label = displayLable;
            // res.dailyList.push({date: '2025-04-20T', dailyIncidents: 2});
            // res.dailyList.push({date: '2025-04-21T', dailyIncidents: 5});
            // res.dailyList.push({date: '2025-04-22T', dailyIncidents: 50});
            res.dailyList.forEach((item) => {
                const index = this.last30DaysArray.findIndex((dateObj) => dateObj.date.split('T')[0] === item.date.split('T')[0]);
                this.safetyChartData.datasets[0].data[index] = item.dailyIncidents;
            });
            // set 0 to a small value to avoid chart not showing, dynamic set the replace value based on max y value
            const maxY = res.dailyList.length ? Math.max(...res.dailyList.map((item) => item.dailyIncidents)) || 1 : 1;
            this.safetyChartData.datasets[0].data = this.safetyChartData.datasets[0].data.map((item) => {
                if (item === 0) {
                    item = Math.min(maxY / 100, 0.5);
                }
                return item;
            })
            // when all 0, set y max to 1
            if (!this.safetyChartData.datasets[0].data.some((item) => item >= 1)) {
                this.safetyChartOptions.scales.y.max = 1;
            }
            if (this.safetyChart) {
                this.safetyChart.refresh();
            }
        })
    }

    getNearMissDaily() {
        if (this.nearMissesSubscription) {
            this.nearMissesSubscription.unsubscribe();
        }
        this.nearMissesSubscription = this.siteHuddleService.getNearMissesDailyByInput({
            siteId: this.site?.id,
            areaIds: this.selectedDataTier?.areas?.map(area => area?.id),
            cellIds: this.selectedDataTier?.cells?.map(cell => cell?.id),
            startDate: this.startDate,
            endDate: this.endDate,
        }).subscribe((res) => {
            this.nearMissesData = res;
            this.nearMissChartData.datasets[0].data = Array(30).fill(0);
            // If Area filter empty, legend title = Site - <Site Name>
            //If an Area is selected, legend title = Area - <Area Name>
            if (this.selectedDataTier?.areas && this.selectedDataTier?.areas?.length) {
                this.nearMissChartData.datasets[0].label = 'Area' + ' - ' + this.selectedDataTier?.areas.map(area => area?.name).join(',');
            } else {
                this.nearMissChartData.datasets[0].label = 'Site' + (this.site?.name ? ' - ' + this.site?.name : '');
            }
            // display data 0 when data < 0
            this.nearMissChartOptions.plugins.tooltip = {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: `+parseInt(tooltipItem.raw, 10);
                    }
                }
            }
            res.nearMissesList.forEach((item) => {
                const index = this.last30DaysArray.findIndex((dateObj) => dateObj.date.split('T')[0] === item.date.split('T')[0]);
                this.nearMissChartData.datasets[0].data[index] = item.dailyNearMisses;
            });
             // set 0 to a small value to avoid chart not showing, dynamic set the replace value based on max y value
             const maxY = res.nearMissesList.length ? Math.max(...res.nearMissesList.map((item) => item.dailyNearMisses)) || 1 : 1;
             this.nearMissChartData.datasets[0].data = this.nearMissChartData.datasets[0].data.map((item) => {
                 if (item === 0) {
                     item = Math.min(maxY / 100, 0.5);
                 }
                 return item;
             })
             // when all 0, set y max to 1
             if (!this.nearMissChartData.datasets[0].data.some((item) => item >= 1)) {
                 this.nearMissChartOptions.scales.y.max = 1;
             }
            if (this.nearMissChart) {
                this.nearMissChart.refresh();
            }
        })
    }

    getMonthlyTarget(type: string) {
        this.siteHuddleWithSnowflakeService.getSiteMonthlyTargetByInput({
            siteId: this.site?.id,
            startDate: this.startDate,
            endDate: this.endDate,
            targetType: type,
        }).subscribe((res) => {
            this.nearMissTarget = res.targetList.find((item) => item.month === (new Date().getMonth() + 1))?.monthlyTarget;
        })
    }

    ngOnDestroy(): void {
        if (this.actionCardsSubscription) {
            this.actionCardsSubscription.unsubscribe();
        }
        if (this.safetyIncidentsSubscription) {
            this.safetyIncidentsSubscription.unsubscribe();
        }
        if (this.nearMissesSubscription) {
            this.nearMissesSubscription.unsubscribe();
        }
    }

    expand(type: string) {
        if (type === 'safetyChart') {
            this.expandSafetyChart = !this.expandSafetyChart;
        } else if (type === 'nearMissChart') {
            this.expandNearMissChart = !this.expandNearMissChart;
        }
    }
}
