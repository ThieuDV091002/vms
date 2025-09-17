import { Component } from "@angular/core";

@Component({
    selector: 'app-site-huddle-supply-chain',
    template: `
        <div class="supply-chain-container">
            <div class="supply-chain-summary">
                <table>
                    <tr>
                        <td>{{'::LABEL_Prediction' | abpLocalization}}</td>
                        <td>$1,950k</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_RevenueMTD' | abpLocalization}}</td>
                        <td>$1,205k</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_BookingsMTD' | abpLocalization}}</td>
                        <td>$1,000k</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_Ratio' | abpLocalization}}</td>
                        <td>.83</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_LateLinesMTD' | abpLocalization}}</td>
                        <td>700</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_OverdueBacklogMTD' | abpLocalization}}</td>
                        <td>$1,950k</td>
                    </tr>
                </table>
            </div>
            <div class="supply-chain-chart-container d-flex flex-column">
                <div class="revenue-chart">
                    <abp-chart
                        [data]="revenueChartData"
                        [options]="revenueChartOptions"
                        width="100%"
                        height="100%"
                        [type]="'line'">
                    </abp-chart>
                </div>
                <div class="backlog-chart d-flex">
                    <div class="mpd-chart flex-fill">
                        <abp-chart
                            [data]="MPDChartData"
                            [options]="MPDChartChartOptions"
                            width="100%"
                            height="100%"
                            [type]="'line'">
                        </abp-chart>
                    </div>
                    <div class="crd-chart flex-fill">
                        <abp-chart
                            [data]="CRDChartData"
                            [options]="CRDChartOptions"
                            width="100%"
                            height="100%"
                            [type]="'line'">
                        </abp-chart>
                    </div>
                </div>
            </div>
        </div>
        <div class="supply-chain-footer">
            <div class="supply-chain-footer-header">
                {{'::LABEL_SupplyChainActionCards' | abpLocalization}}
            </div>
            <div class="supply-chain-footer-content d-flex">
                <div class="flex-fill">
                    {{'::LABEL_NoUpdateGreaterThanTenDays' | abpLocalization}} <br/>
                    <span>0</span>
                </div>
                <div class="flex-fill">
                    {{'::LABEL_OpenGreaterThan21Days' | abpLocalization}} <br/>
                    <span>0</span>
                </div>
                <div class="flex-fill">
                    {{'::LABEL_NoTaskOwner' | abpLocalization}} <br/>
                    <span>0</span>
                </div>
                <div class="flex-fill">
                    {{'::LABEL_TaskPastDue' | abpLocalization}} <br/>
                    <span>0</span>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            height: 100%;
            font-weight: 500;
        }
        .supply-chain-container {
            height: calc(100% - 100px);
            &::after {
                content: '';
                display: table;
                clear: both;
            }
            .supply-chain-summary {
                width: 250px;
                float: left;
                height: 100%;
                padding: 5px;
                table {
                    width: 100%;
                    height: 100%;
                    border-collapse: collapse;
                    text-align: center;
                    tr {
                        td:nth-child(1) {
                            width: 140px;
                            padding: 5px 10px;
                            background-color: var(--lpx-content-bg);
                            word-break: break-all;
                        }
                        td:nth-child(2) {
                            font-size: 1.2em;
                            font-weight: bold;
                        }
                    }
                    td {
                        border: 2px solid var(--lpx-custome-border-color);
                    }
                }
            }
            .supply-chain-chart-container {
                float: left;
                height: 100%;
                width: calc(100% - 250px);
                padding: 5px;
                .revenue-chart {
                    height: 50%;
                    border: 1px solid var(--lpx-border-color);
                }
                .backlog-chart {
                    height: 50%;
                    border: 1px solid var(--lpx-border-color);
                    .mpd-chart, .crd-chart {
                        width: 50%;
                    }
                }
            }
        }
        .supply-chain-footer {
            height: 100px;
            margin-top: 5px;
            .supply-chain-footer-header {
                height: 35px;
                background-color: #6c757d;
                color: #ffffff;
                text-align: center;
                font-weight: 500;
                font-size: 1.2rem;
                line-height: 35px;
            }
            .supply-chain-footer-content {
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
                        background-color: #e1e3e6;
                        border-radius: 10px;
                        font-weight: bold;
                        color: #000000;
                    }
                }
            }
        }
    `]
})
export class SiteHuddleSupplyChainComponent {
    cardType = 'Supply Chain';
    options = {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Revenue',
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
    revenueChartOptions;
    MPDChartChartOptions;
    CRDChartOptions;
    revenueChartData = {
        labels: [1, 2, 3,4,5,6,7,8,9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        datasets: [
            {
                label: 'Revenue',
                data: [1, 3, 7, 10, 12, 13, 15, 17, 22, 27, 31, 32, 32, 32, 34, 35, 37, 38, 40, 45],
                borderColor: '#03A9F4'
            }
        ]
    };
    MPDChartData = {
        labels: ['Area3', 'Area1', 'Area2', 'Area4', 'Area6', 'Area5'],
        datasets: [
            {
                type: 'bar',
                label: 'data',
                data: [10, 8, 7, 5, 4, 2],
                yAxisID: 'y',
                backgroundColor: '#0a587c',
                order: 2
            },
            {
                type: 'line',
                label: 'cul data',
                data: [0.28, 0.5, 0.69, 0.83, 0.94, 1],
                yAxisID: 'y1',
                borderColor: '#e55a11',
                order: 1
            }
        ]
    }
    CRDChartData = {
        labels: ['Area3', 'Area1', 'Area2', 'Area4', 'Area6', 'Area5'],
        datasets: [
            {
                type: 'bar',
                label: 'data',
                data: [10, 8, 7, 5, 4, 2],
                yAxisID: 'y',
                backgroundColor: '#0a587c',
                order: 2
            },
            {
                type: 'line',
                label: 'cul data',
                data: [0.28, 0.5, 0.69, 0.83, 0.94, 1],
                yAxisID: 'y1',
                borderColor: '#e55a11',
                order: 1
            }
        ]
    }
    // Component logic goes here
    constructor() {
        this.revenueChartOptions = JSON.parse(JSON.stringify(this.options));
        this.MPDChartChartOptions = JSON.parse(JSON.stringify(this.options));
        this.MPDChartChartOptions.plugins.title.text = '# Late Lines to MPD';
        this.CRDChartOptions = JSON.parse(JSON.stringify(this.options));
        this.CRDChartOptions.plugins.title.text = 'Overdue Backlog value to CRD';
        this.MPDChartChartOptions.scales.y1 = {
            type: 'linear',
            position: 'right',
            grid: {
                display: false
            },
            ticks: {
                callback: function(value) {
                    return value*100 + '%';
                }
            }
        }
        this.CRDChartOptions.scales.y1 = {
            type: 'linear',
            position: 'right',
            grid: {
                display: false
            },
            ticks: {
                callback: function(value) {
                    return value*100 + '%';
                }
            }
        }
    }
}