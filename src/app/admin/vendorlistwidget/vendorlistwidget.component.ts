import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRegistrationService } from '../../services/vendor-registration.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendorlistwidget',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vendorlistwidget.component.html',
  styleUrls: ['./vendorlistwidget.component.css']
})
export class VendorlistwidgetComponent implements OnInit, OnChanges {

  @Input() filters: any;

  vendors: any[] = [];
  filteredVendors: any[] = [];
  paginatedVendors: any[] = [];

  limit = 10;
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];

  // View modal
  viewModal = false;
  selectedVendor: any = null;

  constructor(
    private svc: VendorRegistrationService,
    private clipboard: Clipboard,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVendors();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] && this.vendors.length) {
      this.applyFilters();
    }
  }

  loadVendors() {
    this.svc.getAllVendors().subscribe((res: any) => {
      this.vendors = res?.data || res || [];
      this.filteredVendors = [...this.vendors];
      this.updatePagination();
    });
  }

  // ----------------------------
  // MISSING METHOD (FIX ADDED)
  // ----------------------------
  viewRemarks(vendor: any) {
    alert("Remarks: " + (vendor?.remarks || "No remarks available"));
  }

  // ----------------------------
  // Open modal and load vendor
  // ----------------------------
  viewDetails(vendor: any) {
    this.svc.getVendor(vendor._id).subscribe((res: any) => {
      this.selectedVendor = res?.data || res;
      this.viewModal = true;
    });
  }

  closeViewModal() {
    this.viewModal = false;
    this.selectedVendor = null;
  }

  applyFilters() {
    let data = [...this.vendors];
    const f = this.filters;

    if (!f) {
      this.filteredVendors = [...this.vendors];
      this.updatePagination();
      return;
    }

    if (f.name?.trim()) {
      data = data.filter(v =>
        v.name?.toLowerCase().includes(f.name.toLowerCase())
      );
    }

    if (f.vendorCode?.trim()) {
      data = data.filter(v =>
        v.vendorCode?.toLowerCase().includes(f.vendorCode.toLowerCase())
      );
    }

    if (f.contactNo?.trim()) {
      data = data.filter(v =>
        v.contactNo?.primary?.includes(f.contactNo)
      );
    }

    if (f.active !== null && f.active !== undefined) {
      data = data.filter(v => v.active === f.active);
    }

    this.filteredVendors = data;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const list = this.filteredVendors.length ? this.filteredVendors : this.vendors;

    this.totalPages = Math.ceil(list.length / this.limit);
    this.totalPagesArray = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

    const start = (this.currentPage - 1) * this.limit;
    this.paginatedVendors = list.slice(start, start + this.limit);
  }

  goToPage(p: number) {
    this.currentPage = p;
    this.updatePagination();
  }

  copyField(value: string, vendor: any, field: string) {
    this.clipboard.copy(value);
    vendor[field] = true;
    setTimeout(() => (vendor[field] = false), 1000);
  }

  toggleStatus(vendor: any) {
    vendor.active = !vendor.active;
    this.svc.updateVendor(vendor._id, { active: vendor.active }).subscribe();
  }

  editVendor(v: any) {
    this.router.navigate(['/vendor-registration', v._id]);
  }
}





