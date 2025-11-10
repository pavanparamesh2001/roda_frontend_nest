import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-case-list-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './case-list-widget.component.html',
  styleUrls: ['./case-list-widget.component.css'],
})
export class CaseListWidgetComponent implements OnInit {
  cases: any[] = [];
  allCases: any[] = [];
  selectedCase: any = null;
  detailPageDialog = false;
  isLoading = true;

  filters = {
    caseId: '',
    vehicleNo: '',
    policyNumber: '',
    contactNumber: '',
    startDate: '',
    endDate: '',
  };

  page = 1;
  limit = 7;
  total = 0;

  statusCounts: any = {
    REG: 0,
    ACTD: 0,
    INPROGRESS: 0,
    RESOLVED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    REESTIMATE: 0,
  };

  constructor(private caseService: CaseService, private router: Router) {}

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.isLoading = true;
    this.caseService.getAllCases(this.page, this.limit, this.filters).subscribe(
      (res: any) => {
        const result = res?.data || res;
        this.allCases = Array.isArray(result) ? result : result.cases || [];
        this.cases = [...this.allCases];
        this.total = result.total || this.cases.length;

        this.applyFrontendFilters();
        this.calculateStatusCounts();
        this.isLoading = false;
      },
      (err) => {
        console.error('Error loading cases:', err);
        this.isLoading = false;
      }
    );
  }

  applyFrontendFilters(): void {
    this.cases = this.allCases.filter((c) => {
      const matchesCaseId =
        !this.filters.caseId ||
        c.caseId?.toLowerCase().includes(this.filters.caseId.toLowerCase());
      const matchesContact =
        !this.filters.contactNumber ||
        c.primaryContactNumber
          ?.toString()
          .includes(this.filters.contactNumber.toString());
      const matchesVehicle =
        !this.filters.vehicleNo ||
        c.vehicleNo?.toLowerCase().includes(this.filters.vehicleNo.toLowerCase());
      const matchesPolicy =
        !this.filters.policyNumber ||
        c.policyNumber?.toLowerCase().includes(this.filters.policyNumber.toLowerCase());

      return matchesCaseId && matchesContact && matchesVehicle && matchesPolicy;
    });
  }

  /** 🔍 Search */
  searchCases(): void {
    this.page = 1;
    this.loadCases();
  }

  resetFilters(): void {
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

  /** 📋 Copy phone */
  copyContactNo(phone: string): void {
    navigator.clipboard.writeText(phone);
    alert('Phone number copied!');
  }

  /** 🔁 Pagination */
  nextPage(): void {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadCases();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCases();
    }
  }

  /** 📈 Status counters */
  calculateStatusCounts(): void {
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

  /** 🧭 Navigate to detail route */
  navigateToDetailpage(caseData: any): void {
    this.router.navigate(['/agent/case-dashboard', caseData._id]);
  }

  /** 🡆 Open modal and fetch case details */
  openCaseDetails(caseId: string): void {
    this.caseService.getCaseById(caseId).subscribe(
      (res: any) => {
        this.selectedCase = res.data || res;
        this.detailPageDialog = true;
      },
      (err) => {
        console.error('Error loading case details:', err);
      }
    );
  }

  /** ❌ Close modal */
  close(): void {
    this.detailPageDialog = false;
    this.selectedCase = null;
  }
}

