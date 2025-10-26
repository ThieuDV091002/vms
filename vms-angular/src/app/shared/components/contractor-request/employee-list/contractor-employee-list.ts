import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contractor-request-employee-list',
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './contractor-employee-list.html',
    styles: ``
})
export class ContractorRequestEmployeeListCardComponent {

    employeeList = [
        {
            id: 1,
            vendor_request_id: 1,
            fullName: "Nguyen Van A",
            dateOfBirth: "1990-05-12",
            vendor_name: "ABC Construction",
            passport: "P1234567",
            management_department: "Mechanical Dept",
            molex_supervisor_name: "John Doe"
        },
        {
            id: 2,
            vendor_request_id: 1,
            fullName: "Tran Thi B",
            dateOfBirth: "1992-11-20",
            vendor_name: "ABC Construction",
            passport: "P9876543",
            management_department: "Electrical Dept",
            molex_supervisor_name: "John Doe"
        },
        {
            id: 3,
            vendor_request_id: 2,
            fullName: "Pham Van C",
            dateOfBirth: "1988-03-15",
            vendor_name: "XYZ Engineering",
            passport: "P4567890",
            management_department: "Safety Dept",
            molex_supervisor_name: "Jane Smith"
        },
        {
            id: 4,
            vendor_request_id: 2,
            fullName: "Le Thi D",
            dateOfBirth: "1995-07-08",
            vendor_name: "XYZ Engineering",
            passport: "P3216549",
            management_department: "Civil Dept",
            molex_supervisor_name: "Jane Smith"
        }
    ];
    file =
        {
            id: 2,
            vendor_request_id: 1,
            fileName: "Employee_List.xlsx",
            url: "/assets/files/Employee_List.xlsx",
            filetype: "document"
        };
}
