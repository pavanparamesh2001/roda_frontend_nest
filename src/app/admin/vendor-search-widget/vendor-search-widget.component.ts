import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VendorRegistrationService } from '../../services/vendor-registration.service';

@Component({
  selector: 'app-vendor-search-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vendor-search-widget.component.html',
  styleUrls: ['./vendor-search-widget.component.css']
})
export class VendorSearchWidgetComponent implements OnInit {

  @Output() onSearch = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<void>();

  name: string = '';
  vendorCode: string = '';
  contactNo: string = '';
  selectedState: string | null = null;
  selectedDistrict: string | null = null;
  selectedStatus: boolean | '' = '';

  startDate: string = '';
  endDate: string = '';

  states: any[] = [];
  districts: any[] = [];

  vendorStatus = [
    { name: 'Active', key: true },
    { name: 'Inactive', key: false },
  ];

  constructor(
    private svc: VendorRegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStates();
  }

  // ───────────────────────────────────────────────
  // LOAD STATES
  // ───────────────────────────────────────────────
  loadStates() {
    this.svc.getStates().subscribe((res: any) => {
      this.states = res?.data?.states || res || [];
    });
  }

  // ───────────────────────────────────────────────
  // CHANGE STATE → LOAD DISTRICTS
  // ───────────────────────────────────────────────
  onChangestate(event: any) {
    const stateId = event.target.value;
    this.selectedDistrict = null;
    this.districts = [];

    if (!stateId) return;

    this.svc.getDistrictsByState(stateId).subscribe((res: any) => {
      const payload = res?.data?.districts || res?.districts || res;
      this.districts = payload.map((d: any) => ({
        id: d._id,
        name: d.name,
      }));
    });
  }

  onChangedistrict(event: any) {
    this.selectedDistrict = event.target.value;
  }

  onChangedstatus(event: any) {
    this.selectedStatus = event.target.value;
  }

  // ───────────────────────────────────────────────
  // SEARCH EMIT
  // ───────────────────────────────────────────────
  search() {
    this.onSearch.emit({
      name: this.name,
      vendorCode: this.vendorCode,
      contactNo: this.contactNo,
      state: this.selectedState,
      district: this.selectedDistrict,
      active: this.selectedStatus === '' ? null : this.selectedStatus,
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  // ───────────────────────────────────────────────
  // CLEAR EVENT
  // ───────────────────────────────────────────────
  clear() {
    this.name = '';
    this.vendorCode = '';
    this.contactNo = '';
    this.selectedState = null;
    this.selectedDistrict = null;
    this.selectedStatus = '';
    this.startDate = '';
    this.endDate = '';

    this.districts = [];

    this.onClear.emit();
  }

  // ───────────────────────────────────────────────
  // ⭐ NAVIGATE TO ADD VENDOR PAGE
  // ───────────────────────────────────────────────
  navigateToVendorRegistration() {
    this.router.navigate(['/admin/vendors/create']);
  }
  handleSearch(filters: any) {
  console.log('Search filters received:', filters);
}

}


