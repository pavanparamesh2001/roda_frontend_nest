import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-case-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-dashboard.component.html',
  styleUrls: ['./case-dashboard.component.css'],
})
export class CaseDashboardComponent implements OnInit {
  caseData: any;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private caseService: CaseService) {}

  ngOnInit(): void {
    // ✅ Get case ID from route parameter
    const caseId = this.route.snapshot.paramMap.get('id');

    if (caseId) {
      this.fetchCaseDetails(caseId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Invalid Case ID. Please go back and try again.';
    }
  }

  /** ✅ Fetch case details from backend by ID */
  fetchCaseDetails(caseId: string): void {
    this.isLoading = true;
    this.caseService.getCaseById(caseId).subscribe(
      (res: any) => {
        // ✅ FIX: Extract actual case data correctly
        this.caseData = res?.data || res;
        this.isLoading = false;
      },
      (err) => {
        console.error('Error fetching case details:', err);
        this.errorMessage = 'Error loading case details. Please try again.';
        this.isLoading = false;
      }
    );
  }

  /** Dummy buttons (for now) */
  manualContact() {
    alert('Manual contact action triggered!');
  }

  openCaseCancelPopup(type: string, status: string, id: string) {
    alert(`Cancel ${type} (${status}) with ID ${id}`);
  }

  /** Utility Getters */
  get isCaseLocationUpdated() {
    return !!this.caseData?.location?.[0]?.coordinates;
  }

  get manualContactCount() {
    return 0;
  }
}

