import { Component, Input } from "@angular/core";
import { SiteHuddleCardStatisticsDto } from "@apis/ticket/dtos";
import { SiteHuddleService } from "@apis/ticket/services";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-site-huddle-summary',
    template: `
        <div class="summary-container d-flex flex-fill flex-wrap">
            <div class="safety-summary">
                <div class="header">{{'::LABEL_Safety' | abpLocalization}}</div>
                <table>
                    <tr>
                        <td rowspan="3">{{'::LABEL_SafetyIncidents' | abpLocalization}}</td>
                        <td>24 {{'::LABEL_Hours' | abpLocalization}}</td>
                        <td class="meet-color">0</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_MTDActual' | abpLocalization}}</td>
                        <td class="not-meet-color">3</td>
                    </tr>
                    <tr>
                        <td>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td rowspan="3">{{'::LABEL_NearMisses' | abpLocalization}}</td>
                        <td>24 {{'::LABEL_Hours' | abpLocalization}}</td>
                        <td class="meet-color">0</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_MTDActual' | abpLocalization}}</td>
                        <td class="meet-color">6</td>
                    </tr>
                    <tr>
                        <td>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</td>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fw-bold">{{'::LABEL_DaysSinceLastIncident' | abpLocalization}}</td>
                        <td>283</td>
                    </tr>
                </table>
            </div>
            <div class="quality-summary">
                <div class="header">{{'::LABEL_Quality' | abpLocalization}}</div>
                <table>
                    <tr>
                        <td rowspan="3">{{'::LABEL_InternalQNs' | abpLocalization}}</td>
                        <td>24 {{'::LABEL_Hours' | abpLocalization}}</td>
                        <td class="meet-color">0</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_MTDActual' | abpLocalization}}</td>
                        <td class="meet-color">6</td>
                    </tr>
                    <tr>
                        <td>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</td>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td rowspan="3">{{'::LABEL_ExternalQNs' | abpLocalization}}</td>
                        <td>24 {{'::LABEL_Hours' | abpLocalization}}</td>
                        <td class="not-meet-color">1</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_MTDActual' | abpLocalization}}</td>
                        <td class="not-meet-color">12</td>
                    </tr>
                    <tr>
                        <td>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</td>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td rowspan="2">COPQ</td>
                        <td>{{'::LABEL_MTDActual' | abpLocalization}}</td>
                        <td >$30,925</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_MTDTarget' | abpLocalization}}</td>
                        <td>$40,000</td>
                    </tr>
                </table>
            </div>
            <div class="productivity-summary">
                <div class="header">{{'::LABEL_Productivity' | abpLocalization}}</div>
                <table>
                    <tr>
                        <td rowspan="3">POEE</td>
                        <td>24 {{'::LABEL_Hours' | abpLocalization}}</td>
                        <td class="not-meet-color">64%</td>
                    </tr>
                    <tr>
                        <td>{{'::LABEL_MTDActual' | abpLocalization}}</td>
                        <td class="meet-color">76%</td>
                    </tr>
                    <tr>
                        <td>{{curMonth}} {{'::LABEL_Target' | abpLocalization}}</td>
                        <td>75%</td>
                    </tr>
                </table>
            </div>
            <div class="supply-chain-summary">
                <div class="header">{{'::LABEL_SupplyChain' | abpLocalization}}</div>
                <table>
                    <tr>
                        <td>{{'::LABEL_Prediction' | abpLocalization}}</td>
                        <td>$1,950k</td>
                    </tr>
                    <tr>
                        <td>{{'::Revenue MTD' | abpLocalization}}</td>
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
        </div>
        <div class="summary-footer">
            <div class="summary-footer-header">
                {{'::LABEL_ActionCardsSummary' | abpLocalization}}
            </div>
            <div class="summary-footer-content d-flex">
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
            display: flex;
            height: 100%;
            flex-direction: column;
            gap: 4px;
        }
        .not-meet-color {
            background-color: #ea0437;
            color: #ffffff;
        }
        .meet-color {
            background-color: #78a42a;
            color: #ffffff;
        }
        .summary-container {
            > div {
                padding: 5px 20px;
                flex: 1 1 50%;
                border: 2px solid var(--lpx-border-color);
                border-right: none;
                border-bottom: none;
                &:nth-child(2n) {
                    border-right: 2px solid var(--lpx-border-color);
                }
                &:nth-child(3), &:nth-child(4){
                    border-bottom: 2px solid var(--lpx-border-color);
                }
                .header {
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.5rem;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: center;
                    font-weight: 500;
                    // height: calc(100% - 50px);
                    td {
                        border: 2px solid #898b8c;
                        padding: 5px;
                        &:Last-child {
                            font-weight: bold;
                        }
                    }
                    td:nth-child(1) {
                        width: 20%;
                    }
                    td:nth-child(2) {
                        width: 45%;
                    }
                    td:nth-child(3) {
                        width: 35%;
                    }
                }
            }
            .supply-chain-summary table{
                td:nth-child(1) {
                    width: 50%;
                }
                td:nth-child(2) {
                    width: 50%;
                }
            }
        }
        .summary-footer {
            height: 100px;
            .summary-footer-header {
                height: 35px;
                background-color: #df2bb5;
                color: #ffffff;
                text-align: center;
                font-weight: 500;
                font-size: 1.2rem;
                line-height: 35px;
            }
            .summary-footer-content {
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
                        background-color: #f7caec;
                        border-radius: 10px;
                        font-weight: bold;
                        color: #000000;
                    }
                }
            }
        }
    `]
})
export class SiteHuddleSummaryComponent {
    @Input() site: any = {};
    @Input() selectedDataTier: any;
    monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    curMonth = this.monthShortNames[new Date().getMonth()];
    cardType = 'All';
    actionCardsData: SiteHuddleCardStatisticsDto = {} as SiteHuddleCardStatisticsDto;
    subscription: Subscription;

    constructor(private siteHuddleService: SiteHuddleService) {}

    ngOnInit(): void {
        this.getActionCardsData();
    }

    ngOnChanges(): void {
        this.getActionCardsData();
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
    }
}
