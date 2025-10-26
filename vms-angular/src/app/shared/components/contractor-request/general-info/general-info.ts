import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contractor-request-general',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './general-info.html',
    styles: ``
})
export class ContractorRequestGeneralCardComponent {

    request = {
        work_permit_code: "WP-2025-001",
        old_work_permit_code: "",
        vendor_name: "ABC Construction",
        molex_supervisor_email: "john.doe@molex.com",
        molex_supervisor_name: "John Doe",
        vendor_email: "contact@abc-construction.com",
        vendor_supervisor_name: "Mr. Tan",
        vendor_supervisor_phone: "0123456789",
        working_area: "Factory Zone A",
        start_date: "2025-09-01",
        end_date: "2025-09-30",
        employee_number: 5,
        work_description: "Install new air ventilation system",
        request_type: "New Registration",
        jobSelection: {
            id: 1,
            vendor_request_id: 1,
            job_type_id: 1,
            job_type_name: "Installation",
            job_section_id: 1,
            job_section_name: "Mechanical",
            job_option_id: 1,
            job_option_name: "Welding",
        },
        requestTextValues: {
            id: 1,
            vendor_request_id: 1,
            job_type_id: 1,
            job_type_name: "Installation",
            text_field_id: 1,
            text_field_name: "Welding",
            value: "Need 3 welding machines",
        }
    };
}
