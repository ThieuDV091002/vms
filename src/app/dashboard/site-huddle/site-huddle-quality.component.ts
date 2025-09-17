import { ChartComponent } from "@abp/ng.components/chart.js";
import { LocalizationService } from "@abp/ng.core";
import { DatePipe } from "@angular/common";
import { Component, Input, ViewChild } from "@angular/core";
import { SiteHuddleWithSnowflakeService } from "@apis/general";
import { SiteCopqDto, SiteQNDailyDto } from "@apis/general/dtos/site-huddle";
import { SiteHuddleCardStatisticsDto } from "@apis/ticket/dtos";
import { SiteHuddleService } from "@apis/ticket/services";
import { Subscription } from "rxjs";
import { ThemeService } from "src/app/shared/services/theme.service";

@Component({
    selector: 'app-site-huddle-quality',
    template: `
        <div class="quality-container">
            <div class="quality-content-item d-flex">
                <div class="quality-content-item-summary d-flex flex-column align-items-center text-center">
                    <div>{{'::LABEL_ExternalQNs' | abpLocalization}}</div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.not-meet-color]="externalQNsData?.last24Hours > 0">{{externalQNsData?.last24Hours}}</span>
                        <span>{{'::LABEL_Last24Hours' | abpLocalization}}</span>
                    </div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.not-meet-color]="externalQNsData?.mtdActual > externalQNsData?.currentMonthTarget">{{externalQNsData?.mtdActual}}</span>
                        <span>{{'::LABEL_MTDActual' | abpLocalization}}</span>
                    </div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.no-target]="externalQNsData?.currentMonthTarget < 0">{{externalQNsData?.currentMonthTarget < 0 ? ('::LABEL_NoTarget' | abpLocalization) : externalQNsData?.currentMonthTarget}}</span>
                        <span>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</span>
                    </div>
                </div>
                <div class="quality-content-item-chart" [ngClass]="{'widget-fullscreen': expandExternalChart}">
                    <div class="position-relative h-100 widget-page">
                        <div class="position-absolute top-0 end-0 widget-toolbar" style="z-index: 99;">
                             <span class="me-2 cursor-pointer" (click)="expand('externalChart')">
                                 @if (expandExternalChart) {
                                 <i class="fa fa-compress fa-lg"></i>
                                 } @else {
                                 <i class="fa fa-expand fa-lg"></i>
                                 }
                            </span>
                        </div>
                        <abp-chart
                            #externalChart
                            [data]="externalChartData"
                            [options]="externalChartOptions"
                            width="100%"
                            height="100%"
                            [type]="'bar'">
                        </abp-chart>
                    </div>
                </div>
            </div>
            <div class="quality-content-item d-flex">
                <div class="quality-content-item-summary d-flex flex-column align-items-center text-center">
                    <div>COPQ</div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.not-meet-color]="COPQData?.mtdActual > COPQData?.currentMonthTarget">{{COPQData?.mtdActual | number: '1.0-0'}}</span>
                        <span>{{'::LABEL_MTDActual' | abpLocalization}}</span>
                    </div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.no-target]="COPQData?.currentMonthTarget < 0">{{COPQData?.currentMonthTarget < 0 ? ('::LABEL_NoTarget' | abpLocalization) : COPQData?.currentMonthTarget | number: '1.0-0'}}</span>
                        <span>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</span>
                    </div>
                </div>
                <div class="quality-content-item-chart" [ngClass]="{'widget-fullscreen': expandCOPQChart}">
                    <div class="position-relative h-100 widget-page">
                        <div class="position-absolute top-0 end-0 widget-toolbar" style="z-index: 99;">
                             <span class="me-2 cursor-pointer" (click)="expand('COPQChart')">
                                 @if (expandCOPQChart) {
                                 <i class="fa fa-compress fa-lg"></i>
                                 } @else {
                                 <i class="fa fa-expand fa-lg"></i>
                                 }
                            </span>
                        </div>
                        <abp-chart
                            #COPQChart
                            [data]="COPQChartData"
                            [options]="COPQChartOptions"
                            width="100%"
                            height="100%"
                            [type]="'bar'">
                        </abp-chart>
                    </div>
                </div>
            </div>
            <div class="quality-content-item d-flex">
                <div class="quality-content-item-summary d-flex flex-column align-items-center text-center">
                    <div>{{'::LABEL_InternalQNs' | abpLocalization}}</div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.not-meet-color]="internalQNsData?.last24Hours > 0">{{internalQNsData?.last24Hours}}</span>
                        <span>{{'::LABEL_Last24Hours' | abpLocalization}}</span>
                    </div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.not-meet-color]="internalQNsData?.mtdActual > internalQNsData?.currentMonthTarget">{{internalQNsData?.mtdActual}}</span>
                        <span>{{'::LABEL_MTDActual' | abpLocalization}}</span>
                    </div>
                    <div class="quality-num-container flex-fill d-flex flex-column justify-content-center">
                        <span class="quality-summary-num" [class.no-target]="internalQNsData?.currentMonthTarget < 0">{{internalQNsData?.currentMonthTarget < 0 ? ('::LABEL_NoTarget' | abpLocalization) : internalQNsData?.currentMonthTarget}}</span>
                        <span>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</span>
                    </div>
                </div>
                <div class="quality-content-item-chart"  [ngClass]="{'widget-fullscreen': expandInternalChart}">
                    <div class="position-relative h-100 widget-page">
                        <div class="position-absolute top-0 end-0 widget-toolbar" style="z-index: 99;">
                             <span class="me-2 cursor-pointer" (click)="expand('internalChart')">
                                 @if (expandInternalChart) {
                                 <i class="fa fa-compress fa-lg"></i>
                                 } @else {
                                 <i class="fa fa-expand fa-lg"></i>
                                 }
                            </span>
                        </div>
                        <abp-chart
                            #internalChart
                            [data]="internalChartData"
                            [options]="internalChartOptions"
                            width="100%"
                            height="100%"
                            [type]="'bar'">
                        </abp-chart>
                    </div>
                </div>
            </div>
            <!-- <div class="quality-content-item d-flex">
                <div class="quality-content-item-chart flex-fill">
                    <abp-chart
                        [data]="blockedStockChartData"
                        [options]="blockedStockChartOptions"
                        width="100%"
                        height="100%"
                        [type]="'bar'">
                    </abp-chart>
                </div>
            </div> -->
        </div>
        <div class="quality-footer">
            <div class="quality-footer-header">
                {{'::LABEL_QualityActionCards' | abpLocalization}}
            </div>
            <div class="quality-footer-content d-flex">
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
            font-weight: 500;
        }
        .not-meet-color {
            color: #ff0000;
        }
        .quality-container {
            height: calc(100% - 100px);
            &::after {
                content: '';
                display: table;
                clear: both;
            }
            .quality-content-item {
                width: 50%;
                padding: 5px;
                float: left;
                height: 50%;
                .quality-content-item-summary {
                    width: 120px;
                    padding: 5px;
                    border: 1px solid var( --lpx-widget-border-color);
                    .quality-num-container {
                        border: 1px solid var( --lpx-widget-border-color);
                        width: 100%;
                    }
                    .quality-summary-num {
                        font-weight: bold;
                        font-size: 1.5em;
                        &.no-target {
                            font-size: 1rem;
                        }
                    }
                }
                .quality-content-item-chart {
                    width: calc(100% - 120px);
                    border: 1px solid var( --lpx-widget-border-color);
                }
            }
        }
        .quality-footer {
            height: 100px;
            margin-top: 5px;
            .quality-footer-header {
                height: 35px;
                background-color: #0099d8;
                color: #ffffff;
                text-align: center;
                font-weight: 500;
                font-size: 1.2rem;
                line-height: 35px;
            }
            .quality-footer-content {
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
                        background-color: #ccebf7;
                        border-radius: 10px;
                        font-weight: bold;
                        color: #000000;
                    }
                }
            }
        }
    `]
})
export class SiteHuddleQualityComponent {
    @ViewChild('externalChart') externalChart: ChartComponent;
    @ViewChild('internalChart') internalChart: ChartComponent;
    @ViewChild('COPQChart') COPQChart: ChartComponent;
    @Input() site: any = {};
    @Input() selectedDataTier: any;
    monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    curMonth = this.monthShortNames[new Date().getMonth()];
    last30DaysArray: any[] = [];
    startDate: string;
    endDate: string;
    cardType = 'Quality';
    actionCardsData: SiteHuddleCardStatisticsDto = {} as SiteHuddleCardStatisticsDto;
    subscription: Subscription;
    externalQNsSubscription: Subscription;
    internalQNsSubscription: Subscription;
    COPQSubscription: Subscription;
    externalQNsData: SiteQNDailyDto = {} as SiteQNDailyDto;
    internalQNsData: SiteQNDailyDto = {} as SiteQNDailyDto;
    COPQData: SiteCopqDto = {} as SiteCopqDto;
    expandExternalChart = false;
    expandInternalChart = false;
    expandCOPQChart = false;

    chartColors = ['#FF6384', '#36A2EB', '#949FB1', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#F7464A', '#46BFBD', '#FDB45C', '#4D5360'];
    options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
                }
            },
            title: {
                display: true,
                text: 'External QNs',
                color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
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
                    color: this.themeService.isDarkTheme() ? '#9ca5b4' : '#325168'
                }
            }
        }
    };
    externalChartOptions;
    // stack data
    externalChartData = {
        labels: [],
        datasets: []
    };

    internalChartOptions;
    // stack data
    internalChartData = {
        labels: [],
        datasets: []
    };
    COPQChartOptions;
    // stack data
    COPQChartData = {
        labels: [],
        datasets: []
    };
    // blockedStockChartOptions;
    // stack data
    // blockedStockChartData = {
    //     labels: ['Area 1', 'Area 2', 'Area 3', 'Area 4', 'Area 5'],
    //     datasets: [
    //         {
    //             label: '< 5 days',
    //             data: [12, 19, 3, 5, 2, ],
    //             backgroundColor: '#FF6384'
    //         },
    //         {
    //             label: '>5<10 days',
    //             data: [2, 3, 20, 5, 2],
    //             backgroundColor: '#36A2EB'
    //         },
    //         {
    //             label: '>10<30 days',
    //             data: [2, 3, 20, 5, 2],
    //             backgroundColor: '#949FB1'
    //         },
    //         {
    //             label: '>30 days',
    //             data: [2, 3, 20, 5, 2],
    //             backgroundColor: '#FFCE56'
    //         },
    //     ]
    // };
    // Component logic goes here
    constructor(
        private siteHuddleService: SiteHuddleService,
        private siteHuddleWithSnowflakeService: SiteHuddleWithSnowflakeService,
        private localizationService: LocalizationService,
        private themeService: ThemeService,
        private datePipe: DatePipe
    ) {
        this.externalChartOptions = JSON.parse(JSON.stringify(this.options));
        this.externalChartOptions.scales.y.ticks.callback = (value) =>{
            if (Number.isInteger(value)) {
                return value;
            }
            return '';
        }
        this.internalChartOptions = JSON.parse(JSON.stringify(this.options));
        this.internalChartOptions.scales.y.ticks.callback = (value) =>{
            if (Number.isInteger(value)) {
                return value;
            }
            return '';
        }
        // change title
        this.localizationService.get('::LABEL_ExternalQNs').subscribe(data => {
            this.externalChartOptions.plugins.title.text = data;
        });
        this.localizationService.get('::LABEL_InternalQNs').subscribe(data => {
            this.internalChartOptions.plugins.title.text = data;
        });
        this.COPQChartOptions = JSON.parse(JSON.stringify(this.options));
        this.COPQChartOptions.plugins.tooltip = {
            callbacks: {
                label: (tooltipItem) => {
                    return tooltipItem.dataset.label + ': ' + tooltipItem.raw.toFixed(1);
                }
            }
        }
        this.COPQChartOptions.plugins.title.text = 'COPQ';
        // this.blockedStockChartOptions = JSON.parse(JSON.stringify(this.options));
        // this.blockedStockChartOptions.plugins.title.text = 'Blocked Stock';
        this.calculateDate();
    }

    ngOnInit(): void {
        this.themeService.listenToThemeChanges(this.applyTheme);
        this.getActionCardsData();
        this.getQNsData();
        this.getCOPQData();
    }

    ngOnChanges(): void {
        this.getActionCardsData();
        this.getQNsData();
        this.getCOPQData();
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
        this.externalChartData.labels = dateDisplayNames;
        this.internalChartData.labels = dateDisplayNames;
        this.COPQChartData.labels = dateDisplayNames;
    }

    getDailyChartData(res: any, charData: any, numField: string, chart: ChartComponent, chartOption: any=null) {
        const areas = new Set();
        res.dailyList.forEach((item) => {
            areas.add(item['areaDisplayName'] || item['areaName']);
        });
        charData.datasets = [];
        [...areas].forEach((area, index) => {
            charData.datasets.push({
                label: area,
                data: Array(30).fill(0),
                backgroundColor: this.chartColors[index % this.chartColors.length],
            });
        });
        res.dailyList.forEach((item) => {
            const index = this.last30DaysArray.findIndex((dateObj) => dateObj.date.split('T')[0] === item.date.split('T')[0]);
            const areaIndex = charData.datasets.findIndex((dataset) => dataset.label === (item['areaDisplayName'] || item['areaName']));
            charData.datasets[areaIndex].data[index] = item[numField];
        });
        // add zero for QNs data if no data for specific date
        if (numField === 'dailyQN' && chartOption) {
            this.handleNodataChartData(charData, chartOption);
        }
        if (chart) {
            chart.refresh();
        }
    }

    handleNodataChartData(charData: any, chartOption: any) {
        // console.log('handleNodataChartData', areas, charData, chartOption);

        // calculate the max value of stacked area data
        const sumArr = Array(30).fill(0);
        for (let i=0; i<sumArr.length; i++) {
            for (let j=0; j<charData.datasets.length; j++) {
                sumArr[i] += charData.datasets[j].data[i];
            }
        }
        let maxValue = Math.max(...sumArr);
         // when all 0, set y max to 1
         if (maxValue === 0) {
            chartOption.scales.y.max = 1;
            maxValue = 1;
        }
        // not display no_data legend
        chartOption.plugins.legend.labels.filter = (legendItem) => {
            return legendItem.text !== 'no_data';
        };
        chartOption.plugins.tooltip = {
            callbacks: {
                label: (tooltipItem) => {
                    if (tooltipItem.dataset.label === 'no_data') {
                        return '0';
                    } else {
                        return tooltipItem.dataset.label + ': ' + parseInt(tooltipItem.raw, 10);
                    }
                }
            }
        }
        const helpArr = Array(30).fill(0);
        for (let i=0; i<sumArr.length; i++) {
            if (sumArr[i] === 0) {
                helpArr[i] = Math.min(maxValue / 100, 0.5);
            }
        }
        charData.datasets.push({
            label: 'no_data',
            data: helpArr,
            backgroundColor: '#0a587c',
        });
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

        updateChartOptions(this.externalChartOptions);
        if (this.externalChart) {
            this.externalChart.refresh();
        }
        updateChartOptions(this.internalChartOptions);
        if (this.internalChart) {
            this.internalChart.refresh();
        }
        updateChartOptions(this.COPQChartOptions);
        if (this.COPQChart) {
            this.COPQChart.refresh();
        }
    };

    getQNsData() {
        if (this.externalQNsSubscription) {
            this.externalQNsSubscription.unsubscribe();
        }
        if (this.internalQNsSubscription) {
            this.internalQNsSubscription.unsubscribe();
        }
        // get QNs data from siteHuddleWithSnowflakeService
        this.externalQNsSubscription = this.siteHuddleWithSnowflakeService.getQNDailyByInput({
            siteId: this.site?.id,
            areaId: this.selectedDataTier?.areas && this.selectedDataTier?.areas[0]?.id,
            startDate: this.startDate,
            endDate: this.endDate,
            type: 'External'
        }).subscribe((res) => {
            this.externalQNsData = res;
            // res.dailyList.push({date: '2025-05-01', areaName: 'Area 1', dailyQN: 1});
            // res.dailyList.push({date: '2025-05-01', areaName: 'Area 2', dailyQN: 2});
            // res.dailyList.push({date: '2025-04-29', areaName: 'Area 1', dailyQN: 3});
            this.getDailyChartData(res, this.externalChartData, 'dailyQN', this.externalChart, this.externalChartOptions)
        });
        this.internalQNsSubscription = this.siteHuddleWithSnowflakeService.getQNDailyByInput({
            siteId: this.site?.id,
            areaId: this.selectedDataTier?.areas && this.selectedDataTier?.areas[0]?.id,
            startDate: this.startDate,
            endDate: this.endDate,
            type: 'Internal'
        }).subscribe((res) => {
            this.internalQNsData = res;
            this.getDailyChartData(res, this.internalChartData, 'dailyQN', this.internalChart, this.internalChartOptions)
        });
    }

    getCOPQData() {
        if (this.COPQSubscription) {
            this.COPQSubscription.unsubscribe();
        }
        this.COPQSubscription = this.siteHuddleWithSnowflakeService.getCOPQDailyByInput({
            siteId: this.site?.id,
            areaId: this.selectedDataTier?.areas && this.selectedDataTier?.areas[0]?.id,
            startDate: this.startDate,
            endDate: this.endDate
        }).subscribe((res) => {
            this.COPQData = res;
            this.getDailyChartData(res, this.COPQChartData, 'dailyCOPQ', this.COPQChart)
        });
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

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.externalQNsSubscription) {
            this.externalQNsSubscription.unsubscribe();
        }
        if (this.internalQNsSubscription) {
            this.internalQNsSubscription.unsubscribe();
        }
        if (this.COPQSubscription) {
            this.COPQSubscription.unsubscribe();
        }
    }

    expand(type: string) {
        if (type === 'externalChart') {
            this.expandExternalChart = !this.expandExternalChart;
        } else if (type === 'internalChart') {
            this.expandInternalChart = !this.expandInternalChart;
        } else if (type === 'COPQChart') {
            this.expandCOPQChart = !this.expandCOPQChart;
        }
    }
}
