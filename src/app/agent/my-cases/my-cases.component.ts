import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-my-cases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-cases.component.html',
  styleUrls: ['./my-cases.component.css'],
})
export class MyCasesComponent implements OnInit {
  cases: any[] = [];
  allCases: any[] = [];
  selectedCase: any = null;
  detailPageDialog = false;

  isLoading = false;
  page = 1;
  limit = 7;
  total = 0;

  filters = {
    caseId: '',
    vehicleNo: '',
    policyNumber: '',
    contactNumber: '',
    startDate: '',
    endDate: '',
  };

  statusCounts = {
    REG: 0,
    ACTD: 0,
    INPROGRESS: 0,
    RESOLVED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    REESTIMATE: 0,
  };

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit() {
    this.loadCases();
  }

  loadCases() {
    this.isLoading = true;

    this.caseService.getAllCases(this.page, this.limit, this.filters).subscribe(
      (res: any) => {
        const data = res?.data || res;
        this.allCases = Array.isArray(data) ? data : data.cases || [];
        this.cases = [...this.allCases];
        this.total = data.total || this.cases.length;

        this.applyFrontendFilters();
        this.calculateStatusCounts();
        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }

  applyFrontendFilters() {
    this.cases = this.allCases.filter((c) =>
      (!this.filters.caseId || c.caseId?.toLowerCase().includes(this.filters.caseId.toLowerCase())) &&
      (!this.filters.vehicleNo || c.vehicleNo?.toLowerCase().includes(this.filters.vehicleNo.toLowerCase())) &&
      (!this.filters.policyNumber || c.policyNumber?.toLowerCase().includes(this.filters.policyNumber.toLowerCase())) &&
      (!this.filters.contactNumber || c.primaryContactNumber?.includes(this.filters.contactNumber))
    );
  }

  searchCases() {
    this.page = 1;
    this.loadCases();
  }

  resetFilters() {
    this.filters = {
      caseId: '',
      vehicleNo: '',
      policyNumber: '',
      contactNumber: '',
      startDate: '',
      endDate: '',
    };
    this.searchCases();
  }

  calculateStatusCounts() {
    this.statusCounts = {
      REG: this.cases.filter((c) => c.status === 'REG').length,
      ACTD: this.cases.filter((c) => c.status === 'ACTD').length,
      INPROGRESS: this.cases.filter((c) => c.status === 'INPROGRESS').length,
      RESOLVED: this.cases.filter((c) => c.status === 'RESOLVED').length,
      COMPLETED: this.cases.filter((c) => c.status === 'COMPLETED').length,
      CANCELLED: this.cases.filter((c) => c.status === 'CANCELLED').length,
      REESTIMATE: this.cases.filter((c) => c.isReestimate).length,
    };
  }

  copyContactNo(phone: string) {
    navigator.clipboard.writeText(phone);
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadCases();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadCases();
    }
  }

  navigateToDetailpage(data: any) {
    this.router.navigate(['/agent/case-dashboard', data._id]);
  }

  openCaseDetails(id: string) {
    this.caseService.getCaseById(id).subscribe((res: any) => {
      this.selectedCase = res.data || res;
      this.detailPageDialog = true;
    });
  }

  close() {
    this.detailPageDialog = false;
    this.selectedCase = null;
  }

  createCase() {
    this.router.navigate(['/agent/createcase']);
  }
}
