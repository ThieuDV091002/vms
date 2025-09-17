import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UrlWidgetComponent } from './url-widget/url-widgetcomponent';
import { PageModule } from '@abp/ng.components/page';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { WidgetTemplateComponent } from './widget-template/widget-template.component';
import { StandardSingleComponent } from './standard-single/standard-single.component';
import { StandardWidgetComponent } from './standard-widget/standard-widget.component';
import { SupportTeamWidgetComponent } from './support-team-widget/support-team-widget.component';
import { LinkWidgetComponent } from './link-widget/link-widget.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TagInputModule } from 'ngx-chips';
import { RoleBoardComponent } from './role-board/role-board.component';
import { RoleBoardTaskComponent } from './role-board/role-board-task.component';
import { ChartModule } from '@abp/ng.components/chart.js';
import { QuillModule } from 'ngx-quill';
import { ImportDetailComponent } from './modeling-import-details.component';
import { CommentEntryWidgetComponent } from './comment-entry-widget/comment-entry-widget.component';
import { CommentEntryComponent } from './comment-entry/comment-entry.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommentDisplayWidgetComponent } from './comment-display-widget/comment-display-widget.component';
import { ActivityCardWidgetComponent } from './activity-card-widget/activity-card-widget.component';
import { CardListViewComponent } from './card-list-view/card-list-view.component';
import { KanbanBoardComponent } from "./kanban-board/kanban-board.component";
import { ActivityCardTileComponent } from './kanban-board/activity-card-tile.component';
import { CardEditorComponent } from './card-editor/card-editor.component';
import { StandardAloneComponent } from './standard-alone/standard-alone.component';
import { WorkOrderDataComponent } from './work-order-data/work-order-data.component';
import { LaborDataComponent } from './labor-data/labor-data.component';
import { ProductionQtyDataComponent } from './production-qty-data/production-qty-data.component';
import { ScrapQtyDataComponent } from './scrap-qty-data/scrap-qty-data.component';
import { ReworkQtyDataComponent } from './rework-qty-data/rework-qty-data.component';
import { DowntimeDataComponent } from './downtime-data/downtime-data.component';
import { BreaktimeDataComponent } from './breaktime-data/breaktime-data.component';
import { ProductionDataManagementComponent } from './production-data-management/production-data-management.component';
import { ProductionReviewWidgetComponent } from './production-review-widget/production-review-widget.component';
import { ProductionReviewMachineFocusComponent } from './production-review-machine-focus/production-review-machine-focus.component';
import { ProductionReviewLaborFocusComponent } from './production-review-labor-focus/production-review-labor-focus.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AddCommentDataComponent } from './add-comment-data/add-comment-data.component';
import { WidgetContainerComponent } from './widget-container/widget-container.component';
import { ZeroIncidentByDaysWidgetComponent } from './zero-incident-by-days-widget/zero-incident-by-days-widget.component';
import { QualityCalendarWidgetComponent } from './quality-calendar-widget/quality-calendar-widget.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { PowerBiWidgetComponent } from './power-bi-widget/power-bi-widget.component';
import { TopScrapReasonsChartWidgetComponent } from './top5-chart-widget/top-scrap-reasons-chart.component-widget';
import { TopDowntimeReasonsChartWidgetComponent } from './top5-chart-widget/top-downtime-reasons-chart-widget.component';
import { TopPerformanceProductsChartWidgetComponent } from './top5-chart-widget/top-performance-products-chart-widget.component';
import { CardCreatorComponent } from './card-editor/card-creator.component';
import { CardPageComponent } from './card-page/card-page.component';
import { AssessmentRuleComponent } from './assessment-rule/assessment-rule.component';
import { AssessmentWidgetComponent } from './assessment-widget/assessment-widget.component';
import { SafetySiteInfoWidgetComponent } from './safety-site-info-widget/safety-site-info-widget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TodoListManageWidgetComponent } from './todo-list-manage-widget/todo-list-manage-widget.component';
import { ViewStandardsComponent } from './todo-list-manage-widget/view-standards/view-standards.component';
import { BroadcastMessageManagementComponent } from './broadcast-message-management/broadcast-message-management.component';
import { BroadcastMessageEntryComponent } from './broadcast-message-entry/broadcast-message-entry.component';
import { BroadcastMessageViewComponent } from './broadcast-message-view/broadcast-message-view.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SiteHuddleDailyComponent } from './site-huddle/site-huddle-daily.component';
import { CellHuddleChartWidgetComponent } from './cell-huddle-chart-widget/cell-huddle-chart-widget.component';
import { AreaHuddleKpiTableComponent } from './area-huddle-kpi-table/area-huddle-kpi-table.component';
import { AreaHuddleQnTableComponent } from './area-huddle-qn-table/area-huddle-qn-table.component';
import { AreaHuddleChartComponent } from './area-huddle-chart/area-huddle-chart.component';
import { SiteHuddleSummaryComponent } from './site-huddle/site-huddle-summary.component';
import { SiteHuddleSafetyComponent } from './site-huddle/site-huddle-safety.component';
import { SiteHuddleSupplyChainComponent } from './site-huddle/site-huddle-supply-chain.component';
import { SiteHuddleQualityComponent } from './site-huddle/site-huddle-quality.component';
import { SiteHuddleProductivityComponent } from './site-huddle/site-huddle-productivity.component';
import { SiteHuddleMonthlySummaryViewComponent } from './site-huddle/site-huddle-monthly-summary-view/site-huddle-monthly-summary-view.component';
import { SiteHuddleMonthlyViewComponent } from './site-huddle/site-huddle-monthly-view/site-huddle-monthly-view.component';
import { SiteHuddleMonthlySafetyViewComponent } from './site-huddle/site-huddle-monthly-safety-view/site-huddle-monthly-safety-view.component';
import { SiteHuddleMonthlyQualityViewComponent } from './site-huddle/site-huddle-monthly-quality-view/site-huddle-monthly-quality-view.component';
import { SiteHuddleMonthlyProductivityViewComponent } from './site-huddle/site-huddle-monthly-productivity-view/site-huddle-monthly-productivity-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MyTodoListWidgetComponent } from './my-todo-list-widget/my-todo-list-widget.component';
import { ProductionReviewBoardComponent } from './production-review-board/production-review-board.component';
import { ProductionReviewTableComponent } from './production-review-table/production-review-table.component';
import { TopDowntimeReasonsChartComponent } from './chart-widget/top-downtime-reasons-chart.component';
import { TopPerformanceProductsChartComponent } from './chart-widget/top-performance-products-chart.component';
import { TopScrapReasonsChartComponent } from './chart-widget/top-scrap-reasons-chart.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: ':id',
    component: DashboardComponent
  },
  {
    path: 'board/role-board',
    component: RoleBoardComponent
  },
  {
    path: 'card/kanban-board',
    component: KanbanBoardComponent
  },
  {
    path: 'card/card-editor',
    component: CardEditorComponent
  },
  {
    path: 'card/:code',
    component: CardPageComponent
  },
  {
    path: 'standard/:id',
    component: StandardAloneComponent
  },
  {
    path: 'review/production',
    component: ProductionReviewWidgetComponent
  },
  {
    path: 'production-review/machine-focus',
    component: ProductionReviewMachineFocusComponent
  },
  {
    path: 'production-review/labor-focus',
    component: ProductionReviewLaborFocusComponent
  },
  {
    path: 'powerbi/groups/:groupId/reports/:reportId',
    component: PowerBiWidgetComponent
  }
]

@NgModule({
  declarations: [
    WidgetContainerComponent,
    DashboardComponent,
    UrlWidgetComponent,
    WidgetTemplateComponent,
    StandardSingleComponent,
    StandardWidgetComponent,
    SupportTeamWidgetComponent,
    LinkWidgetComponent,
    RoleBoardComponent,
    RoleBoardTaskComponent,
    ImportDetailComponent,
    CommentEntryWidgetComponent,
    CommentEntryComponent,
    CommentDisplayWidgetComponent,
    ActivityCardWidgetComponent,
    CardListViewComponent,
    KanbanBoardComponent,
    ActivityCardTileComponent,
    CardEditorComponent,
    StandardAloneComponent,
    WorkOrderDataComponent,
    LaborDataComponent,
    ProductionQtyDataComponent,
    ScrapQtyDataComponent,
    ReworkQtyDataComponent,
    DowntimeDataComponent,
    BreaktimeDataComponent,
    ProductionDataManagementComponent,
    ProductionReviewWidgetComponent,
    ProductionReviewMachineFocusComponent,
    ProductionReviewLaborFocusComponent,
    AddCommentDataComponent,
    ZeroIncidentByDaysWidgetComponent,
    QualityCalendarWidgetComponent,
    PowerBiWidgetComponent,
    TopScrapReasonsChartWidgetComponent,
    TopDowntimeReasonsChartWidgetComponent,
    TopPerformanceProductsChartWidgetComponent,
    TopScrapReasonsChartComponent,
    TopDowntimeReasonsChartComponent,
    TopPerformanceProductsChartComponent,
    CardCreatorComponent,
    CardPageComponent,
    AssessmentWidgetComponent,
    AssessmentRuleComponent,
    SafetySiteInfoWidgetComponent,
    TodoListManageWidgetComponent,
    ViewStandardsComponent,
    BroadcastMessageManagementComponent,
    BroadcastMessageEntryComponent,
    BroadcastMessageViewComponent,
    SiteHuddleDailyComponent,
    CellHuddleChartWidgetComponent,
    AreaHuddleKpiTableComponent,
    AreaHuddleQnTableComponent,
    AreaHuddleChartComponent,
    SiteHuddleSummaryComponent,
    SiteHuddleSafetyComponent,
    SiteHuddleQualityComponent,
    SiteHuddleProductivityComponent,
    SiteHuddleSupplyChainComponent,
    SiteHuddleMonthlySummaryViewComponent,
    SiteHuddleMonthlyViewComponent,
    SiteHuddleMonthlySafetyViewComponent,
    SiteHuddleMonthlyQualityViewComponent,
    SiteHuddleMonthlyProductivityViewComponent,
    MyTodoListWidgetComponent,
    ProductionReviewBoardComponent,
    ProductionReviewTableComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    NgSelectModule,
    PageModule,
    ThemeSharedModule,
    RouterModule.forChild(routes),
    TooltipModule,
    TagInputModule,
    ChartModule,
    BsDatepickerModule,
    QuillModule.forRoot(),
    FullCalendarModule,
    PowerBIEmbedModule,
    NgbModule,
    CarouselModule,
    DragDropModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
