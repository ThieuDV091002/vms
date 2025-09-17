import { LocalizationService } from "@abp/ng.core";
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ActivityCardService } from "@apis/ticket";
import { ActivityCardSafetyInfoDto, SafetyCardCountByMonthOutput } from "@apis/ticket/dtos";

@Component({
    selector: 'app-site-huddle-monthly',
    template: `
        <div class="site-huddle-container d-flex" [class.has-header]="hasHeader" [class.expanded-site-huddle]="expanded">
            <div class="safety" [class.d-none]="expanded && expandWidgetIndex > 5">
                <div class="title">{{'::LABEL_Safety' | abpLocalization}}</div>
                <div class="content one-num-view" [class.d-none]="expanded && expandWidgetIndex !== 0">
                    <div>
                        <div class="incident-number">{{safetyInfo?.noOfDaysSinceLastIncidents}} {{'::LABEL_days' | abpLocalization}}</div>
                        <div class="tips">{{'::LABEL_SinceLastIncident' | abpLocalization}}</div>
                    </div>
                </div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 1">
                    <div class="chart-container">
                        <span class="expand-btn" (click)="expandWidget(1)"><i class="fa" [ngClass]="expanded ? 'fa-compress' : 'fa-expand'"></i></span>
                        <abp-chart
                            [data]="safetyYTDChartData"
                            [options]="safetyYTDChartOptions"
                            width="100%"
                            height="100%"
                            [type]="'bar'">
                        </abp-chart>
                    </div>
                    <div class="chart-summary d-flex justify-content-around">
                        <div>{{'::LABEL_YTD' | abpLocalization}}: <span class="summary-count" [class.not-meet]="safetyYTDData?.ytdCount > safetyYTDData?.ytdLimit">{{safetyYTDData?.ytdCount}}</span></div>
                        <div>{{'::LABEL_Limit' | abpLocalization}}: <span>{{safetyYTDData?.ytdLimit}}</span></div>
                    </div>
                </div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 2">
                    <div class="chart-container">
                    <span class="expand-btn" (click)="expandWidget(2)"><i class="fa" [ngClass]="expanded ? 'fa-compress' : 'fa-expand'"></i></span>
                        <abp-chart
                            [data]="safetyNearMissedYTDChartData"
                            [options]="safetyNearMissedYTDChartOptions"
                            width="100%"
                            height="100%"
                            [type]="'bar'">
                        </abp-chart>
                    </div>
                    <div class="chart-summary d-flex justify-content-around">
                        <div>{{'::LABEL_YTD' | abpLocalization}}: <span class="summary-count" [class.not-meet]="safetyNearMissedYTDData?.ytdCount > safetyNearMissedYTDData?.ytdLimit">{{safetyNearMissedYTDData?.ytdCount}}</span></div>
                        <div>{{'::LABEL_Limit' | abpLocalization}}: <span>{{safetyNearMissedYTDData?.ytdLimit}}</span></div>
                    </div>
                </div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 3"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 4"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 5"><a href="javascript:void(0)">Add widget</a></div>
            </div>
            <div class="quality" [class.d-none]="expanded && (expandWidgetIndex <6 || expandWidgetIndex > 11)">
                <div class="title">{{'::LABEL_Quality' | abpLocalization}}</div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 6"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 7"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 8"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 9"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 10"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 11"><a href="javascript:void(0)">Add widget</a></div>
            </div>
            <div class="productivity" [class.d-none]="expanded && (expandWidgetIndex <12 || expandWidgetIndex > 17)">
                <div class="title">{{'::LABEL_Productivity' | abpLocalization}}</div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 12"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 13"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 14"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 15"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 16"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 17"><a href="javascript:void(0)">Add widget</a></div>
            </div>
            <div class="supply-chain" [class.d-none]="expanded && expandWidgetIndex < 18">
                <div class="title">{{'::LABEL_SupplyChain' | abpLocalization}}</div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 18"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 19"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 20"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 21"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 22"><a href="javascript:void(0)">Add widget</a></div>
                <div class="content" [class.d-none]="expanded && expandWidgetIndex !== 23"><a href="javascript:void(0)">Add widget</a></div>
            </div>
        </div>
    `,
    styles: [`
        .site-huddle-container {
            --lpx-safety-color: #0099d8;
            --lpx-quality-color: #22b14c;
            --lpx-productivity-color: #ffc90e;
            --lpx-supply-chain-color: #7f7f7f;
            padding: 0 .6rem;
            abp-chart ::ng-deep canvas {
                max-height: 100%;
                max-width: 100%;
            }
            .chart-container {
                height: calc(100% - 15px);
                position: relative;
                .expand-btn {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    cursor: pointer;
                    z-index: 99;
                }
            }
            .chart-summary {
                height: 14px;
                font-size: 12px;
                line-height: 14px;
                .summary-count {
                    padding: 0 10px;
                    background-color: green;
                    color: #fff;
                    &.not-meet {
                        background-color: red;
                    }
                }
            }
            &.has-header {
                .content {
                    height: calc((100vh - 10rem) / 6)!important;
                }
            }
            &.has-header.expanded-site-huddle {
                .content {
                    height: calc(100vh - 10rem)!important;
                }
            }
            &.expanded-site-huddle {
                .content {
                    height: calc(100vh - 6.6rem)!important;
                }
            }
            > div {
                flex: 1;
                border: 1px solid var( --lpx-widget-border-color);
                text-align: center;
                width: 25%;
                &:not(:last-child) {
                    margin-right: 3px;
                }
                .title {
                    color: #fff;
                    font-size: 1.5rem;
                    font-weight: bold;
                    height: 3rem;
                    line-height: 3rem;
                }
                .content {
                    min-height: 100px;
                    height: calc((100vh - 6.6rem) / 6);
                    overflow: auto;
                    &:not(:last-child) {
                        border-bottom:1px solid var( --lpx-widget-border-color);
                    }
                }
                &.safety {
                    .title {
                        background-color: var(--lpx-safety-color);
                    }
                }
                &.quality {
                    .title {
                        background-color: var(--lpx-quality-color);
                    }
                }
                &.productivity {
                    .title {
                        background-color: var(--lpx-productivity-color);
                    }

                }
                &.supply-chain {
                    .title {
                        background-color: var(--lpx-supply-chain-color);
                    }
                }
            }
            .one-num-view {
                display: flex;
                justify-content: center;
                align-items: center;
                > div {
                    background-color: var(--lpx-safety-color);
                    color: #fff;
                    font-weight: bold;
                    font-size: 2rem;
                    padding: 0 .2rem;
                    .tips {
                        font-size: 1rem;
                    }
                }
            }
            .two-number-view {
                display: flex;
                justify-content: space-around;
                align-items: center;
                > div {
                    background-color: var(--lpx-safety-color);
                    color: #fff;
                    font-weight: bold;
                    font-size: 1.5rem;
                    padding: 0 .2rem;
                    max-width: 40%;
                    .tips {
                        font-size: .8rem;
                    }
                }
            }
            .cards-title {
                font-size: 1rem;
                font-weight: bold;
                padding: 0 0.5rem;
                color: #fff;
                display: inline-block;
                margin-top: .5rem;
            }
            .safety-summary {
                .cards-title {
                    background-color: var(--lpx-safety-color);
                }
                .cards-item {
                    background-color: var(--lpx-safety-color);
                }
            }
            .quality-summary {
                .cards-title {
                    background-color: var(--lpx-quality-color);
                }
                .cards-item {
                    background-color: var(--lpx-quality-color);
                }
            }
            .productivity-summary {
                .cards-title {
                    background-color: var(--lpx-productivity-color);
                }
                .cards-item {
                    background-color: var(--lpx-productivity-color);
                }
            }
            .supply-chain-summary {
                .cards-title {
                    background-color: var(--lpx-supply-chain-color);
                }
                .cards-item {
                    background-color: var(--lpx-supply-chain-color);
                }
            }
            .four-number-view {
                display: flex;
                flex-wrap: wrap;
                > div {
                    width: 50%;
                    .cards-item {
                        width: 90%;
                        color: #fff;
                        margin-top: .4rem;
                        margin-left: 5%;
                        .cards-number {
                            font-weight: bold;
                        }
                        .tips {
                            font-size: .6rem;
                        }
                    }
                }
            }
        }
    `]

})
export class SiteHuddleMonthlyComponent implements OnInit {
    @Input() hasHeader = false;
    // @Input() selectedDataTier: any;
    safetyInfo: ActivityCardSafetyInfoDto;
    indicatorCategories = ['Safety', 'Quality', 'Productivity', 'Supply Chain'];
    safetyYTDData: SafetyCardCountByMonthOutput;
    safetyNearMissedYTDData: SafetyCardCountByMonthOutput;
    expanded = false;
    options = {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Near Missed Incidents',
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
                }
            },
            y: {
                stacked: true
            }
        }
    };
    safetyYTDChartData: any;
    safetyNearMissedYTDChartData: any;
    chartColors = ['#FF6384', '#36A2EB', '#949FB1', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#F7464A', '#46BFBD', '#FDB45C', '#4D5360'];
    monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    safetyYTDChartOptions;
    safetyNearMissedYTDChartOptions;
    expandWidgetIndex = -1;

    constructor(
        private activityCardService: ActivityCardService,
        private localizationService: LocalizationService
    ) {
        this.safetyYTDChartOptions = JSON.parse(JSON.stringify(this.options));
        this.localizationService.get('::LABEL_SafetyIncidents').subscribe(data => {
            this.safetyYTDChartOptions.plugins.title.text = data;
        });
        this.safetyNearMissedYTDChartOptions = JSON.parse(JSON.stringify(this.options));
        this.localizationService.get('::LABEL_NearMissed').subscribe(data => {
            this.safetyNearMissedYTDChartOptions.plugins.title.text = data;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes);
    }

    ngOnInit(): void {
        this.getSiteInfo();
        this.getSafetyYTDData('Safety – reportable incident');
        this.getSafetyYTDData('Safety – near missed');
    }

    expandWidget(index: number) {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.expandWidgetIndex = index;
        } else {
            this.expandWidgetIndex = -1;
        }
    }

    getSiteInfo() {
        this.activityCardService.getSafetyInfo().subscribe(data => {
            this.safetyInfo = data;
        })
    }

    getSafetyYTDData(type: string) {
        this.activityCardService.
        getSafetyActivityCardCountByMonthByActivityCardCategoryNameAndStartYear(
            type,
            new Date().getFullYear()
        ).subscribe(data => {
            if (type === 'Safety – reportable incident') {
                this.safetyYTDData = data;
                this.safetyYTDChartData = this.generateYTDChartData(this.safetyYTDData);
            }
            if (type === 'Safety – near missed') {
                this.safetyNearMissedYTDData = data;
                this.safetyNearMissedYTDChartData = this.generateYTDChartData(this.safetyNearMissedYTDData);
            }
        })
    }


    generateYTDChartData(data: SafetyCardCountByMonthOutput) {
        const month = new Date().getMonth();
        const labels = this.monthLabels.slice(0, month + 1);
        const areas = data.activityCardCounts.map(item => item.area).filter((value, index, self) => self.indexOf(value) === index);
        const datasets = areas.map((area, index) => {
            return {
                label: area,
                data: Array(month + 1).fill(0).map((_, index) => {
                    const monthData = data.activityCardCounts.find(item => item.area === area && item.month === index + 1);
                    return monthData ? monthData.activityCardCount : 0;
                }),
                backgroundColor: this.chartColors[index%(this.chartColors.length)],
                stack: 'Stack 0'
            }
        });
        return {
            datasets,
            labels
        }
    }
}
