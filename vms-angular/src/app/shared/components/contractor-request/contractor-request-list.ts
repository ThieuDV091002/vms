import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../ui/button/button.component';
import {CheckboxComponent} from "../form/input/checkbox.component";
import {Router} from "@angular/router";
import {BadgeComponent} from "../ui/badge/badge.component";

interface ContractorRequest {
    id: number;
    company: string;
    work_permit: string;
    working_area: string;
    start_date: string;
    end_date: string;
    mxv_supervisor_status: "Approved" | "Rejected" | "Pending";
    ehs_status: "Approved" | "Rejected" | "Pending";
}

@Component({
    selector: 'app-contractor-request-list',
    imports: [
        CommonModule,
        ButtonComponent,
        BadgeComponent,
    ],
    templateUrl: './contractor-request-list.html',
    styles: ``
})
export class ContractorRequestListComponent {

    contractorRequestData: ContractorRequest[] = [
        {
            id: 1,
            company: "ABC Engineering Co., Ltd.",
            work_permit: "WP-2025-001",
            working_area: "Production Line A",
            start_date: "2025-09-20",
            end_date: "2025-09-30",
            mxv_supervisor_status: "Approved",
            ehs_status: "Rejected"
        },
        {
            id: 2,
            company: "Global Tech Services",
            work_permit: "WP-2025-002",
            working_area: "Warehouse Zone 3",
            start_date: "2025-09-22",
            end_date: "2025-10-05",
            mxv_supervisor_status: "Approved",
            ehs_status: "Pending"
        },
        {
            id: 3,
            company: "SafeBuild Contractors",
            work_permit: "WP-2025-003",
            working_area: "Office Renovation Area",
            start_date: "2025-09-25",
            end_date: "2025-10-10",
            mxv_supervisor_status: "Approved",
            ehs_status: "Approved"
        },
        {
            id: 4,
            company: "GreenPower Electrical",
            work_permit: "WP-2025-004",
            working_area: "Substation Room",
            start_date: "2025-09-21",
            end_date: "2025-09-28",
            mxv_supervisor_status: "Pending",
            ehs_status: "Pending"
        },
        {
            id: 5,
            company: "CoolAir Systems",
            work_permit: "WP-2025-005",
            working_area: "HVAC Maintenance Zone",
            start_date: "2025-09-23",
            end_date: "2025-10-02",
            mxv_supervisor_status: "Rejected",
            ehs_status: "Pending"
        },
        {
            id: 6,
            company: "SteelPro Construction",
            work_permit: "WP-2025-006",
            working_area: "New Extension Building",
            start_date: "2025-09-24",
            end_date: "2025-10-15",
            mxv_supervisor_status: "Pending",
            ehs_status: "Pending"
        }
    ]


    currentPage = 1;
    itemsPerPage = 5;

    get totalPages(): number {
        return Math.ceil(this.contractorRequestData.length / this.itemsPerPage);
    }

    get currentItems(): ContractorRequest[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.contractorRequestData.slice(start, start + this.itemsPerPage);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    getBadgeColor(status: string): 'success' | 'error' | 'warning' {
        if (status === 'Approved') return 'success';
        if (status === 'Rejected') return 'error';
        return 'warning';
    }

    constructor(private router: Router) {}

    goToDetail(id: number) {
        this.router.navigate(['/contractor-requests-detail']);
    }
}
